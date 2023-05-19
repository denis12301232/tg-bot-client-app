import type { SocketTyped, IUser } from '@/types'
import { type Ref, ref, reactive, onMounted, onUnmounted } from 'vue'
import { ENV } from '@/util';
import { WebRtcDto } from '@/api/dto';


export default function useWebRtc(socket: SocketTyped, myId: string, opts?: WebRtcOpts) {
   const abonents = ref<Map<string, Abonent>>(new Map);
   const streams = reactive<Streams>({ camera: new Map, screen: new Map });
   const streamIds: StreamIds = { camera: new Set, screen: new Set };
   const events = useWebRtcEvents({ socket, streams, myId, streamIds, abonents, opts });

   onMounted(() => events.forEach((func, event) => socket.on(event, func)));
   onUnmounted(() => events.forEach((func, event) => socket.removeListener(event, func)));

   async function captureMyStream(type: 'camera' | 'screen', opts: MediaStreamConstraints) {
      const stream = type === 'camera'
         ? await navigator.mediaDevices.getUserMedia(opts)
         : await navigator.mediaDevices.getDisplayMedia(opts);

      const onEnded = () => {
         streams[type].delete(myId);
         const msg = new WebRtcDto('track:end', { peerId: myId, type }).toString();
         abonents.value.forEach((a) => a.channel?.send(msg));
      }

      stream.getTracks().forEach(track => track.onended = onEnded);
      type === 'camera' ? streams.camera.set(myId, stream) : streams.screen.set(myId, stream);

      return stream;
   }

   return { abonents, streams, streamIds, captureMyStream }
}


function useWebRtcEvents({ socket, myId, abonents, streams, streamIds, opts }: WebRtcEventsOpts) {
   let ignoreOffer = false;
   let makingOffer = false;
   const events = {
      'webrtc:add-peer': onWebRtcAddPeer,
      'webrtc:remove-peer': onWebRtcRemovePeer,
      'webrtc:sdp': onWebRtcSdp,
      'webrtc:ice': onWebRtcIce,
   };

   function onWebRtcAddPeer(peerId: string, offer: boolean, user?: IUser) {
      const abonent = abonents.value.set(peerId, { info: user, polite: !offer }).get(peerId)!;
      abonent.peer = new RTCPeerConnection({ iceServers: [{ urls: ENV.STUN_SERVERS }] });
      abonent.peer.onicecandidate = (e) => e.candidate && socket.emit('webrtc:ice', peerId, e.candidate);
      abonent.peer.ontrack = ({ streams: [stream] }) => {
         if (streamIds.camera.has(stream.id)) {
            streams.camera.set(peerId, stream);
         } else if (streamIds.screen.has(stream.id)) {
            streams.screen.set(peerId, stream);
         }
         
         abonents.value.forEach((a) => a.channel?.send(new WebRtcDto('track:toggle-init', myId).toString()));
      }

      abonent.peer.oniceconnectionstatechange = () => {
         if (abonent.peer?.iceConnectionState === 'failed') {
            abonent.peer.restartIce();
         }
      }
      abonent.peer.onnegotiationneeded = async () => {
         try {
            makingOffer = true;
            await abonent.peer?.setLocalDescription();
            socket.emit('webrtc:sdp', peerId, abonent.peer?.localDescription!);
         } catch (err) {
            console.error(err);
         } finally {
            makingOffer = false;
         }
      }

      if (offer) {
         abonent.channel = abonent.peer.createDataChannel('channel');
         abonent.channel.onopen = () => {
            addMyStream(peerId);
            opts?.setChannelEvents && opts.setChannelEvents(abonent.channel!);
         }
      } else {
         abonent.peer.ondatachannel = (e) => {
            abonent.channel = e.channel;
            abonent.channel.onopen = () => {
               addMyStream(peerId);
               opts?.setChannelEvents && opts.setChannelEvents(abonent.channel!);
            }
         }
      }
   }

   function onWebRtcRemovePeer(peerId: string) {
      const abonent = abonents.value.get(peerId);
      if (abonent) {
         abonent.channel?.close();
         abonent.peer?.close();
         abonents.value.delete(peerId);
         streams.camera.delete(peerId);
         streams.screen.delete(peerId);
      }
   }

   async function onWebRtcSdp(peerId: string, sdp: RTCSessionDescriptionInit) {
      try {
         const abonent = abonents.value.get(peerId)
         const offerCollision = sdp.type === 'offer' && (makingOffer || abonent?.peer?.signalingState !== 'stable');

         ignoreOffer = !abonent?.polite && offerCollision;
         if (ignoreOffer) {
            return;
         }
         await abonent?.peer?.setRemoteDescription(sdp);
         if (sdp.type === 'offer') {
            await abonent?.peer?.setLocalDescription();
            socket.emit('webrtc:sdp', peerId, abonent?.peer?.localDescription!);
         }
      } catch (err) {
         console.error(err);
      }
   }

   function onWebRtcIce(peerId: string, ice: RTCIceCandidate) {
      abonents.value.get(peerId)?.peer?.addIceCandidate(new RTCIceCandidate(ice));
   }

   function addMyStream(peerId: string) {
      for (const type of ['camera', 'screen'] as ['camera', 'screen']) {
         const stream = streams[type].get(myId);
         if (stream) {
            const msg = new WebRtcDto('identify-stream', { type, id: stream.id }).toString();
            abonents.value.get(peerId)?.channel?.send(msg)
            stream?.getTracks().forEach((track) => abonents.value.get(peerId)?.peer?.addTrack(track, stream));
         }
      }
   }

   return new Map<keyof typeof events, typeof events[keyof typeof events]>(Object.entries(events) as any);
}


interface WebRtcEventsOpts {
   socket: SocketTyped;
   myId: string;
   abonents: Ref<Map<string, Abonent>>;
   streams: Streams;
   streamIds: StreamIds;
   opts?: WebRtcOpts;
}

interface Abonent {
   peer?: RTCPeerConnection;
   channel?: RTCDataChannel;
   info?: IUser;
   polite?: boolean;
}

interface Streams {
   screen: Map<string, MediaStream>;
   camera: Map<string, MediaStream>;
}

interface WebRtcOpts {
   setChannelEvents?: (channel: RTCDataChannel) => void;
}

interface StreamIds {
   screen: Set<string>;
   camera: Set<string>;
}
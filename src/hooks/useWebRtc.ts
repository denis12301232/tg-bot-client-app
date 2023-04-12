import type { CallInfo, SocketTyped } from '@/types';
import { ref, onMounted, onUnmounted, onBeforeUnmount, type Ref } from 'vue';
import { ENV } from '@/util';

interface EventsConfig {
   abonents: Ref<Map<string, CallInfo>>
   MY_VIDEO: string;
   socket: SocketTyped;
   setChannelEvents?: (channel: RTCDataChannel) => void;
}

interface WebRtcOpts {
   setChannelEvents?: (channel: RTCDataChannel) => void;
}

export default function useWebRtc(socket: SocketTyped, opts?: WebRtcOpts) {
   const abonents = ref<Map<string, CallInfo>>(new Map());
   const MY_VIDEO = 'MY_VIDEO';
   const events = useEvents({ abonents, socket, MY_VIDEO, setChannelEvents: opts?.setChannelEvents });

   onMounted(() => events.forEach((func, event) => socket.on(event, func)));
   onUnmounted(() => events.forEach((func, event) => socket.removeListener(event, func)));
   onBeforeUnmount(() => abonents.value.get(MY_VIDEO)?.stream?.getTracks().forEach((track) => track.stop()));

   return { abonents, MY_VIDEO }
}

function useEvents({ abonents, MY_VIDEO, socket, setChannelEvents }: EventsConfig) {
   const list = {
      'rtc:add-peer': onAddPeer,
      'rtc:session-description': onSessionDescription,
      'rtc:ice-candidate': onIceCandidate,
      'rtc:remove-peer': onRemovePeer
   }

   async function onAddPeer(peer_id: string, offer: boolean) {
      const newAbonent = abonents.value.set(peer_id, { peer: null, stream: null }).get(peer_id)!;
      newAbonent.peer = new RTCPeerConnection({ iceServers: [{ urls: ENV.STUN_SERVERS }] });
      newAbonent.peer.onicecandidate = (e) => e.candidate && socket.emit('rtc:relay-ice', peer_id, e.candidate);
      newAbonent.peer.ontrack = ({ streams: [stream] }) => (newAbonent.stream = stream);
      abonents.value.get(MY_VIDEO)?.stream?.getTracks()
         .forEach((track) => abonents.value.get(peer_id)?.peer?.addTrack(track, abonents.value.get(MY_VIDEO)!.stream!));
      setChannelEvents && (newAbonent.peer!.ondatachannel = (e) => {
         newAbonent.channel = e.channel;
         setChannelEvents(newAbonent.channel);
      });

      newAbonent.peer.onnegotiationneeded = async () => {
         if (!offer) return;

         if (setChannelEvents) {
            newAbonent.channel = newAbonent.peer!.createDataChannel('channel');
            setChannelEvents(newAbonent.channel);
         }
         const off = await newAbonent.peer?.createOffer();
         await newAbonent.peer?.setLocalDescription(off);
         socket.emit('rtc:relay-sdp', peer_id, off!);
      }
   }

   async function onSessionDescription(peer_id: string, sessionDescription: RTCSessionDescriptionInit) {
      const newAbonent = abonents.value.get(peer_id)!;
      newAbonent.peer?.setRemoteDescription(new RTCSessionDescription(sessionDescription));

      if (sessionDescription.type !== 'offer') return;

      const answer = await newAbonent.peer?.createAnswer()!;
      await newAbonent.peer?.setLocalDescription(answer);
      socket.emit('rtc:relay-sdp', peer_id, answer);
   }

   function onIceCandidate(peer_id: string, iceCandidate: RTCIceCandidate) {
      abonents.value.get(peer_id)?.peer?.addIceCandidate(new RTCIceCandidate(iceCandidate));
   }

   function onRemovePeer(peer_id: string) {
      const abonent = abonents.value.get(peer_id);
      if (abonent) {
         abonent.peer?.close();
         abonent.channel?.close();
         abonents.value.delete(peer_id);
      }
   }

   return new Map<keyof typeof list, typeof list[keyof typeof list]>(Object.entries(list) as any);
}
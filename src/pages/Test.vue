<template>
  <QBtn @click="callToUser">CALL</QBtn>
  <QBtn @click="answer">ANSWER</QBtn>
  <QBtn @click="endCall">END</QBtn>
  <!-- <video muted autoplay playsinline ref="myVideo"></video>
  <video autoplay playsinline ref="userVideo"></video> -->
  <video
    v-for="client of Object.keys(data)"
    autoplay
    playsinline
    :muted="client === 'MY_VIDEO'"
    :ref="(ref) => setRef(ref, client)"
  ></video>
</template>

<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount, reactive, computed } from 'vue';
import { useChatStore } from '@/stores';

interface Info {
  peer: RTCPeerConnection | null;
  video: HTMLVideoElement | null;
  stream: MediaStream | null;
}
const props = withDefaults(defineProps<{ call: 'incoming' | 'outgoing'; chat_id: string }>(), {chat_id: '641803c55bc415aec360d861'});
const chatStore = useChatStore();
const videoModal = ref(false);
const isCalling = ref(false);
const MY_VIDEO = 'MY_VIDEO';
const { socket } = chatStore;
const data = reactive<{ [name: string]: Info }>({});
const mute = reactive({ video: false, audio: false });
const abonent = computed(() => chatStore.chats.get(props.chat_id)?.companion);

onMounted(() => {
  socket.on('rtc:add-peer', onAddPeer);
  socket.on('rtc:session-description', onSessionDescription);
  socket.on('rtc:ice-candidate', onIceCandidate);
  socket.on('rtc:remove-peer', onRemovePeer);
});
onBeforeUnmount(endCall);

async function callToUser() {
  isCalling.value = true;
  data[MY_VIDEO] = { peer: null, stream: null, video: null };
  data[MY_VIDEO].stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  socket.emit('rtc:call', props.chat_id);
}

async function answer() {
  data[MY_VIDEO] = { peer: null, stream: null, video: null };
  data[MY_VIDEO].stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  socket.emit('rtc:answer', true, props.chat_id);
}

async function onAddPeer(peer_id: string, offer: boolean) {
  data[peer_id] = { peer: null, stream: null, video: null };
  data[peer_id].peer = new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] });
  data[peer_id].peer!.onicecandidate = event =>
    event.candidate && socket.emit('rtc:relay-ice', peer_id, event.candidate);
  data[peer_id].peer!.ontrack = ({ streams: [stream] }) => (data[peer_id].stream = stream);
  data[MY_VIDEO].stream!.getTracks().forEach(track => data[peer_id].peer?.addTrack(track, data[MY_VIDEO].stream!));
  data[peer_id].peer!.onnegotiationneeded = async () => {
    if (offer && data[peer_id].peer?.connectionState !== 'connected') {
      const off = await data[peer_id].peer!.createOffer();
      await data[peer_id].peer!.setLocalDescription(off);
      socket.emit('rtc:relay-sdp', peer_id, off);
    }
  };
}

async function onSessionDescription(peer_id: string, sessionDescription: RTCSessionDescriptionInit) {
  data[peer_id].peer!.setRemoteDescription(new RTCSessionDescription(sessionDescription));

  if (sessionDescription.type === 'offer') {
    const answer = await data[peer_id].peer!.createAnswer();
    await data[peer_id].peer!.setLocalDescription(answer);
    socket.emit('rtc:relay-sdp', peer_id, answer);
  }
}

function onIceCandidate(peer_id: string, iceCandidate: RTCIceCandidate) {
  data[peer_id].peer?.addIceCandidate(new RTCIceCandidate(iceCandidate));
}

function onRemovePeer(peer_id: string) {
  data[MY_VIDEO].stream?.getTracks().forEach(track => track.stop());
  data[peer_id].peer?.close();
  delete data[peer_id];
}

function setRef(ref: any, peer_id: string) {
  if (ref) {
    data[peer_id].video = ref;
    data[peer_id].video!.srcObject = data[peer_id].stream;
  }
}

function endCall() {
  Object.keys(data).length > 1 && socket.emit('rtc:remove-peer', props.chat_id);
}

function cancelCall() {
  socket.emit('rtc:call-cancel', props.chat_id);
}

function toggleTrackMute(type: 'video' | 'audio', stream: MediaStream) {
  const track = stream
    .getTracks()
    .filter(track => track.kind === type)
    .at(0);
  if (track) {
    track.enabled = !track.enabled;
    mute[type] = !mute[type];
  }
}
// import { ref, onMounted } from 'vue';
// import { useChatStore } from '@/stores';

// const { socket } = useChatStore();
// const chatId = ref('641803c55bc415aec360d861');
// const clients = ref<Set<string>>(new Set(['MY_VIDEO']));
// const peers = ref<Map<string, RTCPeerConnection>>(new Map());
// const videos = ref<Map<string, HTMLVideoElement>>(new Map());
// const streams = ref<Map<string, MediaStream>>(new Map());

// onMounted(async () => {
//   socket.on('rtc:call', (peer_id, chat_id) => (chatId.value = chat_id));
//   socket.on('rtc:add-peer', onAddPeer);
//   socket.on('rtc:session-description', onSessionDescription);
//   socket.on('rtc:ice-candidate', (peer_id, iceCandidate) => {
//     peers.value.get(peer_id)?.addIceCandidate(new RTCIceCandidate(iceCandidate));
//   });
//   socket.on('rtc:remove-peer', (peer_id) => {
//     console.log('REMOVE PEER', peer_id);
//     streams.value.get('MY_VIDEO')?.getTracks().forEach((track) => track.stop());
//     peers.value.get(peer_id)?.close();
//     peers.value.delete(peer_id);
//     videos.value.delete(peer_id);
//     streams.value.delete(peer_id);
//   })
  
// });

// async function call() {
//   streams.value.set('MY_VIDEO', await navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
//   socket.emit('rtc:call', chatId.value);
  
// }

// async function answer() {
//   streams.value.set('MY_VIDEO', await navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
//   socket.emit('rtc:answer', true, chatId.value!);
// }

// async function onAddPeer(peer_id: string, offer: boolean) {
//   console.log('ADDING PEER');
//   const peer = peers.value
//     .set(peer_id, new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] }))
//     .get(peer_id)!;

//   const channel = peer.createDataChannel('test');
//   channel.onopen = () => console.log('CHANNEL OPEN');
//   peer.onicecandidate = (event) => {
//     console.log('ICE CANDIDATE');
//     if (event.candidate) {
//       socket.emit('rtc:relay-ice', peer_id, event.candidate);
//     }
//   };
//   peer.ontrack = ({ streams: [stream] }) => {
//     console.log('ONTRACK');
//     streams.value.set(peer_id, stream);
//     clients.value.add(peer_id);
//   };

//   streams.value
//     .get('MY_VIDEO')
//     ?.getTracks()
//     .forEach((track) => {
//       peer.addTrack(track, streams.value.get('MY_VIDEO')!);
//     });
//   if (offer) {
//     const off = await peer.createOffer();
//     await peer.setLocalDescription(off);
//     socket.emit('rtc:relay-sdp', peer_id, off);
//   }
// }

// async function onSessionDescription(peer_id: string, sessionDescription: RTCSessionDescriptionInit) {
//   const peer = peers.value.get(peer_id)!;
//   peer.setRemoteDescription(new RTCSessionDescription(sessionDescription));

//   if (sessionDescription.type === 'offer') {
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);
//     socket.emit('rtc:relay-sdp', peer_id, answer);
//   }
// }

// function setRef(ref: any, peer_id: string) {
//   videos.value.set(peer_id, ref).get(peer_id)!.srcObject = streams.value.get(peer_id)!;
// }

// function endCall(){
//   socket.emit('rtc:remove-peer', chatId.value);
// }
</script>

<style module lang="scss"></style>

<template>
  <MeetVideos :abonents="abonents" :meet-id="meetId" :messages="messages" />
</template>

<script setup lang="ts">
import type { CallInfo } from '@/types';
import MeetVideos from '~/meet/MeetVideos.vue';
import MeetChat from '~/meet/MeetChat.vue';
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore } from '@/stores';


const route = useRoute();
const { socket } = useChatStore();
const abonents = ref<Map<string, CallInfo>>(new Map());
const messages = ref<{ user_id: string, msg: string }[]>([])
const meetId = String(route.params.id);

onMounted(async () => {
  const myInfo = abonents.value.set('MY_VIDEO', { peer: null, stream: null, channel: null }).get('MY_VIDEO')!;
  myInfo.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  socket.emit('meet:join', String(route.params.id));
  socket.on('rtc:add-peer', onAddPeer);
  socket.on('rtc:remove-peer', onRemovePeer);
  socket.on('rtc:session-description', onSessionDescription);
  socket.on('rtc:ice-candidate', onIceCandidate);
});

onBeforeUnmount(() => {
  socket.emit('meet:leave', meetId);
  abonents.value.get('MY_VIDEO')?.stream?.getTracks().forEach((t) => t.stop());
});

onUnmounted(() => {
  socket.removeListener('rtc:add-peer', onAddPeer);
  socket.removeListener('rtc:remove-peer', onRemovePeer);
  socket.removeListener('rtc:session-description', onSessionDescription);
  socket.removeListener('rtc:ice-candidate', onIceCandidate);
});

function onAddPeer(peerId: string, offer: boolean) {
  const newAbonent = abonents.value.set(peerId, { peer: null, stream: null, channel: null }).get(peerId)!;
  newAbonent.peer = new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] });
  newAbonent.peer.onicecandidate = (e) => e.candidate && socket.emit('rtc:relay-ice', peerId, e.candidate);
  newAbonent.peer.ontrack = ({ streams: [stream] }) => (newAbonent.stream = stream);
  abonents.value.get('MY_VIDEO')?.stream?.getTracks()
    .forEach((track) => abonents.value.get(peerId)?.peer?.addTrack(track, abonents.value.get('MY_VIDEO')!.stream!));
  newAbonent.peer!.ondatachannel = (e) => {
    newAbonent.channel = e.channel;
    newAbonent.channel.onopen = onOpen;
    newAbonent.channel.onmessage = onMessage;
  }
  newAbonent.peer.onnegotiationneeded = async () => {
    if (offer) {
      const off = await newAbonent.peer?.createOffer();
      newAbonent.channel = newAbonent.peer!.createDataChannel('channel');
      newAbonent.channel.onopen = onOpen;
      newAbonent.channel.onmessage = onMessage;
      await newAbonent.peer?.setLocalDescription(off);
      socket.emit('rtc:relay-sdp', peerId, off!);
    }
  };
}

function onOpen(this: RTCDataChannel) {
  console.log('channel open', abonents.value);
}

function onMessage(this: RTCDataChannel, e: MessageEvent){
  const data = JSON.parse(e.data);
  switch(data.event) {
    case 'meet:msg':
      return messages.value.push(data.msg);
    case 'toggle-track':
      return console.log(abonents.value.get(data.opts.peerId));
      
  }
}

function onRemovePeer(peer_id: string) {
  const abonent = abonents.value.get(peer_id);
  if(abonent) {
    abonent.peer?.close();
    abonent.channel?.close();
    abonents.value.delete(peer_id);
  }
}

async function onSessionDescription(peer_id: string, sessionDescription: RTCSessionDescriptionInit) {
  const newAbonent = abonents.value.get(peer_id)!;
  newAbonent.peer?.setRemoteDescription(new RTCSessionDescription(sessionDescription));
  if (sessionDescription.type === 'offer') {
    const answer = await newAbonent.peer?.createAnswer()!;
    await newAbonent.peer?.setLocalDescription(answer);
    socket.emit('rtc:relay-sdp', peer_id, answer);
  }
}

function onIceCandidate(peer_id: string, iceCandidate: RTCIceCandidate) {
  abonents.value.get(peer_id)?.peer?.addIceCandidate(new RTCIceCandidate(iceCandidate));
}
</script>

<style lang="scss" scoped>
.videos {
  display: grid;
  grid-template-columns: repeat(auto-fit, 500px);
  gap: 5px;
  justify-content: center;
}

@media (max-width: 1368px) {
  .videos {
    grid-template-columns: repeat(auto-fit, 400px);
  }
}

@media (max-width: 1024px) {
  .videos {
    grid-template-columns: repeat(auto-fit, 350px);
  }
}

@media (max-width: 768px) {
  .videos {
    grid-template-columns: repeat(auto-fit, 300px);
  }
}
</style>

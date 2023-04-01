<template>
  <QDialog v-model="videoModal" maximized>
    <QCard>
      <QCardActions align="right">
        <QBtn v-close-popup="2" dense flat round icon="close" color="negative" @click="endCall" />
      </QCardActions>
      <QCardSection v-if="abonents.size > 1" class="column items-center">
        <div :class="$style.video">
          <video :ref="ref => setRef(ref, MY_VIDEO)" muted autoplay playsinline />
        </div>
        <QBtnGroup class="q-my-sm" outline>
          <QBtn
            round
            dense
            flat
            :icon="mute.audio ? 'mic_off' : 'mic'"
            @click="toggleTrackMute('audio', abonents.get(MY_VIDEO)?.stream as MediaStream)"
          />
          <QBtn
            round
            dense
            flat
            :icon="mute.video ? 'videocam_off' : 'videocam'"
            @click="toggleTrackMute('video', abonents.get(MY_VIDEO)?.stream as MediaStream)"
          />
          <QBtn v-close-popup="2" dense flat round icon="call_end" color="negative" @click="endCall" />
        </QBtnGroup>
      </QCardSection>
      <QCardSection class="column items-center">
        <div v-for="client of Array.from(abonents.keys()).filter(c => c !== MY_VIDEO)" :class="$style.video">
          <video :ref="ref => setRef(ref, client)" autoplay playsinline></video>
        </div>
      </QCardSection>
    </QCard>
  </QDialog>
  <QCard v-if="call === 'outgoing'" :class="$style.card">
    <QCardSection class="text-h5 text-center">Набрать</QCardSection>
    <QCardSection class="q-py-none row justify-center">
      <UserAvatar :avatar="abonent?.avatar" :name="abonent?.name" size="50px" />
      <div class="q-pl-sm">
        <div class="text-subtitle1">{{ abonent?.name }}</div>
        <div class="text-subtitle2 text-caption">{{ abonent?.login }}</div>
      </div>
    </QCardSection>
    <QCardActions align="between">
      <QBtn round dense flat icon="call" color="positive" @click="callToUser" />
      <QSpinnerDots v-if="isCalling" size="2em" color="primary" />
      <QBtn v-close-popup round dense flat icon="call_end" color="negative" @click="cancelCall" />
    </QCardActions>
  </QCard>
  <QCard v-else :class="$style.card">
    <QCardSection class="text-h5 text-center">Входящий вызов</QCardSection>
    <QCardSection class="q-py-none row justify-center">
      <UserAvatar :avatar="abonent?.avatar" :name="abonent?.name" size="50px" />
      <div class="q-pl-sm">
        <div class="text-subtitle1">{{ abonent?.name }}</div>
        <div class="text-subtitle2 text-caption">{{ abonent?.login }}</div>
      </div>
    </QCardSection>
    <QCardActions align="between">
      <QBtn round dense flat icon="call" color="positive" @click="answer" />
      <QBtn round dense flat icon="call_end" color="negative" @click="cancelCall" />
    </QCardActions>
  </QCard>
</template>

<script setup lang="ts">
import UserAvatar from '~/UserAvatar.vue';
import { ref, onMounted, onUnmounted, onBeforeUnmount, reactive, computed } from 'vue';
import { useChatStore } from '@/stores';

interface Info {
  peer: RTCPeerConnection | null;
  video: HTMLVideoElement | null;
  stream: MediaStream | null;
}

const props = defineProps<{ call: 'incoming' | 'outgoing'; chat_id: string }>();
const emit = defineEmits<{ (event: 'close-popup'): void }>();
const chatStore = useChatStore();
const videoModal = ref(false);
const isCalling = ref(false);
const MY_VIDEO = 'MY_VIDEO';
const { socket } = chatStore;
const abonents = ref<Map<string, Info>>(new Map());
const mute = reactive({ video: false, audio: false });
const abonent = computed(() => chatStore.chats.get(props.chat_id)?.companion);

onMounted(() => {
  socket.on('rtc:add-peer', onAddPeer);
  socket.on('rtc:session-description', onSessionDescription);
  socket.on('rtc:ice-candidate', onIceCandidate);
  socket.on('rtc:remove-peer', onRemovePeer);
});

onBeforeUnmount(() => {
  abonents.value.get(MY_VIDEO)?.stream?.getTracks().forEach(track => track.stop());
});

onUnmounted(() => {
  socket.removeListener('rtc:add-peer', onAddPeer);
  socket.removeListener('rtc:session-description', onSessionDescription);
  socket.removeListener('rtc:ice-candidate', onIceCandidate);
  socket.removeListener('rtc:remove-peer', onRemovePeer);
});

async function callToUser() {
  isCalling.value = true;
  abonents.value
    .set(MY_VIDEO, { peer: null, stream: null, video: null })
    .get(MY_VIDEO)!.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  socket.emit('rtc:call', props.chat_id);
}

async function answer() {
  abonents.value
    .set(MY_VIDEO, { peer: null, stream: null, video: null })
    .get(MY_VIDEO)!.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  socket.emit('rtc:answer', true, props.chat_id);
}

async function onAddPeer(peer_id: string, offer: boolean) {
  videoModal.value = true;
  const newAbonent = abonents.value.set(peer_id, { peer: null, stream: null, video: null }).get(peer_id)!;
  newAbonent.peer = new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] });
  newAbonent.peer.onicecandidate = e => e.candidate && socket.emit('rtc:relay-ice', peer_id, e.candidate);
  newAbonent.peer.ontrack = ({ streams: [stream] }) => (newAbonent.stream = stream);
  abonents.value.get(MY_VIDEO)?.stream?.getTracks()
    .forEach(track => abonents.value.get(peer_id)?.peer?.addTrack(track, abonents.value.get(MY_VIDEO)!.stream!));
  newAbonent.peer.onnegotiationneeded = async () => {
    if (offer) {
      const off = await newAbonent.peer?.createOffer();
      await newAbonent.peer?.setLocalDescription(off);
      socket.emit('rtc:relay-sdp', peer_id, off!);
    }
  };
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

function onRemovePeer(peer_id: string) {
  abonents.value.get(MY_VIDEO)?.stream?.getTracks().forEach(track => track.stop());
  abonents.value.get(peer_id)?.peer?.close();
  abonents.value.delete(peer_id);
  emit('close-popup');
}

function setRef(ref: any, peer_id: string) {
  const newAbonent = abonents.value.get(peer_id);
  if (ref) {
    newAbonent!.video = ref;
    newAbonent!.video!.srcObject = newAbonent!.stream;
  }
}

function endCall() {
  abonents.value.size > 1 && socket.emit('rtc:remove-peer', props.chat_id);
}

function cancelCall() {
  socket.emit('rtc:call-cancel', props.chat_id);
}

function toggleTrackMute(type: 'video' | 'audio', stream: MediaStream) {
  const track = stream.getTracks().filter(track => track.kind === type).at(0);
  if (track) {
    track.enabled = !track.enabled;
    mute[type] = !mute[type];
  }
}
</script>

<style lang="scss" module>
.card {
  min-width: 250px;
}

.video {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;

  & video {
    object-fit: cover;
    width: 100%;
  }
}
</style>

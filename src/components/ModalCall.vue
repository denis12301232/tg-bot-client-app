<template>
  <QDialog v-model="videoModal" maximized>
    <QCard class="overflow-hidden">
      <QCardActions align="right">
        <QBtn v-close-popup="2" dense flat round icon="close" color="negative" @click="endCall" />
      </QCardActions>
      <QCardSection>
        <div :class="[$style.videos]">
          <CallVideo
            v-for="[id, stream] of streams.camera.entries()"
            :ref="(ref) => setRefs(ref, id)"
            :stream="stream"
            :fullscreen-btn="id === store.user._id ? false : true"
            :avatar="id === store.user._id ? store.user.avatar : abonents.get(id)?.info?.avatar"
            :name="id === store.user._id ? store.user.name : abonents.get(id)?.info?.name"
          />
        </div>
      </QCardSection>
      <QCardActions align="center">
        <QBtn
          dense
          round
          flat
          :icon="videos.get(store.user._id)?.mute.audio ? 'mic' : 'mic_off'"
          @click="toggleTrackMuteAndRelay('audio')"
        />
        <QBtn
          dense
          round
          flat
          :icon="videos.get(store.user._id)?.mute.video ? 'videocam' : 'videocam_off'"
          @click="toggleTrackMuteAndRelay('video')"
        />
        <QBtn dense round flat icon="call_end" color="negative" @click="endCall" />
      </QCardActions>
    </QCard>
  </QDialog>
  <QCard :class="$style.card">
    <QCardSection class="text-h5">{{ call === 'outgoing' ? 'Набрать' : 'Входящий вызов' }} </QCardSection>
    <QSeparator inset />
    <QCardSection class="q-py-sm q-mt-sm row">
      <UserAvatar :avatar="abonent?.avatar" :name="abonent?.name" size="55px" />
      <div class="q-pl-sm column justify-center">
        <div class="text-subtitle1">{{ abonent?.name }}</div>
        <div class="text-subtitle2 text-caption">@{{ abonent?.login }}</div>
      </div>
    </QCardSection>
    <QCardActions align="between">
      <QBtn
        round
        dense
        flat
        icon="call"
        color="positive"
        size="1.1em"
        @click="call === 'outgoing' ? callToUser() : answer()"
      />
      <QSpinnerDots v-if="isCalling" size="2em" color="primary" />
      <QBtn v-close-popup round dense flat icon="call_end" color="negative" size="1.1em" @click="cancelCall" />
    </QCardActions>
  </QCard>
</template>

<script setup lang="ts">
import type { SocketTyped } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import CallVideo from '~/CallVideo.vue';
import { ref, computed, watch, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { useWebRtc } from '@/hooks';
import { WebRtcDto } from '@/api/dto';

const props = defineProps<{ call: 'incoming' | 'outgoing'; chat_id: string }>();
const store = useStore();
const chatStore = useChatStore();
const { socket } = chatStore;
const { abonents, streams, streamIds, captureMyStream } = useWebRtc(socket as SocketTyped, store.user._id, {
  setChannelEvents,
});
const videos = ref<Map<string, InstanceType<typeof CallVideo>>>(new Map());
const videoModal = ref(false);
const isCalling = ref(false);
const abonent = computed(() => chatStore.chats.get(props.chat_id)?.companion);

watch(
  () => abonents.value.size,
  (n, o) => {
    if (n === 0 && o > 0) {
      store.modalCall.visible = false;
    }
  }
);

onMounted(() => socket.on('chat:call-answer', onChatCallAnswer));
onUnmounted(() => socket.removeListener('chat:call-answer', onChatCallAnswer));
onBeforeUnmount(() =>
  streams.camera
    .get(store.user._id)
    ?.getTracks()
    .forEach((t) => t.stop())
);

function onChatCallAnswer(chatId: string, answer: boolean) {
  isCalling.value = false;
  if (answer) {
    socket.emit('webrtc:add-peer', chatId);
    videoModal.value = true;
  }
}

async function callToUser() {
  isCalling.value = true;
  captureMyStream('camera', { video: true, audio: true })
    .then((stream) => socket.emit('chat:call', props.chat_id))
    .catch((e) => console.error(e));
}

async function answer() {
  captureMyStream('camera', { video: true, audio: true })
    .then((stream) => {
      socket.emit('chat:call-answer', props.chat_id, true);
      videoModal.value = true;
    })
    .catch((e) => console.error(e));
}

function endCall() {
  abonents.value.size > 0 && socket.emit('webrtc:remove-peer', props.chat_id);
}

function cancelCall() {
  socket.emit('chat:call-cancel', props.chat_id);
}

function setRefs(ref: any, id: string) {
  videos.value.set(id, ref);
}

function setChannelEvents(channel: RTCDataChannel) {
  channel.onmessage = onMessage;
}

function onMessage(this: RTCDataChannel, e: MessageEvent) {
  const msg = JSON.parse(e.data) as WebRtcDto;
  switch (msg.event) {
    case 'track:toggle':
      return onTrackToggle(msg.data);
    case 'track:toggle-init':
      return onTrackToggleInit(msg.data);
    case 'identify-stream':
      return onIdentifyStream(msg.data);
  }
}

function onTrackToggleInit(peerId: string) {
  for (const type of ['camera', 'screen'] as ['camera', 'screen']) {
    const stream = streams[type].get(store.user._id);
    stream?.getTracks().forEach((track) => {
      const msg = new WebRtcDto('track:toggle', {
        track: track.kind,
        peerId: store.user._id,
        value: track.enabled,
      }).toString();
      abonents.value.get(peerId)?.channel?.send(msg);
    });
  }
}

function onTrackToggle({ track, value, peerId }: { track: 'audio' | 'video'; value: boolean; peerId: string }) {
  if (videos.value?.get(peerId)?.mute) {
    videos.value.get(peerId)!.mute[track] = value;
  }
}

function toggleTrackMuteAndRelay(track: 'video' | 'audio') {
  videos.value.get(store.user._id)?.toggleTrackMute(track);
  const msg = new WebRtcDto('track:toggle', {
    track,
    peerId: store.user._id,
    value: videos.value.get(store.user._id)?.mute[track],
  }).toString();
  abonents.value.forEach((a) => a.channel?.send(msg));
}

function onIdentifyStream({ type, id }: { type: 'camera' | 'screen'; id: string }) {
  streamIds[type].add(id);
}
</script>

<style lang="scss" module>
.card {
  min-width: 270px;
  max-width: 350px !important;
  width: 100%;
}

.videos {
  display: grid;
  grid-template-columns: repeat(auto-fit, 500px);
  gap: 5px;
  justify-content: center;
  height: 100%;
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

<template>
  <QDialog v-model="videoModal" maximized>
    <QCard class="overflow-hidden">
      <QCardActions align="right">
        <QBtn v-close-popup="2" dense flat round icon="close" color="negative" @click="endCall" />
      </QCardActions>
      <QCardSection v-if="abonents.size > 1" style="height: 85%">
        <div :class="[$style.videos]">
          <CallVideo ref="myVideo" :stream="(abonents.get(MY_VIDEO)?.stream as MediaStream)" @call-end="endCall" />
          <CallVideo
            v-for="client of Array.from(abonents.keys()).filter((c) => c !== MY_VIDEO)"
            :key="client"
            :stream="(abonents.get(client)?.stream as MediaStream)"
            fullscreen-btn
            enable-audio
            enable-video
          />
        </div>
      </QCardSection>
      <QCardActions align="center">
        <QBtn
          dense
          round
          flat
          :icon="myVideo?.mute.audio ? 'mic' : 'mic_off'"
          @click="myVideo?.toggleTrackMute('audio')"
        />
        <QBtn
          dense
          round
          flat
          :icon="myVideo?.mute.video ? 'videocam' : 'videocam_off'"
          @click="myVideo?.toggleTrackMute('video')"
        />
        <QBtn dense round flat icon="call_end" color="negative" @click="endCall" />
      </QCardActions>
    </QCard>
  </QDialog>
  <QCard v-if="call === 'outgoing'" :class="$style.card">
    <QCardSection class="text-h5 text-uppercase text-center">Набрать</QCardSection>
    <QCardSection class="q-py-sm row justify-center">
      <UserAvatar :avatar="abonent?.avatar" :name="abonent?.name" size="60px" />
      <div class="q-pl-sm column justify-center">
        <div class="text-subtitle1">{{ abonent?.name }}</div>
        <div class="text-caption">{{ abonent?.login }}</div>
      </div>
    </QCardSection>
    <QCardActions align="between">
      <QBtn round dense flat icon="call" color="positive" size="1.1em" @click="callToUser" />
      <QSpinnerDots v-if="isCalling" size="2em" color="primary" />
      <QBtn v-close-popup round dense flat icon="call_end" color="negative" size="1.1em" @click="cancelCall" />
    </QCardActions>
  </QCard>
  <QCard v-else :class="$style.card">
    <QCardSection class="text-h5 text-uppercase text-center">Входящий вызов</QCardSection>
    <QCardSection class="q-py-sm row justify-center">
      <UserAvatar :avatar="abonent?.avatar" :name="abonent?.name" size="50px" />
      <div class="q-pl-sm column justify-center">
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
import type { SocketTyped } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import CallVideo from '~/CallVideo.vue';
import { ref, computed, watch } from 'vue';
import { useChatStore } from '@/stores';
import { useWebRtc } from '@/hooks';

const props = defineProps<{ call: 'incoming' | 'outgoing'; chat_id: string }>();
const emit = defineEmits<{ (event: 'close-popup'): void }>();

const chatStore = useChatStore();
const { socket } = chatStore;
const { abonents, MY_VIDEO } = useWebRtc(socket as SocketTyped);
const myVideo = ref<InstanceType<typeof CallVideo> | null>(null);
const videoModal = ref(false);
const isCalling = ref(false);
const abonent = computed(() => chatStore.chats.get(props.chat_id)?.companion);

watch(() => abonents.value.size,(n, o) => {
  if (n > 1) videoModal.value = true;
  else if (n === 1 && o > 1) emit('close-popup');
});

async function callToUser() {
  isCalling.value = true;
  abonents.value
    .set(MY_VIDEO, { peer: null, stream: null })
    .get(MY_VIDEO)!.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  socket.emit('rtc:call', props.chat_id);
}

async function answer() {
  abonents.value
    .set(MY_VIDEO, { peer: null, stream: null })
    .get(MY_VIDEO)!.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  socket.emit('rtc:answer', true, props.chat_id);
}

function endCall() {
  abonents.value.size > 1 && socket.emit('rtc:remove-peer', props.chat_id);
}

function cancelCall() {
  socket.emit('rtc:call-cancel', props.chat_id);
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

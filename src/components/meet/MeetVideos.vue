<template>
  <div class="column items-center full-height overflow-hidden q-pt-lg q-pb-sm">
    <div class="msg-list full-height">
      <QScrollArea class="full-height">
        <div class="videos">
          <CallVideo ref="myVideo" :stream="(abonents.get('MY_VIDEO')?.stream as MediaStream)" />
          <CallVideo
            v-for="client of Array.from(abonents.keys()).filter((c) => c !== 'MY_VIDEO')"
            :ref="(ref) => setRefs(ref, client)"
            :key="client"
            :stream="(abonents.get(client)?.stream as MediaStream)"
            fullscreen-btn
          />
        </div>
      </QScrollArea>
      <div class="row items-center justify-center">
        <QBtn
          dense
          round
          flat
          :icon="myVideo?.mute.audio ? 'mic' : 'mic_off'"
          @click="toggleTrackMuteAndRelay('audio')"
        />
        <QBtn
          dense
          round
          flat
          :icon="myVideo?.mute.video ? 'videocam' : 'videocam_off'"
          @click="toggleTrackMuteAndRelay('video')"
        />
        <QBtn dense round flat icon="chat_bubble" @click="emit('chat-open')" />
        <QBtn dense round flat icon="content_copy" @click="Util.copyTextToClipboard(meetId)" />
        <QBtn dense round flat icon="call_end" color="negative" @click="goBack" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CallInfo } from '@/types';
import CallVideo from '~/CallVideo.vue';
import { ref, onActivated } from 'vue';
import { useStore } from '@/stores';
import { useNavigation } from '@/hooks';
import { Util } from '@/util';
import { WebRtcDto } from '@/api/dto';

const props = defineProps<{
  abonents: Map<string, CallInfo>;
  meetId: string;
}>();
const emit = defineEmits<{
  (event: 'chat-open'): void;
}>();

const store = useStore();
const { goBack } = useNavigation();
const myVideo = ref<InstanceType<typeof CallVideo> | null>(null);
const videos = ref<Map<string, InstanceType<typeof CallVideo> | null>>(new Map());

defineExpose({ videos });

onActivated(() => {
  myVideo.value?.$el?.play();
  videos.value.forEach((video) => video?.$el?.play());
});

function setRefs(ref: any, client: string) {
  videos.value.set(client, ref);
}

function toggleTrackMuteAndRelay(track: 'video' | 'audio') {
  myVideo.value?.toggleTrackMute(track);
  const msg = new WebRtcDto('toggle-track', {
    track,
    peerId: store.user._id,
    value: myVideo.value?.mute[track],
  }).toString();
  props.abonents.forEach((a) => a.channel?.send(msg));
}
</script>

<style lang="scss" scoped>
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

.msg-list {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>

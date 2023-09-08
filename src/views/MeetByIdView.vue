<template>
  <div class="overflow-hidden" style="height: calc(100vh - 102px)">
    <QScrollArea
      class="fit"
      :thumb-style="{ width: '7px' }"
      :content-style="{ position: 'relative', overflow: 'hidden' }"
      :content-active-style="{ position: 'relative', overflow: 'hidden' }"
    >
      <div class="videos">
        <QCard v-for="[id, stream] of streams.screen.entries()" :key="id + 1" style="max-width: 500px">
          <QCardSection class="user_video q-pa-none row justify-center">
            <CustomVideo
              class="full-width q-pa-sm"
              :stream="stream"
              :btns="{ fullscreen: id !== user?._id }"
              muted
              autoplay
              plays-inline
              :volume="1"
            >
              <UserAvatar
                :avatar="id === user?._id ? user.avatar : abonents.get(id)?.info?.avatar"
                :name="id === user?._id ? user.name : abonents.get(id)?.info?.name"
                size="200px"
              />
            </CustomVideo>
          </QCardSection>
          <QSeparator />
          <QCardSection class="text-center text-subtitle2 text-indigo text-bold">
            {{ id === user?._id ? t('meetId.msgs.screenShare') : abonents.get(id)?.info?.name }}
          </QCardSection>
        </QCard>
        <QCard
          v-for="[id, stream] of streams.camera.entries()"
          :class="{ speak: speaking.has(id) }"
          :key="id"
          style="max-width: 500px; box-sizing: border-box; border: 1px solid transparent"
        >
          <QCardSection class="user_video q-pa-none row justify-center">
            <CustomVideo
              class="full-width q-pa-sm"
              :stream="stream"
              :ref="(ref) => setRefs(ref, id)"
              :muted="id === user?._id"
              :btns="{ fullscreen: id !== user?._id }"
              :mute="{ audio: true, video: true }"
              :volume="1"
              autoplay
              plays-inline
            >
              <UserAvatar
                :avatar="id === user?._id ? user.avatar : abonents.get(id)?.info?.avatar"
                :name="id === user?._id ? user.name : abonents.get(id)?.info?.name"
                size="200px"
              />
            </CustomVideo>
          </QCardSection>
          <QSeparator />
          <QCardSection class="text-center text-subtitle2 text-indigo text-bold">
            {{ id === user?._id ? t('meetId.messages.screen') : abonents.get(id)?.info?.name }}
          </QCardSection>
        </QCard>
      </div>
    </QScrollArea>
  </div>
</template>

<script setup lang="ts">
import type { Injected } from '@/types';
import CustomVideo from '~/CustomVideo.vue';
import UserAvatar from '~/UserAvatar.vue';
import { type ComponentPublicInstance, inject, watch, ref, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore } from '@/stores';
import { useI18n } from 'vue-i18n';

let rafTimer = 0;
const FFT_SIZE = 256;
const THRESHOLD = 10;
const funcs: Set<Function> = new Set();
const { t } = useI18n();
const { user } = storeToRefs(useStore());
const { videos, abonents, streams } = inject<Injected.RTC>('rtc')!;
const speaking = ref<Set<string>>(new Set());

onUnmounted(() => cancelAnimationFrame(rafTimer));

watch(
  () => streams.camera.size,
  () => {
    funcs.clear();
    for (const [id, stream] of streams.camera.entries()) {
      if (id === user.value?._id) {
        continue;
      }
      const f = handleAudioStream(id, stream);
      funcs.add(f);
    }
    cancelAnimationFrame(rafTimer);
    raf();

    function raf() {
      funcs.forEach((f) => f());
      rafTimer = requestAnimationFrame(raf);
    }
  }
);

function handleAudioStream(id: string, stream: MediaStream) {
  const audioContext = new AudioContext();
  const mediaStreamSource = audioContext.createMediaStreamSource(stream);
  const analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = FFT_SIZE;
  mediaStreamSource.connect(analyserNode);
  const bufferLength = analyserNode.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  return function () {
    analyserNode.getByteFrequencyData(dataArray);
    const averageVolume = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
    averageVolume > THRESHOLD ? speaking.value.add(id) : speaking.value.delete(id);
  };
}

function setRefs(ref: Element | ComponentPublicInstance | null, id: string) {
  videos.value.set(id, ref as InstanceType<typeof CustomVideo>);
}
</script>

<style lang="scss" scoped>
.videos {
  display: grid;
  grid-template-columns: repeat(auto-fill, 500px);
  gap: 15px;
  justify-content: center;
  align-items: center;
  padding: 20px 10px 10px 10px;
}

.user_video {
  max-width: 500px;
  width: 100%;
  max-height: 350px;
}

.speak {
  border: 1px solid $indigo !important;
}

@media (max-width: 560px) {
  .videos {
    grid-template-columns: repeat(auto-fill, 290px);
  }
}
</style>

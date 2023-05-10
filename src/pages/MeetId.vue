<template>
  <div class="overflow-hidden" style="height: calc(100vh - 51px)">
    <QScrollArea class="fit">
      <div class="videos">
        <QCard v-for="[id, stream] of streams.screen.entries()" :key="id + 1" style="max-width: 500px">
          <QCardSection class="user_video q-pa-none">
            <CallVideo :stream="stream" fullscreen-btn enable-video />
          </QCardSection>
          <QCardSection class="text-center text-subtitle2 text-indigo text-bold">
            {{ id === myId ? 'Мой экран' : abonents.get(id)?.info?.name }}
          </QCardSection>
        </QCard>
        <QCard v-for="[id, stream] of streams.camera.entries()" :key="id" style="max-width: 500px">
          <QCardSection class="user_video q-pa-none">
            <CallVideo
              :stream="stream"
              :ref="(ref) => setRefs(ref, id)"
              :fullscreen-btn="id === myId ? false : true"
              :avatar="id === myId ? store.user.avatar : abonents.get(id)?.info?.avatar"
              :name="id === myId ? store.user.name : abonents.get(id)?.info?.name"
            />
          </QCardSection>
          <QCardSection class="text-center text-subtitle2 text-indigo text-bold">
            {{ id === myId ? 'Я' : abonents.get(id)?.info?.name }}
          </QCardSection>
        </QCard>
      </div>
    </QScrollArea>
  </div>
</template>

<script setup lang="ts">
import type { Abonent, Streams } from '@/types';
import CallVideo from '~/CallVideo.vue';
import { type Ref, inject, computed } from 'vue';
import { useStore } from '@/stores';

const store = useStore();
const myId = computed(() => store.user._id)
const videos = inject<Ref<Map<string, InstanceType<typeof CallVideo> | null>>>('videos')!;
const abonents = inject<Ref<Map<string, Abonent>>>('abonents')!;
const streams = inject<Streams>('streams')!;


function setRefs(ref: any, id: string) {
  videos.value.set(id, ref);
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

@media (max-width: 560px) {
  .videos {
    grid-template-columns: repeat(auto-fill, 290px);
  }
}
</style>

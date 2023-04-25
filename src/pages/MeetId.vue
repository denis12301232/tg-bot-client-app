<template>
  <div style="height: calc(100vh - 51px)">
    <QScrollArea class="full-height">
      <div class="videos">
        <QCard v-for="[id, stream] of streams.screen.entries()" :key="id + 1">
          <QCardSection>
            <CallVideo :stream="stream" fullscreen-btn enable-video />
          </QCardSection>
          <QCardSection class="text-center text-subtitle2">
            {{ id === myId ? 'Мой экран' : abonents.get(id)?.info?.name }}
          </QCardSection>
        </QCard>
        <QCard v-for="[id, stream] of streams.camera.entries()" :key="id">
          <QCardSection>
            <CallVideo
              :stream="stream"
              :ref="(ref) => setRefs(ref, id)"
              :fullscreen-btn="id === myId ? false : true"
              :avatar="id === myId ? store.user.avatar : abonents.get(id)?.info?.avatar"
              :name="id === myId ? store.user.name : abonents.get(id)?.info?.name"
            />
          </QCardSection>
          <QCardSection class="text-center text-subtitle2">
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
  grid-template-columns: repeat(auto-fit, 500px);
  gap: 5px;
  justify-content: center;
  height: 100%;
  padding: 5px;
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

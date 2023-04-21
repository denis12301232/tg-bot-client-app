<template>
  <div class="column items-center full-height overflow-hidden q-pt-lg q-pb-sm">
    <div class="msg-list full-height">
      <QScrollArea class="full-height">
        <div class="videos">
          <CallVideo
            v-for="[id, stream] of streams.screen.entries()"
            :key="id + 1"
            :stream="stream"
            fullscreen-btn
            enable-video
          />
          <CallVideo
            v-for="[id, stream] of streams.camera.entries()"
            :key="id"
            :stream="stream"
            :ref="(ref) => setRefs(ref, id)"
            :fullscreen-btn="id === myId ? false : true"
            :avatar="id === myId ? store.user.avatar : abonents.get(id)?.info?.avatar"
            :name="id === myId ? store.user.name : abonents.get(id)?.info?.name"
          />
        </div>
      </QScrollArea>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Abonent, Streams } from '@/types';
import CallVideo from '~/CallVideo.vue';
import { type Ref, inject, computed, ref, onMounted, watch } from 'vue';
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

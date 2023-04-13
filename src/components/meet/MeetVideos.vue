<template>
  <div class="column items-center full-height overflow-hidden q-pt-lg q-pb-sm">
    <div class="msg-list full-height">
      <QScrollArea class="full-height">
        <div class="videos">
          <CallVideo
            v-for="[client, info] of Array.from(abonents.entries())"
            :ref="(ref) => setRefs(ref, client)"
            :key="client"
            :stream="(info.stream as MediaStream)"
            :fullscreen-btn="client === myId ? false: true"
            :avatar="info.user?.avatar"
            :name="info.user?.name"
          />
        </div>
      </QScrollArea>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CallInfo } from '@/types';
import CallVideo from '~/CallVideo.vue';
import {  type Ref, inject, computed } from 'vue';
import { useStore } from '@/stores';

const store = useStore();
const myId = computed(() => store.user._id)
const videos = inject<Ref<Map<string, InstanceType<typeof CallVideo> | null>>>('videos')!;
const abonents = inject<Ref<Map<string, CallInfo>>>('abonents')!;

function setRefs(ref: any, client: string) {
  videos.value.set(client, ref);
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

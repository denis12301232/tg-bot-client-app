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
              :stream="stream"
              :btns="{ fullscreen: id !== myId }"
              muted
              autoplay
              plays-inline
              style="width: 100%; padding: 5px"
              :volume="1"
            >
              <UserAvatar
                :avatar="id === myId ? store.user.avatar : abonents.get(id)?.info?.avatar"
                :name="id === myId ? store.user.name : abonents.get(id)?.info?.name"
                size="200px"
              />
            </CustomVideo>
          </QCardSection>
          <QSeparator />
          <QCardSection class="text-center text-subtitle2 text-indigo text-bold">
            {{ id === myId ? 'Мой экран' : abonents.get(id)?.info?.name }}
          </QCardSection>
        </QCard>
        <QCard v-for="[id, stream] of streams.camera.entries()" :key="id" style="max-width: 500px">
          <QCardSection class="user_video q-pa-none row justify-center">
            <CustomVideo
              :stream="stream"
              :ref="(ref) => setRefs(ref, id)"
              :muted="id === myId"
              :btns="{ fullscreen: id !== myId }"
              autoplay
              plays-inline
              :mute="{ audio: true, video: true }"
              style="width: 100%; padding: 5px"
              :volume="1"
            >
              <UserAvatar
                :avatar="id === myId ? store.user.avatar : abonents.get(id)?.info?.avatar"
                :name="id === myId ? store.user.name : abonents.get(id)?.info?.name"
                size="200px"
              />
            </CustomVideo>
          </QCardSection>
          <QSeparator />
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
import CustomVideo from '~/CustomVideo.vue';
import UserAvatar from '~/UserAvatar.vue';
import { type Ref, inject, computed } from 'vue';
import { useStore } from '@/stores';

interface Injected {
  videos: Ref<Map<string, InstanceType<typeof CustomVideo> | null>>;
  abonents: Ref<Map<string, Abonent>>;
  streams: Streams;
}

const store = useStore();
const myId = computed(() => store.user._id)
const { videos, abonents, streams} = inject<Injected>('rtc')!;

function setRefs(ref: any, id: string) {
  videos.value.set(id, ref);
}

function onResize(size: { height: number; width: number;}){
  console.log(size);

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

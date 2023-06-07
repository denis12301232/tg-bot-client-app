<template>
  <div class="container">
    <QDialog v-model="isModalVisible" maximized no-refocus @keydown="changeImage">
      <GalleryImageFull :currentIndex="currentIndex" :images="images" :total="total" @next="onNext" @prev="onPrev" />
    </QDialog>
    <h3 class="text-center q-pa-lg q-my-sm">{{ t('gallery.title') }}</h3>
    <h5 v-if="!images.length && !loading" class="text-center text-negative">{{ error || 'Нет изображений' }}</h5>
    <QInfiniteScroll @load="onFetchImages">
      <div class="images">
        <div class="image-block" v-for="(img, index) in images" :key="index" @click="onOpenImage(index)">
          <QImg class="image_item" fit="cover" :src="img.link">
            <template #loading>
              <LoaderWheel size="35px" />
            </template>
          </QImg>
          <div class="image_hover"></div>
          <div
            v-if="store.isAdmin"
            :class="['image_controls row justify-end', { show: selection.includes(img.fileId) }]"
          >
            <QCheckbox v-model="selection" :val="img.fileId" dark />
          </div>
        </div>
      </div>
      <template #loading>
        <div class="row justify-center q-my-md">
          <QSpinnerDots color="primary" size="40px" />
        </div>
      </template>
    </QInfiniteScroll>
  </div>
</template>

<script setup lang="ts">
import type { ImagesResponse, I18n, Langs } from '@/types';
import GalleryImageFull from '~/gallery/GalleryImageFull.vue';
import LoaderWheel from '~/LoaderWheel.vue';
import { type Ref, ref, computed, inject } from 'vue';
import { useStore } from '@/stores';
import { ImageService } from '@/api/services';
import { useI18n } from 'vue-i18n';
import { HTTPError } from 'ky';

interface Injected {
  images: Ref<{ link: string; fileId: string }[]>;
  selection: Ref<string[]>;
}

const { t } = useI18n<I18n, Langs>();
const store = useStore();
const { images, selection } = inject<Injected>('images')!;
const pageToken = ref<string>();
const currentIndex = ref(0);
const isModalVisible = ref(false);
const loading = ref(false);
const error = ref('');
const total = computed(() => images.value.length);

async function onFetchImages(index: number, done: (stop?: boolean | undefined) => void) {
  try {
    loading.value = true;
    error.value = '';
    const data = await ImageService.getImages(pageToken.value).json<ImagesResponse>();
    images.value = [...images.value, ...data.images];
    pageToken.value = data.pageToken;
    pageToken.value ? done() : done(true);
  } catch (e) {
    if (e instanceof HTTPError) {
      const err: { message: string } = await e.response.json();
      error.value = err.message;
    } else if (e instanceof Error) {
      error.value = e.message;
    }
    done(true);
  } finally {
    loading.value = false;
  }
}

function onOpenImage(index: number) {
  currentIndex.value = index;
  isModalVisible.value = true;
}

function onPrev() {
  currentIndex.value > 0 && currentIndex.value--;
}

function onNext() {
  currentIndex.value < total.value - 1 && currentIndex.value++;
}

function changeImage(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') onPrev();
  else if (event.key === 'ArrowRight') onNext();
}
</script>

<style scoped lang="scss">
.container {
  & .images {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    padding: 0 10px 20px;

    & .image-block {
      overflow: hidden;
      position: relative;
      cursor: pointer;
      height: auto;
      min-height: 200px;
      max-height: 250px;

      & .image_item {
        width: 100%;
        height: 100%;
      }

      & .image_hover {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.7);
        opacity: 0;
      }

      &:hover {
        .image_hover,
        .image_controls {
          opacity: 1;
        }
      }

      & .image_controls {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        z-index: 1000;
        opacity: 0;
      }
    }
  }
}

@media (max-width: 768px) {
  .container {
    & .images {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.show {
  opacity: 1 !important;
}
</style>

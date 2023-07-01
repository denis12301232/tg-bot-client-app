<template>
  <div>
    <QDialog v-model="uploadModal" >
      <GalleryImageUpload />
    </QDialog>
    <QDialog v-model="modal" maximized no-refocus>
      <GalleryImageFull
        v-model:images="images"
        v-model:current-index="currentIndex"
        :loading="loading"
        :total="total"
        @request="request({ skip, limit: 10, descending: true, sort: 'createdAt' })"
      />
    </QDialog>
    <GalleryImageList
      :loading="loading"
      :error="typeof error === 'object' ? error.message : error"
      @open="onOpenImage"
      @request="request({ skip, limit: 10, descending: true, sort: 'createdAt' })"
    />
  </div>
</template>

<script setup lang="ts">
import GalleryImageFull from '~/gallery/GalleryImageFull.vue';
import GalleryImageList from '~/gallery/GalleryImageList.vue';
import GalleryImageUpload from '~/gallery/GalleryImageUpload.vue';
import type { ImageInjected, ImagesResponse } from '@/types';
import { inject, ref, watch } from 'vue';
import { useFetch } from '@/hooks';
import { ImageService } from '@/api/services';

const { images, total, skip, uploadModal } = inject<ImageInjected>('data')!;
const modal = ref(false);
const currentIndex = ref(0);
const { request, loading, data, error } = useFetch<ImagesResponse, typeof ImageService.getImages>(
  ImageService.getImages
);

watch(data, () => {
  if (data.value) {
    images.value = images.value.concat(data.value.images);
    total.value = data.value.count;
  }
});

function onOpenImage(index: number) {
  currentIndex.value = index;
  modal.value = true;
}
</script>

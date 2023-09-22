<template>
  <div>
    <QDialog v-model="uploadModal">
      <GalleryImageUpload @modal="hideUploadModal" />
    </QDialog>
    <QDialog v-model="modal" maximized no-refocus>
      <GalleryImageFull
        v-model:images="images"
        v-model:current-index="currentIndex"
        :loading="loading"
        :total="total"
        @request="index({ skip, limit: 10, descending: true, sort: 'createdAt' })"
      />
    </QDialog>
    <GalleryImageList
      :loading="loading"
      :error="error?.message || ''"
      @open="onOpenImage"
      @request="index({ skip, limit: 10, descending: true, sort: 'createdAt' })"
    />
  </div>
</template>

<script setup lang="ts">
import GalleryImageFull from '~/gallery/GalleryImageFull.vue';
import GalleryImageList from '~/gallery/GalleryImageList.vue';
import GalleryImageUpload from '~/gallery/GalleryImageUpload.vue';
import type { Injected } from '@/types';
import { inject, ref } from 'vue';
import { useQuery } from '@/hooks';
import { ImageService } from '@/api/services';

const { images, total, skip, uploadModal } = inject<Injected.Image>('data')!;
const modal = ref(false);
const currentIndex = ref(0);
const { query: index, loading, error } = useQuery(ImageService.index, { onSuccess });

function onSuccess(data: Awaited<ReturnType<typeof ImageService.index>>) {
  images.value = images.value.concat(data.images);
  total.value = data.count;
}

function onOpenImage(index: number) {
  currentIndex.value = index;
  modal.value = true;
}

function hideUploadModal(value: boolean) {
  uploadModal.value = value;
}
</script>

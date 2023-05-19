<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="arrow_back" color="indigo" @click="$router.push('/')" />
        <QToolbarTitle>{{ title }}</QToolbarTitle>
        <QBtnGroup v-if="store.isAdmin" flat>
          <QBtn
            v-if="selection.length"
            icon="delete"
            dense
            flat
            round
            color="negative"
            :loading="isDeleteLoading"
            :disable="isDeleteLoading"
            @click="deleteImages"
          />
          <QBtn
            icon="file_upload"
            dense
            flat
            round
            color="positive"
            :disable="loading"
            :loading="loading"
            @click="imagesRef?.click()"
          />
        </QBtnGroup>
      </QToolbar>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
  <input ref="imagesRef" class="hidden" type="file" accept="image/*" multiple @change="onMedia" />
</template>

<script setup lang="ts">
import type { UploadImagesResponse } from '@/types';
import { ref, provide, watch } from 'vue';
import { useStore } from '@/stores';
import { useFetch } from '@/hooks';
import { ImageService } from '@/api/services';

defineProps<{
  title: string;
}>();

const store = useStore();
const images = ref<{ link: string; fileId: string }[]>([]);
const selection = ref<string[]>([]);
const imagesRef = ref<HTMLInputElement | null>(null);
const { f: uploadImages, data: uploadResult, loading } = useFetch<UploadImagesResponse>({
  fn: ImageService.uploadImages,
});
const { f: deleteImages, data: deleteResult, loading: isDeleteLoading } = useFetch<string[]>({ fn: onDeleteImages });

provide('images', { images, selection });
watch([uploadResult, deleteResult], ([newUpload, newDelete], [oldUpload, oldDelete]) => {
  if (newUpload !== oldUpload) {
    uploadResult.value && (images.value = [...images.value, ...uploadResult.value]);
  } else if (newDelete !== oldDelete) {
    images.value = images.value.filter((img) => !deleteResult.value?.includes(img.fileId));
    selection.value = [];
  }
});
async function onMedia(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files) {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData?.append('images', file));
    uploadImages(formData);
  }
}

async function onDeleteImages() {
  return ImageService.deleteImages(selection.value);
}
</script>

<style lang="scss" scoped></style>

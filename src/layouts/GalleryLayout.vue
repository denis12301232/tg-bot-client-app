<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="primary" @click="$router.push('/')" />
        <QToolbarTitle>{{ t('gallery.layout.title') }}</QToolbarTitle>
        <QBtnGroup v-if="store.isAdmin" flat>
          <QBtn
            v-if="selection.length"
            icon="eva-trash"
            dense
            flat
            round
            color="negative"
            :loading="isDeleteLoading"
            :disable="isDeleteLoading"
            @click="deleteImages(selection)"
          >
            <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('gallery.hints.delete') }}</QTooltip>
          </QBtn>
          <QBtn
            icon="eva-upload-outline"
            dense
            flat
            round
            color="indigo"
            :disable="loading"
            :loading="loading"
            @click="imagesRef?.click()"
          >
            <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('gallery.hints.upload') }}</QTooltip>
          </QBtn>
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
import type { UploadImagesResponse, I18n, Langs } from '@/types';
import { ref, provide, watch } from 'vue';
import { useStore } from '@/stores';
import { useFetch } from '@/hooks';
import { ImageService } from '@/api/services';
import { useI18n } from 'vue-i18n';

type T = UploadImagesResponse;
type S = typeof ImageService.uploadImages;

const { t } = useI18n<I18n, Langs>();
const store = useStore();
const images = ref<{ link: string; fileId: string }[]>([]);
const selection = ref<string[]>([]);
const imagesRef = ref<HTMLInputElement | null>(null);
const { request: uploadImages, data: uploadResult, loading } = useFetch<T, S>(ImageService.uploadImages);
const { request: deleteImages, data: deleteResult, loading: isDeleteLoading } = useFetch<
  string[],
  typeof ImageService.deleteImages
>(ImageService.deleteImages);

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
</script>

<style lang="scss" scoped></style>

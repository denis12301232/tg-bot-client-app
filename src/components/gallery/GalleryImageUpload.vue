<template>
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
  <input ref="imagesRef" class="hidden" type="file" accept="image/*" multiple @change="onMedia" />
</template>

<script setup lang="ts">
import type { ImagesResponse, I18n, Langs, ImageInjected } from '@/types';
import { inject, ref, watch } from 'vue';
import { useFetch } from '@/hooks';
import { ImageService } from '@/api/services';
import { useI18n } from 'vue-i18n';

type T = ImagesResponse['images'];
type S = typeof ImageService.uploadImages;

const { images, total } = inject<ImageInjected>('data')!;
const { t } = useI18n<I18n, Langs>();
const { request: uploadImages, data: uploadResult, loading } = useFetch<T, S>(ImageService.uploadImages);
const imagesRef = ref<HTMLInputElement | null>(null);

watch(
  () => uploadResult.value,
  () => {
    if (uploadResult.value?.length) {
      images.value = [...uploadResult.value, ...images.value];
      total.value = uploadResult.value.length + total.value;
    }
  }
);

async function onMedia(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files) {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData?.append('images', file));
    uploadImages(formData);
    target.value = '';
  }
}
</script>

<style lang="scss" module></style>

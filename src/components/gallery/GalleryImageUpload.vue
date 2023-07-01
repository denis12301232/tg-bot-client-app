<template>
  <QCard class="q-pa-md">
    <QCardSection>
      <h5 class="text-center">{{ t('gallery.msgs.upload') }}</h5>
    </QCardSection>
    <QCardSection class="row justify-center q-mb-sm">
      <QUploader
        flat
        bordered
        accept="image/*"
        color="indigo"
        multiple
        batch
        :label="t('gallery.msgs.imgs')"
        :max-file-size="10e6"
        :filter="checkFileType"
        :factory="ImageService.uploadImages"
        @uploaded="onUploaded"
      >
      </QUploader>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import type { ImagesResponse, ImageInjected, Langs, I18n } from '@/types';
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { ImageService } from '@/api/services';

const { t } = useI18n<I18n, Langs>();
const { images, total } = inject<ImageInjected>('data')!;

function onUploaded(info: { files: readonly File[]; xhr: XMLHttpRequest }) {
  const data = JSON.parse(info.xhr.response) as ImagesResponse['images'];
  images.value = [...data, ...images.value];
  total.value = data.length + total.value;
}

function checkFileType(files: readonly File[] | FileList) {
  return Array.from(files).filter((file) => file.type.includes('image/'));
}
</script>

<style lang="scss" module></style>

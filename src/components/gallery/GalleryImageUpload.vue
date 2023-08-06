<template>
  <QCard :class="[$style.card, 'q-pa-md', 'row', 'justify-center']">
    <QUploader
      :class="$style.uploader"
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
  </QCard>
</template>

<script setup lang="ts">
import type { ImagesResponse, ImageInjected } from '@/types';
import { inject } from 'vue';
import { ImageService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  modal: [value: boolean];
}>();
const { t } = useI18n();
const { images, total } = inject<ImageInjected>('data')!;

function onUploaded(info: { files: readonly File[]; xhr: XMLHttpRequest }) {
  const data = JSON.parse(info.xhr.response) as ImagesResponse['images'];
  images.value = [...data, ...images.value];
  total.value = data.length + total.value;
  emit('modal', false);
}

function checkFileType(files: readonly File[] | FileList) {
  return Array.from(files).filter((file) => file.type.includes('image/'));
}
</script>

<style lang="scss" module>
.card {
  max-width: 400px !important;
  min-width: 300px;
  width: 100%;
}

.uploader {
  max-width: 350px;
  min-width: 250px;
  width: 100%;
}
</style>

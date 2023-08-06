<template>
  <QBtn
    v-if="selected.size"
    icon="eva-trash"
    dense
    flat
    round
    color="negative"
    :loading="loading"
    :disable="loading"
    @click="request(Array.from(selected))"
  >
    <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('gallery.hints.delete') }}</QTooltip>
  </QBtn>
</template>

<script setup lang="ts">
import type { ImageInjected } from '@/types';
import { inject } from 'vue';
import { useFetch } from '@/hooks';
import { ImageService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { selected, images, total } = inject<ImageInjected>('data')!;
const { t } = useI18n();
const { request, loading } = useFetch<string[], typeof ImageService.deleteImages>(ImageService.deleteImages, {
  afterSuccess: ({ data }) => {
    images.value = images.value.filter((img) => !data.value?.includes(img._id));
    selected.value.clear();
    total.value = total.value - data.value.length;
  },
});
</script>

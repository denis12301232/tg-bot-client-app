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
    @click="destroy(Array.from(selected))"
  >
    <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">
      {{ t('gallery.hints.delete') }}
    </QTooltip>
  </QBtn>
</template>

<script setup lang="ts">
import type { Injected } from '@/types';
import { inject } from 'vue';
import { useQuery } from '@/hooks';
import { ImageService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { selected, images, total } = inject<Injected.Image>('data')!;
const { t } = useI18n();
const { query: destroy, loading } = useQuery(ImageService.destroy, { onSuccess });

function onSuccess(ids: Awaited<ReturnType<typeof ImageService.destroy>>) {
  images.value = images.value.filter((img) => !ids.includes(img._id));
  selected.value.clear();
  total.value = total.value - ids.length;
}
</script>

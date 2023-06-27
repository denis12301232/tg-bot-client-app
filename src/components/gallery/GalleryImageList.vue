<template>
  <div class="q-pa-sm">
    <h3 class="text-center q-pa-lg q-my-sm">{{ t('gallery.title') }}</h3>
    <h5 v-if="!images.length && !loading" class="text-center text-negative">{{ error || t('gallery.errors.none') }}</h5>
    <div class="row justify-center q-gutter-sm">
      <QIntersection
        v-for="(image, index) of images"
        :key="index"
        transition="scale"
        class="example-item"
        once
        @visibility="onVisible"
      >
        <QCard
          flat
          bordered
          :class="['q-ma-sm', 'non-selectable', { 'red-border': selected.has(image.fileId) }]"
          @click="onTouch($event, image.fileId)"
        >
          <div class="image-block" @click="onOpen($event, index)">
            <QImg class="image_item" fit="cover" :src="image.link">
              <template #loading>
                <LoaderWheel size="35px" />
              </template>
            </QImg>
            <div class="image_hover"></div>
          </div>
        </QCard>
      </QIntersection>
    </div>
    <div v-if="loading" class="row justify-center">
      <QSpinnerDots size="3em" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoaderWheel from '~/LoaderWheel.vue';
import type { Langs, I18n, ImageInjected } from '@/types';
import { onMounted, inject } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  loading: boolean;
  error: string;
}>();
const emit = defineEmits<{
  open: [index: number];
  request: [];
}>();
const { images, total, selected } = inject<ImageInjected>('data')!;
const { t } = useI18n<I18n, Langs>();

onMounted(() => emit('request'));

function onVisible() {
  if ((total.value && total.value === images.value.length) || props.loading) {
    return;
  }
  emit('request');
}

function onOpen(e: MouseEvent, index: number) {
  if (!e.ctrlKey) {
    emit('open', index);
  }
}

function onTouch(e: MouseEvent, id: string) {
  if (e.ctrlKey) {
    selected.value.has(id) ? selected.value.delete(id) : selected.value.add(id);
  }
}
</script>

<style lang="scss" scoped>
.example-item {
  width: 290px;
}
.image-block {
  overflow: hidden;
  position: relative;
  cursor: pointer;
  height: auto;
  min-height: 200px;
  max-height: 200px;

  & .image_item {
    width: 100%;
    height: 100%;
    position: unset;
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
    .image_hover {
      opacity: 1;
    }
  }
}

.red-border {
  border: 1px solid $negative;
}
</style>

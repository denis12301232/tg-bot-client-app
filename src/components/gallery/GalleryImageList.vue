<template>
  <div class="q-pa-sm">
    <h3 class="text-center q-pa-lg q-my-sm">{{ t('gallery.title') }}</h3>
    <h5 v-if="!images.length && !loading" class="text-center text-negative">
      {{ error || t('gallery.errors.none') }}
    </h5>
    <div class="row justify-center q-gutter-sm">
      <QIntersection
        v-for="(image, index) of images"
        :key="index"
        class="example-item"
        transition="scale"
        once
        @visibility="onVisible"
      >
        <QCard
          :class="['q-ma-sm', 'non-selectable', { 'red-border': selected.has(image._id) }]"
          flat
          bordered
          @click="onClick($event, image._id, index)"
        >
          <div class="image-block">
            <QImg class="image_item" fit="cover" :src="`${ENV.IMAGE_URL}/${image.fileName}.${image.ext}`">
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
import type { Injected } from '@/types';
import { onMounted, inject } from 'vue';
import { useStore } from '@/stores';
import { ENV } from '@/util';
import { useI18n } from 'vue-i18n';

interface Props {
  loading: boolean;
  error: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  open: [index: number];
  request: [];
}>();
const { images, total, selected } = inject<Injected.Image>('data')!;
const store = useStore();
const { t } = useI18n();

onMounted(() => emit('request'));

function onVisible() {
  if ((total.value && total.value === images.value.length) || props.loading) {
    return;
  }
  emit('request');
}

function onClick(event: MouseEvent, id: string, index: number) {
  if (event.ctrlKey && store.isAdmin) {
    selected.value.has(id) ? selected.value.delete(id) : selected.value.add(id);
  } else {
    emit('open', index);
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

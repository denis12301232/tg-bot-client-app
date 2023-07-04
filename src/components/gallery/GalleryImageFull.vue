<template>
  <QCard class="fit column">
    <div class="row justify-between items-center">
      <div class="text-primary total">{{ index + 1 + ' / ' + total }}</div>
      <QBtn v-close-popup icon="eva-close" dense flat round color="negative" size="15px" />
    </div>
    <div class="row justify-center items-center" style="flex: 1 1 auto">
      <QImg class="img" :src="imgs[index]?.link" spinner-color="primary" fit="scale-down">
        <template #loading>
          <LoaderWheel size="35px" />
        </template>
      </QImg>
      <QBtn class="left" dense flat round icon="eva-arrow-ios-back-outline" size="15px" @click="onPrev" />
      <QBtn class="right" dense flat round icon="eva-arrow-ios-forward-outline" size="15px" @click="onNext" />
    </div>
    <div class="q-pa-sm text-center row justify-center" style="height: 50px">
      <div class="row items-center">
        <div class="text-body1 text-justify text-indigo">
          {{ imgs[index]?.description || t('gallery.msgs.noDescription') }}
        </div>
        <QPopupEdit v-if="imgs.length >= index + 1 && store.isAdmin" v-model="imgs[index].description" #="scope">
          <QInput v-model="scope.value" filled dense autofocus counter maxlength="50" />
          <div class="row justify-between q-mt-sm q-mb-sm">
            <QBtn
              round
              dense
              flat
              icon="eva-checkmark-outline"
              color="positive"
              @click="[scope.set(), onSave(imgs[index]._id, scope.value)]"
            />
            <QBtn round dense flat icon="eva-close-outline" color="negative" @click="scope.cancel" />
          </div>
        </QPopupEdit>
      </div>
    </div>
  </QCard>
</template>

<script setup lang="ts">
import LoaderWheel from '~/LoaderWheel.vue';
import type { I18n, ImagesResponse, Langs } from '@/types';
import { computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { ImageService } from '@/api/services';
import { useStore } from '@/stores';
import { useVModel } from '@/hooks';

const props = defineProps<{
  currentIndex: number;
  total: number;
  images: ImagesResponse['images'];
  loading: boolean;
}>();

const emit = defineEmits<{
  next: [];
  prev: [];
  request: [];
  'update:currentIndex': [value: number];
  'update:images': [value: ImagesResponse['images']];
}>();
const store = useStore();
const { t } = useI18n<I18n, Langs>();
const index = useVModel<number>('currentIndex');
const imgs = useVModel<ImagesResponse['images']>('images');

onMounted(() => document.addEventListener('keydown', changeImage));
onUnmounted(() => document.removeEventListener('keydown', changeImage));

function onPrev() {
  index.value > 0 && index.value--;
}

async function onNext() {
  if (index.value + 1 === props.total) {
    return;
  }
  index.value < props.total - 1 && index.value++;
  await nextTick();

  if (props.loading) {
    return;
  }

  if (index.value + 1 > imgs.value.length) {
    emit('request');
  }
}

function changeImage(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') onPrev();
  else if (event.key === 'ArrowRight') onNext();
}

async function onSave(id: string, value: string) {
  await ImageService.updateDescription(id, value).json();
}
</script>

<style lang="scss" scoped>
.img {
  max-width: 900px;
  min-width: 300px;
  max-height: 500px;
}

.right {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  right: 5px;
  z-index: 1;
}

.left {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  left: 5px;
  z-index: 1;
}

.total {
  font-size: 1.3em;
  font-weight: bolder;
  font-style: italic;
  padding-left: 5px;
}
</style>

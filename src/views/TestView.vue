<template>
  <div class="q-pa-md">
    <h3 class="text-center q-pa-lg q-my-sm">{{ t('gallery.title') }}</h3>
    <div class="row justify-center q-gutter-sm">
      <q-intersection
        v-for="(image, index) of images"
        :key="index"
        transition="scale"
        class="example-item"
        once
        @visibility="onVisible"
      >
        <q-card flat bordered class="q-ma-sm">
          <QImg class="image_item" fit="cover" :src="image.link">
            <template #loading>
              <LoaderWheel size="35px" />
            </template>
          </QImg>
          <q-card-section>
            <div class="text-h6">Card #{{ index }}</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>
        </q-card>
      </q-intersection>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoaderWheel from '~/LoaderWheel.vue';
import type { ImagesResponse, Langs, I18n } from '@/types';
import { ref, onMounted, watch } from 'vue';
import { useFetch } from '@/hooks';
import { ImageService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const page = ref(1);
const total = ref(0);
const images = ref<ImagesResponse['images']>([]);
const { request, loading, data } = useFetch<ImagesResponse, typeof ImageService.getImages>(ImageService.getImages);
const { t } = useI18n<I18n, Langs>();

onMounted(() => request({ page: page.value, limit: 10, descending: true, sort: 'createdAt' }));

function onVisible() {
  if ((total.value && total.value === images.value.length) || loading.value) {
    return;
  }
  request({ page: page.value, limit: 10, descending: true, sort: 'createdAt' });
}

watch(data, () => {
  if (data.value) {
    images.value = [...images.value, ...data.value.images];
    total.value = data.value.count;
    page.value++;
  }
});
</script>

<style lang="scss" scoped>
.example-item {
  height: 290px;
  width: 290px;
}
</style>

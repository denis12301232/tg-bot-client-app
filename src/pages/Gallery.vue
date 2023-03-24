<template>
  <div class="container">
    <QDialog class="modal" v-model="isModalVisible" maximized no-refocus @keydown="changeImage">
      <QCard class="row justify-center items-center test">
        <div class="total">{{ currentIndex + 1 + '/' + total }}</div>
        <QBtn class="left" dense flat round icon="chevron_left" color="white" @click="onPrev" />
        <QBtn class="right" dense flat round icon="chevron_right" color="white" @click="onNext" />
        <QBtn v-close-popup class="close" icon="close" dense flat round color="negative" />
        <QImg class="img" :src="images[currentIndex].link" spinner-color="secondary" fit="scale-down" />
      </QCard>
    </QDialog>
    <h3 class="text-center text-indigo q-pa-lg q-mb-sm">Галерея</h3>
    <h5 v-if="!images.length && !loading" class="text-center text-red">{{ error || 'Нет изображений' }}</h5>
    <QInfiniteScroll @load="onFetchImages">
      <div class="images">
        <div class="image-block" v-for="(img, index) in images" @click="onOpenImage(index)">
          <QImg class="image_item" fit="cover" :src="img.link" spinner-color="secondary" />
          <div class="image_hover"></div>
        </div>
      </div>
      <template #loading>
        <div class="row justify-center q-my-md">
          <QSpinnerDots color="primary" size="40px" />
        </div>
      </template>
    </QInfiniteScroll>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ImageService } from '@/api/services';

const pageToken = ref<string>();
const images = ref<{ link: string }[]>([]);
const currentIndex = ref(0);
const isModalVisible = ref(false);
const loading = ref(false);
const error = ref('');
const total = computed(() => images.value.length);

async function onFetchImages(index: number, done: (stop?: boolean | undefined) => void) {
  try {
    loading.value = true;
    error.value = '';
    const response = await ImageService.getImages(pageToken.value);
    images.value = [...images.value, ...response.data.images];
    pageToken.value = response.data.pageToken;
    pageToken.value ? done() : done(true);
  } catch (e) {
    e instanceof Error && (error.value = e.message);
    done(true);
  } finally {
    loading.value = false;
  }
}

function onOpenImage(index: number) {
  currentIndex.value = index;
  isModalVisible.value = true;
}

function onPrev() {
  currentIndex.value > 0 && currentIndex.value--;
}

function onNext() {
  currentIndex.value < total.value - 1 && currentIndex.value++;
}

function changeImage(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') onPrev();
  else if (event.key === 'ArrowRight') onNext();
}
</script>

<style scoped lang="scss">
.img {
  max-width: 900px;
  min-width: 300px;
}

.close {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
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
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 1.3em;
  font-weight: bolder;
  color: white;
  z-index: 1;
}

.container {
  & .images {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    padding: 0 10px 20px;

    & .image-block {
      overflow: hidden;
      position: relative;
      cursor: pointer;

      & .image_item {
        width: 100%;
        height: 100%;
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
  }
}

@media (max-width: 768px) {
  .container {
    & .images {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.test {
  background-color: rgba(0, 0, 0, 0.337);
}
</style>

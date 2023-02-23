<template lang="pug">
div(class="container")
   QDialog(v-model="isModalVisible" class="modal" maximized no-refocus @keydown="changeImage")
      div(class="modal_content")
         div(class="total") {{ currentIndex + 1 +'/' + total }}
         QIcon(class="left" name="chevron_left" size="45px" color="white" @click="onPrev")
         QIcon(class="right" name="chevron_right" size="45px" color="white" @click="onNext")
         QIcon(class="close" name="close" size="40px" color="white" v-close-popup)
         QImg(:src="images[currentIndex].link" class="img" spinner-color="secondary" fit="contain")
   h3(class="title") Галерея
   h4(v-if="!images.length && !loading" class="text-center text-red") Ничего не найдено
   QInfiniteScroll(@load="onFetchImages")
      div(class="images")
         div(v-for="(img, index) in images" class="image-block" @click="onOpenImage(index)")
            QImg(class="image_item" :src="img.link" spinner-color="secondary")
            div(class="image_hover")
      template(#loading)
         div(class="row justify-center q-my-md")
            QSpinnerDots(color="primary" size="40px")
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ImageService } from '@/api/services'


const pageToken = ref<string>();
const images = ref<{ link: string }[]>([]);
const currentIndex = ref(0);
const isModalVisible = ref(false);
const loading = ref(false);
const total = computed(() => images.value.length);

async function onFetchImages(index: number, done: (stop?: boolean | undefined) => void) {
   loading.value = true;
   const response = await ImageService.getImages(pageToken.value);
   images.value = [...images.value, ...response.data.images];
   pageToken.value = response.data.pageToken;
   pageToken.value ? done() : done(true);
   loading.value = false;
}

function onOpenImage(index: number) {
   currentIndex.value = index;
   isModalVisible.value = true;
}

function onPrev() {
   currentIndex.value > 0 ? currentIndex.value-- : currentIndex.value;
}

function onNext() {
   currentIndex.value < total.value - 1 ? currentIndex.value++ : currentIndex.value;
}

function changeImage(event: KeyboardEvent) {
   if (event.key === 'ArrowLeft') onPrev()
   else if (event.key === 'ArrowRight') onNext();
}
</script>

<style scoped lang="scss">
.modal_content {
   display: flex;
   justify-content: center;
   align-items: center;
   background: rgba(0, 0, 0, 0.468);
   position: relative;


   & .img {
      max-width: 900px;
      min-width: 300px;
   }

   & .close {
      position: absolute;
      top: 5px;
      right: 5px;
      z-index: 1;
      cursor: pointer;

      &:hover {
         transform: scale(1.1);
         color: $secondary !important;
      }
   }

   & .right {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      right: 5px;
      z-index: 1;
      cursor: pointer;

      &:hover {
         color: $secondary !important;
      }
   }

   & .left {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      left: 5px;
      z-index: 1;
      cursor: pointer;

      &:hover {
         color: $secondary !important;
      }
   }

   & .total {
      position: absolute;
      top: 5px;
      left: 5px;
      font-size: 1.8em;
      font-weight: bolder;
      color: $secondary;
   }
}

.container {
   & .title {
      text-align: center;
      padding: 20px;
      color: $primary;
      margin-bottom: 10px;
   }

   & .images {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      padding: 0 10px 20px;

      & .image-block {
         overflow: hidden;
         position: relative;
         cursor: pointer;
         -webkit-tap-highlight-color: transparent;

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

@media (max-width:768px) {
   .container {
      & .images {
         grid-template-columns: repeat(2, 1fr);
      }
   }
}
</style>
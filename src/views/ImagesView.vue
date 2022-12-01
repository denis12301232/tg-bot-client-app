<template lang="pug">
v-btn(class="home", @click="$router.push('/')") На главную
ImageModal(
   v-if="isVisible",
   :link="link", 
   :total="total",
   :current="current"
   @close="close",
   @next="nextImage",
   @prev="prevImage"
   )
h1(class="title") Галерея
div(class="images")
   div(class="image-block", v-for="(img, index) in images", @click="openImage(index)")
      img(:src="img.link")
      div(class="image-hover")
div(class="loading")
   LoadingWheel(v-if="isLoading")
div(class="observer")
   div(v-intersection="{ f: catchImages, canLoad: () => canLoad }")
</template> 

<script setup lang="ts">
import { ref, onMounted, provide, computed } from 'vue'
import { useFetching } from '@/hooks/useFetching';
import ImagesService from '@/api/services/ImagesService'
import ImageModal from '@/components/ImageModal.vue'

const images = ref<{ link: string }[]>([]);
const isVisible = ref(false);
const link = ref('');
const isImageLoading = ref(false);
const total = ref(0);
const current = ref(0);
const pageToken = ref<string>();
const canLoad = computed(() => typeof pageToken.value === 'string' && !isLoading.value);
const { fetchFunc: catchImages, isLoading } =
   useFetching({ callback: getImages, alert: false });

provide('isImageLoading', isImageLoading);
onMounted(catchImages);

async function getImages() {
   const response = await ImagesService.getImages(pageToken.value);
   images.value = [...images.value, ...response.data.images];
   pageToken.value = response.data.pageToken;
   total.value += response.data.images.length;
}

function close() {
   isVisible.value = false;
}

function openImage(index: number) {
   isImageLoading.value = true;
   link.value = images.value[index].link;
   current.value = index;
   isVisible.value = true;
}

async function nextImage() {
   if (isLoading.value) {
      return;
   } else if (current.value + 1 >= total.value && pageToken.value) {
      await getImages();
   } else if (current.value + 1 >= total.value) {
      return;
   }
   current.value++;
   isImageLoading.value = true;
   link.value = images.value[current.value].link;
}

function prevImage() {
   if (current.value - 1 < 0) return;
   current.value--;
   isImageLoading.value = true;
   link.value = images.value[current.value].link;
}
</script>

<style lang="scss" scoped>
.home {
   margin-left: 10px;
   margin-top: 10px;
}

.observer {
   padding: 1px;
   bottom: 0px;
}

.title {
   text-align: center;
   font-weight: bold;
   font-size: 3rem;
   text-transform: uppercase;
   letter-spacing: 0.01em;
   padding: 20px 0;
   margin: 0;
}

.loading {
   display: flex;
   justify-content: center;
}

.images {
   display: grid;
   grid-template-columns: repeat(4, 1fr);
   gap: 4px;
   padding: 0 10px 20px;

   & .image-block {
      overflow: hidden;
      position: relative;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      &>.image-hover {
         position: absolute;
         top: 0;
         bottom: 0;
         right: 0;
         left: 0;
         background-color: rgba(0, 0, 0, 0.7);
         opacity: 0;
      }

      &>img {
         transform: scale(1);
         transition: transform 3s;
         object-fit: cover;
         height: 100%;
         width: 100%;
      }

      &:hover>img {
         transform: scale(1.1);
      }

      &:hover>.image-hover {
         opacity: 1;
      }
   }
}

@media (max-width:768px) {
   .images {
      grid-template-columns: repeat(2, 1fr);
   }
}
</style>
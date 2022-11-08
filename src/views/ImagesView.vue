<template lang="pug">
VButton(class="home", @click="$router.push('/')") На главную
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
   div(
      class="image-block",
      v-for="(img, index) in images",
      @click="openImage(index)"
   )
      img(:src="img.link")
      div(class="image-hover")
div(class="error", v-if="errorMessage") {{errorMessage}}
div(class="loading")
   LoadingWheel(v-if="isLoading")
div(class="observer")
   div(v-intersection="{ f: getImages, canLoad: () => canLoad }")
</template> 

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import ImagesService from '@/api/services/ImagesService'
import ImageModal from '@/components/ImageModal.vue';
import { computed } from '@vue/reactivity';

const images = ref<{ link: string }[]>([]);
const isVisible = ref(false);
const link = ref('');
const isImageLoading = ref(false);
const total = ref(0);
const current = ref(0);
const isLoading = ref(false);
const pageToken = ref<string | undefined>(undefined);
const errorMessage = ref('');
const canLoad = computed(() => typeof pageToken.value === 'string' && !isLoading.value);

provide('isImageLoading', isImageLoading);
onMounted(getImages);

function getImages() {
   isLoading.value = true;
   errorMessage.value = '';
   ImagesService.getImages(pageToken.value)
      .then((response) => {
         images.value = [...images.value, ...response.data.images];
         pageToken.value = response.data.pageToken;
         total.value += response.data.images.length;
      })
      .catch(e => errorMessage.value = e.message)
      .finally(() => isLoading.value = false);
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

function nextImage() {
   if (current.value + 1 >= total.value) return;
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

.error {
   color: var(--error-message-color);
   text-align: center;
}

.title {
   text-align: center;
   font-weight: bold;
   font-size: 3rem;
   text-transform: uppercase;
   letter-spacing: 0.01em;
   color: var(--water-color);
   padding: 0 0 10px 0;
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

<!-- <template lang="pug">
   ImageModalWindow(
      v-if="imageStore.isOpened",
      :link="imageStore.link",
      @close="imageStore.closeWindow",
      @next="imageStore.nextImage",
      @prev="imageStore.prevImage"
   )
   h1.title Фото
      .images(@click="imageStore.openWindow")
         .image-block(
            v-for="(img, index) in imageStore.images",
            :data-index="index"
         )
            img(:src="SERVER_URL + img.link")
            .image-hover
   </template>
   
   <script lang="ts">
   import { defineComponent, onMounted } from "vue";
   import { useImageStore } from "@/store/image";
   import { catchImages } from "@/api/http/tools";
   import ImageModalWindow from "@/components/ImageModalWindow.vue"
   
   export default defineComponent({
      components: {
         ImageModalWindow
      },
      setup() {
         const imageStore = useImageStore();
         const SERVER_URL = process.env.VUE_APP_SERVER_URL;
   
         onMounted(async (): Promise<void> => {
            if (!imageStore.images.length) {
               const response = await catchImages({
                  limit: 10,
                  page: imageStore.page,
               });
               imageStore.images = response.images;
               imageStore.total = response.count;
            }
         });
   
         return { imageStore, SERVER_URL };
      },
   });
   </script>
   
   
   <style lang="scss" scoped>
   .title {
      text-align: center;
      font-weight: bold;
      font-size: 3rem;
      text-transform: uppercase;
      letter-spacing: 0.01em;
      color: $main-color;
   }
   .images {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      padding: 20px;
      & .image-block {
         overflow: hidden;
         position: relative;
         cursor: pointer;
         & > .image-hover {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.7);
            opacity: 0;
         }
         & > img {
            transform: scale(1);
            transition: transform 3s;
            object-fit: cover;
            height: 100%;
            width: 100%;
         }
         &:hover > img {
            transform: scale(1.1);
         }
         &:hover > .image-hover {
            opacity: 1;
         }
      }
   }
   </style> -->
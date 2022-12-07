<template lang="pug">
div(class="image-modal")
   div(class="image-count") {{ current + 1 + '/' + total }}
   ButtonImage(class="close-window", image="close.png", @click="emit('close')", :invert="false")
   ButtonImage(class="right-arrow", image="arrow-left.png", @click="emit('prev')", :invert="false")
   ButtonImage(class="left-arrow", image="arrow-right.png", @click="emit('next')", :invert="false")
   div(class="modal-content")
      LoadingWheel(v-show="isImageLoading")
      img(:src="link", v-show="!isImageLoading", @load="setLoading")
      div(class="image-description") {{ description }}
</template>

<script setup lang="ts">
import { inject, type Ref, onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
   document.addEventListener('keyup', onKeyUpEsc);
   document.addEventListener('keydown', changeImage);
});

onBeforeUnmount(() => {
   document.removeEventListener('keyup', onKeyUpEsc);
   document.removeEventListener('keydown', changeImage);
});

defineProps({
   link: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      default: "",
   },
   current: {
      type: Number,
      default: 0,
   },
   total: {
      type: Number,
      default: 0,
   }
});

const isImageLoading = inject<Ref<boolean>>('isImageLoading');
const emit = defineEmits(['close', 'prev', 'next']);
function setLoading() {
   isImageLoading!.value = false;
};

function changeImage(event: KeyboardEvent) {
   if (event.key === 'ArrowLeft') emit('prev');
   else if (event.key === 'ArrowRight') emit('next');
}

function onKeyUpEsc(event: KeyboardEvent) {
   if (event.key === 'Escape') {
      emit('close');
   }
}
</script>
   
<style lang="scss" scoped>
.image-modal {
   position: fixed;
   top: 0;
   left: 0;
   bottom: 0;
   right: 0;
   background: rgba(0, 0, 0, 0.836);
   z-index: 9999;
   display: flex;

   &>.modal-content {
      margin: auto;
      max-width: 800px;
      position: relative;
      user-select: none;

      &>.image-description {
         position: absolute;
         bottom: 0;
         left: 50%;
         margin-right: -50%;
         transform: translate(-50%);
      }
   }

   &>.close-window {
      position: absolute;
      right: 5px;
      top: 5px;
      z-index: 1;
   }

   &>.right-arrow {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      left: 5px;
      z-index: 1;
   }

   &>.left-arrow {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      right: 5px;
      z-index: 1;
   }

   &>.image-count {
      position: absolute;
      left: 5px;
      top: 5px;
      color: var(--water-color);
      font-size: 1.2em;
      font-weight: bold;
   }
}
</style>
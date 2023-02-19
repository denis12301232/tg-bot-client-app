<template lang="pug">
div(:class="$style.container")
   QIcon(v-close-popup :class="$style.close" name="close" size="40px" color="white")
   QImg(:class="$style.img" :src="src" fit="contain")
</template>

<script setup lang="ts">
defineProps<{
   src: string;
}>();
</script>

<style module lang="scss">
.container {
   display: flex;
   justify-content: center;
   align-items: center;

   & .img {
      max-width: 900px;
      max-height: calc(100% - 30px);
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
}
</style>
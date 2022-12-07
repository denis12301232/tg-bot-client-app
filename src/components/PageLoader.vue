<template lang="pug">
div(class="loader")
   div(class="loader_indicator", v-if="isLoading")
</template>

<script setup lang="ts">
defineProps({
   isLoading: {
      type: Boolean,
      required: true,
   }
})
</script>

<style lang="scss" scoped>
.loader {
   top: 0;
   width: 100%;
   height: 2px;
   animation-duration: 5s;
   z-index: 10000;
   position: fixed;

   & .loader_indicator {
      background-color: rgb(30, 144, 92);
      height: 100%;
      width: 95%;
      animation: l 5s linear;
   }
}

@keyframes l {
   from {
      width: 10%;
   }

   to {
      width: 95%;
   }
}
</style>
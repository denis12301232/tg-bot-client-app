<template lang="pug">
div(:class="$style.loading", :style="style")
   img(:class="$style.lodaing_image", src="@/assets/images/loading.png")
</template>

<script setup lang="ts">
const props = defineProps({
   width: {
      type: String,
      default: '35px'
   },
   height: {
      type: String,
      default: '35px'
   }
});

const style = {
   width: props.width,
   height: props.height,
};
</script>

<style lang="scss" module>
.loading {

   &>.lodaing_image {
      animation: rotate 5s infinite linear;
   }
}

@keyframes rotate {
   from {
      transform: rotate(0deg);
   }

   to {
      transform: rotate(360deg);
   }
}
</style>
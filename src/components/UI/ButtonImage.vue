<template lang="pug">
button(:class="$style.button_image", :style="style")
</template>
   
<script setup lang="ts">
const props = defineProps({
   image: {
      type: String,
      required: true,
   },
   width: {
      type: String,
      default: '25px'
   },
   height: {
      type: String,
      default: '25px'
   },
   backgroundColor: {
      type: String,
      default: 'transparent'
   }
});

const style = {
   backgroundImage: `url('${require('@/assets/' + props.image)}')`,
   width: props.width,
   height: props.height,
   backgroundColor: props.backgroundColor
};
</script>
 
<style lang="scss" module>
.button_image {
   min-width: 25px;
   min-height: 25px;
   border: none;
   border-radius: 5px;
   padding: 5px;
   background-size: cover;
   display: block;
   outline: none;
   -webkit-tap-highlight-color: transparent;

   &:hover {
      cursor: pointer;
      transform: scale(1.05);
   }

   &:disabled {
      transform: scale(1);
   }
}
</style>
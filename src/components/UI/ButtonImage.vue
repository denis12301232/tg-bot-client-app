<template lang="pug">
button(:class="[$style.button_image, dark ? $style.button_image_dark: '']", :style="style")
</template>
   
<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'

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
});

const { dark } = useTheme();

const style = {
   backgroundImage: `url('${require('@/assets/' + props.image)}')`,
   width: props.width,
   height: props.height,
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
   background-color: transparent;
   -webkit-tap-highlight-color: transparent;

   &:hover {
      cursor: pointer;
      transform: scale(1.05);
   }

   &:disabled {
      transform: scale(1);
   }
}

.button_image_dark {
   filter: invert(1);
}
</style>
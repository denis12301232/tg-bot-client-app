<template lang="pug">
div.header_burger
   span
</template>


<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
   name: 'v-burger',
});
</script>

<style lang="scss" scoped>
.header_burger {

   display: block;
   position: relative;
   width: 30px;
   height: 20px;

   &::before,
   &::after {
      content: '';
      background-color: white;
      position: absolute;
      width: 100%;
      height: 2px;
      left: 0;
   }

   &::before {
      top: 0;
   }

   &::after {
      bottom: 0;
   }

   & span {
      position: absolute;
      background-color: white;
      left: 0;
      width: 100%;
      height: 2px;
      top: 9px;
   }

}
</style>
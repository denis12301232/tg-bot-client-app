<template lang="pug">
div(:class="$style.header_burger")
   span(:class="$style.line")
</template>


<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
   name: 'v-burger',
});
</script>

<style lang="scss" module>
.header_burger {

   display: block;
   position: relative;
   width: 30px;
   height: 20px;
   cursor: pointer;
   user-select: none;

   &::before,
   &::after {
      content: '';
      background-color: white;
      position: absolute;
      width: 100%;
      height: 2px;
      left: 0;
      user-select: none;
   }

   &::before {
      top: 0;
   }

   &::after {
      bottom: 0;
   }

   & .line {
      position: absolute;
      background-color: white;
      left: 0;
      width: 100%;
      height: 2px;
      top: 9px;
   }
}
</style>
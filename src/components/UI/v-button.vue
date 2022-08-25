<template lang="pug">
button(:class="$style.button")
   slot
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
   name: "v-button",
});
</script>


<style lang="scss" module>
.button {
   margin: 0;
   box-sizing: border-box;
   font-size: 1rem;
   outline: none;
   user-select: none;
   background-color: rgb(19, 24, 114);
   padding: 10px 20px;
   border: none;
   border-radius: 5px;
   color: #fff;
   outline: none;
   cursor: pointer;
   letter-spacing: 1px;
   -webkit-tap-highlight-color: transparent;

   &:hover {
      background-color: rgb(38, 43, 150);
   }

   &:disabled {
      background: rgba(19, 24, 114, 0.481);
      ;
   }
}
</style>
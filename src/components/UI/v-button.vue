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
   border: none;
   padding: 5px;
   margin: 0;
   box-sizing: border-box;
   font-size: 1rem;
   outline: none;
   user-select: none;
   border-radius: 2px;
   background-color: rgb(19, 24, 114);
   color: white;

   &:hover {
      background-color: rgb(38, 43, 150);
      cursor: pointer;
   }

   &:disabled {
      background: rgba(19, 24, 114, 0.481);;
   }
}
</style>
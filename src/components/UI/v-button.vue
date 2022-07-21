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
   background-color: $main-color;
   color: white;

   &:hover {
      background-color: $main-color-hover;
      cursor: pointer;
   }

   &:disabled {
      background: rgba(4, 57, 136, 0.3);
   }
}
</style>
<template lang="pug">
button(:class="$style.cancel_button")
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
   name: "v-button-cancel",
});
</script>


<style lang="scss" module>
.cancel_button {
   width: 25px;
   height: 25px;
   background-image: url("@/assets/images/cancel.png");
   border: none;
   background-size: cover;
   background-color: transparent;
   min-width: 25px;
   min-height: 25px;
   -webkit-tap-highlight-color: transparent;

   &:hover {
      cursor: pointer;
      transform: scale(1.02);
   }
}
</style>
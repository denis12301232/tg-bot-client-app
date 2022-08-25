<template lang="pug">
button(:class="$style.confirm_button")
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
   name: "v-button-confirm",
});
</script>


<style lang="scss" module>
.confirm_button {
   width: 25px;
   height: 25px;
   min-width: 25px;
   min-height: 25px;
   background-image: url("@/assets/images/confirm.png");
   background-color: transparent;
   border: none;
   background-size: cover;
   display: block;
   -webkit-tap-highlight-color: transparent;

   &:hover {
      cursor: pointer;
      transform: scale(1.05);
   }
}
</style>
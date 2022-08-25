<template lang="pug">
button(:class="$style.user_button")
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
   name: "v-button-user",
});
</script>


<style lang="scss" module>
.user_button {
   width: 30px;
   height: 30px;
   background-image: url("@/assets/images/user.png");
   border: none;
   background-size: cover;
   background-color: transparent;
   user-select: none;
   outline: none;
   -webkit-tap-highlight-color: transparent;

   &:hover {
      cursor: pointer;
      transform: scale(1.01);
   }
}
</style>
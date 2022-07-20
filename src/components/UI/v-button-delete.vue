<template lang="pug">
button.delete-button
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
   name: "v-button-delete",
});
</script>


<style lang="scss" scoped>
.delete-button {
   width: 20px;
   height: 20px;
   background-image: url("@/assets/images/delete-light.png");
   border: none;
   background-size: cover;

   &:hover {
      cursor: pointer;
      transform: scale(1.05);
   }
}
</style>
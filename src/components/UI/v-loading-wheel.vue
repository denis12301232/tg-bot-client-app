<template lang="pug">
.loading
   img.lodaing_image(src="@/assets/images/loading.png", alt="")
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
   name: "v-loading-wheel",
   setup() { },
});
</script>
<style lang="scss" scoped>
.loading {
   width: 30px;
   height: 30px;
   padding: 5px;

   &>.lodaing_image {
      animation: rotate 5s infinite linear;
   }
}

@keyframes rotate {
   from {
      transform: rotate(0deg);
   }

   to {
      transform: rotate(360deg);
   }
}
</style>
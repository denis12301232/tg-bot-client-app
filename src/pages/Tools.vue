<template lang="pug">
div(class="container")
   RouterView
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.container {
   padding: 0 20px 20px 20px;
   width: 50%;
   margin: 0 auto;
}

@media (max-width:1024px) {
   .container {
      width: 60%;
   }
}

@media (max-width:768px) {
   .container {
      width: 70%;
   }
}

@media (max-width:560px) {
   .container {
      width: 100%;
      padding: 0 10px 20px 10px;
   }
}
</style>
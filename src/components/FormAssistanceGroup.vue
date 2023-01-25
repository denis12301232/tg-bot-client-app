<template lang="pug">
div(class="group")
   h6(class="title") {{ title }}
   slot
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>


<style lang="scss" scoped>
.group {
   padding: 0px 20px 20px 20px;
   border: 1px solid #ccc;
   border-radius: 5px;
   margin-bottom: 10px;

   & .title {
      margin-top: 20px;
      margin-bottom: 20px;
   }
}
</style>
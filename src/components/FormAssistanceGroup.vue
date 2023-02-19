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
   padding: 20px 20px 20px 20px;
   box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
   border-radius: 5px;
   margin-bottom: 10px;

   & .title {
      margin-bottom: 20px;
   }
}
</style>
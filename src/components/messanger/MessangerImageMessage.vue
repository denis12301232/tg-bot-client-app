<template lang="pug">
div(:class="[$style.images, { [$style.images_1]: images.length > 2, [$style.images_2]: images.length === 2, }]")
   QImg(v-for="img in images" :src="img" @click="emit('open', img)")
</template>

<script setup lang="ts">
defineProps<{
   images: string[];
}>();
const emit = defineEmits<{
   (event: 'open', link: string): void;
}>();
</script>

<style module lang="scss">
.images {
   display: grid;
   gap: 4px;
   width: 100%;
   cursor: pointer;
}

.images_1 {
   grid-template-columns: repeat(2, 1fr);
}

.images_2 {
   grid-template-columns: repeat(1, 1fr);
}

@media (max-width:1024px) {
   .images {
      width: 300px;
      grid-template-columns: repeat(1, 1fr);
   }
}

@media (max-width:768px) {
   .images {
      width: 200px;
      grid-template-columns: repeat(1, 1fr);
   }
}
</style>
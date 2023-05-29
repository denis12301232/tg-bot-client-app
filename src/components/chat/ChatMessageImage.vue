<template>
  <div :class="[$style.images, { [$style.images_many]: images.length > 1 }]">
    <QImg
      v-for="(img, index) in images"
      :key="index"
      :fit="images.length > 1 ? 'cover' : 'scale-down'"
      :class="$style.img"
      :src="img"
      @click="emit('open', img)"
    />
  </div>
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
}

.images_many {
  grid-template-columns: repeat(2, 1fr);
}

.img {
  transition: all 1s;
  overflow: hidden;
  max-width: 100%;
  height: auto;
  cursor: pointer;
  &:hover {
    transform: scale(1.01);
  }
}
</style>

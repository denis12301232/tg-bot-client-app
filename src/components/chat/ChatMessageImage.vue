<template>
  <div :class="[$style.images, { [$style.images_many]: filenames.length > 1 }]">
    <QImg
      v-for="(filename, index) in filenames"
      :key="index"
      :fit="filenames.length > 1 ? 'cover' : 'scale-down'"
      :class="$style.img"
      :src="imgs[index].src"
      @click="emit('open', imgs[index].src)"
    />
  </div>
</template>

<script setup lang="ts">
import { useGetTempUrl } from '@/hooks';
import { ref, onMounted } from 'vue';

const props = defineProps<{
  filenames: string[];
}>();
const emit = defineEmits<{
  open: [link: string];
}>();

const imgs = ref(props.filenames.map((filename) => useGetTempUrl(filename, 'image/*')));

onMounted(() => imgs.value.forEach((img) => img.getUrl()));
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

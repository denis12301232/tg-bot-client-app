<template>
  <div :class="[$style.images]">
    <QImg
      v-for="(filename, index) in filenames"
      :key="index"
      :fit="filenames.length > 1 ? 'cover' : 'scale-down'"
      :class="[$style.img, { [$style.image_one]: filenames.length === 1 }]"
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.image_one {
  flex: 0 0 100% !important;
}

.img {
  transition: all 1s;
  overflow: hidden;
  max-width: 100%;
  height: auto;
  flex: 0 0 calc(50% - 8px);
  cursor: pointer;
  &:hover {
    transform: scale(1.01);
  }
}
</style>

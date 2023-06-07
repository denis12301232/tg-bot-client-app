<template>
  <QCard class="fit column">
    <div class="row justify-between items-center">
      <div class="text-primary total">{{ currentIndex + 1 + ' / ' + total }}</div>
      <QBtn v-close-popup icon="eva-close" dense flat round color="negative" size="15px" />
    </div>
    <div class="row justify-center items-center" style="flex: 1 1 auto">
      <QImg class="img" :src="images[currentIndex].link" spinner-color="primary" fit="scale-down">
        <template #loading>
          <LoaderWheel size="35px" />
        </template>
      </QImg>
      <QBtn class="left" dense flat round icon="eva-arrow-ios-back-outline" size="15px" @click="emit('prev')" />
      <QBtn class="right" dense flat round icon="eva-arrow-ios-forward-outline" size="15px" @click="emit('next')" />
    </div>
  </QCard>
</template>

<script setup lang="ts">
import LoaderWheel from '~/LoaderWheel.vue';

defineProps<{
  currentIndex: number;
  total: number;
  images: { link: string; fileId: string }[];
}>();

const emit = defineEmits<{
  next: [];
  prev: [];
}>();
</script>

<style lang="scss" scoped>
.img {
  max-width: 900px;
  min-width: 300px;
  max-height: 500px;
}

.right {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  right: 5px;
  z-index: 1;
}

.left {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  left: 5px;
  z-index: 1;
}

.total {
  font-size: 1.3em;
  font-weight: bolder;
  font-style: italic;
  padding-left: 5px;
}
</style>

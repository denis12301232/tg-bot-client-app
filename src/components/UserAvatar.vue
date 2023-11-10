<template>
  <div>
    <QSkeleton v-if="loading" type="QAvatar" :size="size" />
    <QAvatar v-show="!loading" class="text-white" :size="size" :color="colorShow" :="$attrs">
      <span :class="$style.name">{{ avatar ? '' : name?.slice(0, 1) }}</span>
      <QImg
        v-if="avatar"
        :src="ENV.IMAGE_URL + '/' + avatar"
        fit="cover"
        width="100%"
        height="100%"
        no-spinner
        loading="eager"
        @load="onLoad"
      />
    </QAvatar>
  </div>
</template>

<script setup lang="ts">
import type { Props } from '@/types';
import { computed, ref } from 'vue';
import { ENV } from '@/util';

const props = withDefaults(defineProps<Props.Common.UserAvatar>(), { size: '45px', color: 'primary' });
const loading = ref(!!props.avatar);
const colorShow = computed(() => (props.avatar ? '' : props.color));
            
function onLoad() {
  loading.value = false;
}
</script>

<style module lang="scss">
.name {
  &::first-letter {
    text-transform: uppercase;
  }
}
</style>

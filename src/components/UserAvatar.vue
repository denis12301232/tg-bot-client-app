<template>
  <QSkeleton v-if="loading" type="QAvatar" :size="size" />
  <QAvatar v-show="!loading" class="text-white" :size="size" :color="color" :="$attrs">
    <span :class="$style.user_name">{{ avatar ? '' : name?.slice(0, 1) }}</span>
    <QImg
      v-if="avatar"
      :src="`${Constants.SERVER_URL}/avatars/${avatar}`"
      fit="cover"
      width="100%"
      height="100%"
      no-spinner
      loading="eager"
      @load="onLoad"
    />
  </QAvatar>
</template>

<script setup lang="ts">
import { Constants } from '@/util';
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    avatar?: string;
    name?: string;
    size?: string;
    color?: string;
  }>(),
  { size: '45px', color: 'primary' }
);

const loading = ref(Boolean(props.avatar));

function onLoad(e: any) {
  loading.value = false;
}
</script>

<style module lang="scss">
.user_name {
  &::first-letter {
    text-transform: uppercase;
  }
}
</style>

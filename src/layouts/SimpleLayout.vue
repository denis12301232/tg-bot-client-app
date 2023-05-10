<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="arrow_back" color="indigo" @click="$router.push('/')"></QBtn>
        <QToolbarTitle>{{ title }}</QToolbarTitle>
      </QToolbar>
    </QHeader>
    <QPageContainer class="window-height">
      <div class="fit scroll">
        <slot />
      </div>
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import { useStore } from '@/stores';

defineProps<{
  title: string;
}>();

const store = useStore();
</script>

<style lang="scss" scoped>

</style>

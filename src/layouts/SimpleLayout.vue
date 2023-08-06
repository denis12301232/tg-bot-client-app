<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal :elevated="elevated" height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="primary" @click="$router.push('/')"></QBtn>
        <QToolbarTitle v-if="title">{{ t(title) }}</QToolbarTitle>
      </QToolbar>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

withDefaults(
  defineProps<{
    title?: string;
    elevated?: boolean;
  }>(),
  { elevated: true }
);

const { t } = useI18n();
</script>

<style lang="scss" scoped></style>

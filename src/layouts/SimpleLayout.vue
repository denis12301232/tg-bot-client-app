<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="primary" @click="$router.push('/')"></QBtn>
        <QToolbarTitle>{{ t(title) }}</QToolbarTitle>
      </QToolbar>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
  title: string;
}>();

const { t } = useI18n();
</script>

<style lang="scss" scoped></style>

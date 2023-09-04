<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal :elevated="elevated" height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="primary" @click="back ? goBack() : router.push('/')" />
        <QToolbarTitle v-if="title">{{ t(title) }}</QToolbarTitle>
      </QToolbar>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import { useNavigation } from '@/hooks';
import { useI18n } from 'vue-i18n';

withDefaults(
  defineProps<{
    title?: string;
    elevated?: boolean;
    back?: boolean;
  }>(),
  { elevated: true, back: false }
);

const { t } = useI18n();
const { router, goBack } = useNavigation();
</script>

<style lang="scss" scoped></style>

<template>
  <QLayout view="hHh lpR fFf">
    <QHeader elevated class="header" height-hint="98">
      <QToolbar>
        <QBtn icon="eva-arrow-back" color="red-10" dense flat round @click="$router.push('/')" />
        <QToolbarTitle>{{ t('account.layout.title') }}</QToolbarTitle>
      </QToolbar>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import type { I18n, Langs } from '@/types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n<I18n, Langs>({ useScope: 'global' });
</script>

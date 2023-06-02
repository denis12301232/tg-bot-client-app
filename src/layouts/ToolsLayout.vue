<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="red-10" @click="$router.push('/')" />
        <QToolbarTitle>{{ t('tools.layout.title') }}</QToolbarTitle>
      </QToolbar>
      <QTabs align="left" active-color="red-10">
        <QRouteTab to="/tools/google" :label="t('tools.layout.tabs.google')" />
        <QRouteTab to="/tools/sheets" :label="t('tools.layout.tabs.sheets')" />
        <QRouteTab to="/tools/roles" :label="t('tools.layout.tabs.roles')" />
      </QTabs>
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

<style lang="scss" scoped></style>

<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="red-10" @click="$router.push('/')" />
        <QToolbarTitle>{{ t('stats.title') }}</QToolbarTitle>
      </QToolbar>
      <QTabs align="left" active-color="red-10">
        <QRouteTab to="/stats/month" :label="t('stats.tabs.month')" />
        <QRouteTab to="/stats/day" :label="t('stats.tabs.days')" />
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

const { t } = useI18n<I18n, Langs>();
</script>

<style lang="scss" scoped></style>

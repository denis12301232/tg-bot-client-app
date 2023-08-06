<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="primary" @click="$router.push('/')" />
        <QToolbarTitle>{{ t('tools.layout.title') }}</QToolbarTitle>
      </QToolbar>
      <QTabs align="left" active-color="primary">
        <QRouteTab to="/tools/roles" :label="t('tools.tabs.roles')" />
        <QRouteTab to="/tools/google" :label="t('tools.tabs.google')" />
      </QTabs>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style lang="scss" scoped></style>

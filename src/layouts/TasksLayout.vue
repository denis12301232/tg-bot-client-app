<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="primary" @click="$router.push('/')" />
        <QToolbarTitle>{{ t('tasks.layout.title') }}</QToolbarTitle>
      </QToolbar>
      <QTabs align="left" active-color="primary">
        <QRouteTab to="/tasks" :label="t('tasks.layout.tabs.list')" />
        <QRouteTab v-if="store.isAdmin" to="/tasks/create" :label="t('tasks.layout.tabs.create')" />
      </QTabs>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import { useStore } from '@/stores';
import { useI18n } from 'vue-i18n';

const store = useStore();
const { t } = useI18n();
</script>

<style lang="scss" scoped></style>

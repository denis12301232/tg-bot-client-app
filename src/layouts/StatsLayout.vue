<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="arrow_back" color="indigo" @click="$router.push('/')" />
        <QToolbarTitle>Статистика</QToolbarTitle>
      </QToolbar>
      <QTabs align="left" active-color="secondary">
        <QRouteTab to="/stats/month" label="По месяцам" />
        <QRouteTab to="/stats/day" label="По дням" />
      </QTabs>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import { useStore } from '@/stores';

const store = useStore();
</script>

<style lang="scss" scoped></style>

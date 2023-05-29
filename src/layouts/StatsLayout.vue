<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="red-10" @click="$router.push('/')" />
        <QToolbarTitle>Статистика</QToolbarTitle>
      </QToolbar>
      <QTabs align="left" active-color="red-10">
        <QRouteTab to="/stats/month" label="По месяцам" />
        <QRouteTab to="/stats/day" label="По дням" />
      </QTabs>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>

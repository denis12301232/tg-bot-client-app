<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="arrow_back" color="indigo" @click="$router.push('/')" />
        <QToolbarTitle>Настройки</QToolbarTitle>
      </QToolbar>
      <QTabs align="left" active-color="secondary">
        <QRouteTab to="/tools/google" label="Интегрция с Google" />
        <QRouteTab to="/tools/sheets" label="Выгрузить заявки" />
        <QRouteTab to="/tools/roles" label="Настроить роли" />
      </QTabs>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>

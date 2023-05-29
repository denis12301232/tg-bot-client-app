<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="red-10" @click="$router.push('/')" />
        <QToolbarTitle>Задачи</QToolbarTitle>
      </QToolbar>
      <QTabs align="left" active-color="red-10">
        <QRouteTab to="/tasks/list" label="Список задач" />
        <QRouteTab v-if="store.isAdmin" to="/tasks/create" label="Создать задачу" />
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

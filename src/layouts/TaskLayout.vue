<template>
  <QLayout :class="store.currentTheme === 'dark' ? 'dark' : 'light'" view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="arrow_back" color="indigo" @click="$router.push('/')" />
        <QToolbarTitle>Задачи</QToolbarTitle>
      </QToolbar>
      <QTabs align="left" active-color="secondary">
        <QRouteTab to="/task/list" label="Список задач" />
        <QRouteTab v-if="store.isAdmin" to="/task/create" label="Создать задачу" />
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

<style lang="scss" scoped>
.light {
  & .header {
    background-color: white;
    color: black;
  }
}

.dark {
  & .header {
    background-color: #121212;
  }
}
</style>

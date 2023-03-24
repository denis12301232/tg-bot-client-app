<template>
  <QLayout :class="store.currentTheme === 'dark' ? 'dark' : 'light'" view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="arrow_back" color="indigo" @click="goBack" />
        <QToolbarTitle>Настройки аккаунта</QToolbarTitle>
      </QToolbar>
      <QTabs v-model="layoutStore.account.tab" align="left" active-color="secondary">
        <QTab name="avatar" label="Аватар" />
        <QTab name="name" label="Имя" />
        <QTab name="email" label="Е-мэйл" />
        <QTab name="password" label="Пароль" />
      </QTabs>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import { useStore, useLayoutStore } from '@/stores';
import { useNavigation } from '@/hooks';

const store = useStore();
const layoutStore = useLayoutStore();
const { goBack } = useNavigation();
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

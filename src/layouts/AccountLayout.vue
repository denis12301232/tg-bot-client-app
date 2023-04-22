<template>
  <QLayout :class="store.currentTheme === 'dark' ? 'dark' : 'light'" view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="arrow_back" color="indigo" @click="goBack" />
        <QToolbarTitle>Настройки аккаунта</QToolbarTitle>
      </QToolbar>
      <QTabs v-model="tab" align="left" active-color="secondary">
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
import { ref, provide } from 'vue';
import { useStore } from '@/stores';
import { useNavigation } from '@/hooks';

const tab = ref('avatar');
const store = useStore();
const { goBack } = useNavigation();

provide('tab', tab);
</script>

<style lang="scss" scoped>

</style>

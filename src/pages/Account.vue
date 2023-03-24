<template>
  <div class="container">
    <h4 class="q-mt-lg q-mb-md text-center">Настройки аккаунта</h4>
    <QTabPanels
      v-model="layoutStore.account.tab"
      class="tab_panel"
      animated
      swipeable
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <QTabPanel class="tab" name="avatar">
        <AccountSetAvatar />
      </QTabPanel>
      <QTabPanel class="tab" name="name">
        <AccountSetName :name="store.user.name" />
      </QTabPanel>
      <QTabPanel class="tab" name="email">
        <AccountSetEmail :email="store.user.email" />
      </QTabPanel>
      <QTabPanel class="tab" name="password">
        <AccountSetPassword />
      </QTabPanel>
    </QTabPanels>
  </div>
</template>

<script setup lang="ts">
import { AccountSetAvatar, AccountSetName, AccountSetEmail, AccountSetPassword } from '~/account';
import { useStore, useLayoutStore } from '@/stores';

const store = useStore();
const layoutStore = useLayoutStore();
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  & .tab_panel {
    width: calc(100% - 10px);
    background-color: transparent;
  }

  & .tab {
    max-width: 500px;
    min-width: 280px;
    margin: 0 auto;
    overflow: hidden;
  }
}
</style>

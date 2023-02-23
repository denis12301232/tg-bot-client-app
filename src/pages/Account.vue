<template lang="pug">
div(class="container")
   h5(class="title") Настройки аккаунта
   QTabPanels(v-model="layoutStore.account.tab" class="tab_panel" animated swipeable transition-prev="jump-up" transition-next="jump-up")
      QTabPanel(name="avatar" class="tab")
         AccountSetAvatar
      QTabPanel(name="name" class="tab")
         AccountSetName(:name="store.user.name")
      QTabPanel(name="email" class="tab")
         AccountSetEmail(:email="store.user.email")
      QTabPanel(name="password" class="tab")
         AccountSetPassword
</template>

<script setup lang="ts">
import AccountSetAvatar from '~/account/AccountSetAvatar.vue'
import AccountSetName from '~/account/AccountSetName.vue'
import AccountSetEmail from '~/account/AccountSetEmail.vue'
import AccountSetPassword from '~/account/AccountSetPassword.vue'
import { useStore, useLayoutStore } from '@/stores'


const store = useStore();
const layoutStore = useLayoutStore();
</script>

<style scoped lang="scss">
.container {
   display: flex;
   flex-direction: column;
   align-items: center;

   & .title {
      margin: 20px 0 10px 0;
   }

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
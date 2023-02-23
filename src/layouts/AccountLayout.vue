<template lang="pug">
QLayout(:class="store.currentTheme === 'dark' ? 'dark' : 'light'" view="hHh lpR fFf")
   QHeader(class="header" reveal elevated height-hint="98")
      QToolbar
         QBtn(dense flat round icon="arrow_back" color="indigo" @click="$router.push('/')")
         QToolbarTitle Аккаунт
      QTabs(v-model="layoutStore.account.tab" align="left" active-class="active")
         QTab(name="avatar" label="Аватар")
         QTab(name="name" label="Имя")
         QTab(name="email" label="Е-мэйл")
         QTab(name="password" label="Пароль")
   QPageContainer
      slot
</template>
   
<script setup lang="ts">
import { useStore, useLayoutStore } from '@/stores'

const store = useStore();
const layoutStore = useLayoutStore();
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

.active {
   color: $secondary;
}
</style>
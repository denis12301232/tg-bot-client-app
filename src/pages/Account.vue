<template lang="pug">
ToolsLayout(title="Аккаунт")
   div(class="container")
      h5(class="title") Настройки аккаунта
      AccountSetAvatar
      AccountSetName(:name="store.user.name")
      AccountSetEmail(:email="store.user.email")
      AccountSetPassword
</template>

<script setup lang="ts">
import ToolsLayout from '@/layouts/ToolsLayout.vue'
import AccountSetAvatar from '~/account/AccountSetAvatar.vue'
import AccountSetName from '~/account/AccountSetName.vue'
import AccountSetEmail from '~/account/AccountSetEmail.vue'
import AccountSetPassword from '~/account/AccountSetPassword.vue'
import { useStore } from '@/stores'


const store = useStore();
</script>

<style scoped lang="scss">
.container {
   padding: 0 30px 30px 30px;
   width: 50%;

   & .title {
      margin: 20px 0 10px 0;
   }
}

@media (max-width:1024px) {
   .container {
      width: 60%;
   }
}

@media (max-width:768px) {
   .container {
      width: 70%;
   }
}

@media (max-width:480px) {
   .container {
      width: 100%;
   }
}
</style>
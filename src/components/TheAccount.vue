<template lang="pug">
v-btn(:class="$style.home_button", @click="$router.push('/')") На главную
div(:class="$style.account")
   h1(:class="$style.title") Настройки аккаунта
   ul(:class="$style.tools")
      li(:class="$style.tools_list")
         TheAccountSetName
      li(:class="$style.tools_list")
         TheAccountSetEmail
      li(:class="$style.tools_list")
         TheAccountSetPassword
</template>

<script setup lang="ts">
import TheAccountSetName from './TheAccountSetName.vue'
import TheAccountSetEmail from './TheAccountSetEmail.vue'
import TheAccountSetPassword from './TheAccountSetPassword.vue'
</script>

<style lang="scss" module>
.home_button {
   margin: 10px 0px 0px 10px;
}

.account {
   margin: 0 auto;
   width: 90%;

   & .title {
      padding: 20px 0;
   }

   & .tools_list {
      padding-bottom: 5px;
      width: 50%;
   }
}

@media(max-width:768px) {
   .account {
      & h1 {
         text-align: center;
      }

      & .tools_list {
         width: 100%;
      }
   }
}
</style>
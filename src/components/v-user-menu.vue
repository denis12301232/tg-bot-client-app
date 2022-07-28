<template lang="pug">
div.buttons
   v-button(@click="logout") Выйти
</template>


<script setup lang="ts">
import { useHeaderStore } from '@/store/headerStore';
import AuthController from '@/api/controllers/AuthController';

const headerStore = useHeaderStore();

const logout = async (): Promise<void> => {
   await AuthController.logout();
   headerStore.isUserMenuVisible = false;
}

</script>


<style lang="scss" scoped>
.buttons {
   width: 120px;
   display: flex;
   flex-direction: column;
   background-color: white;
   padding: 5px;

   & button:not(:first-child) {
      margin-top: 5px;
   }
}
</style>
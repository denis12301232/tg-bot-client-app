<template lang="pug">
div(:class="$style.menu")
   ul(:class="$style.menu_list")
      li(:class="$style.list_item")
         router-link(:class="$style.menu_link", to="/account", @click="headerStore.isUserMenuVisible = false") Аккаунт
      li(:class="$style.list_item")
         router-link(:class="$style.menu_link", to="/tools", @click="headerStore.isUserMenuVisible = false") Инструменты
      li(:class="$style.list_item")
         a(:class="$style.menu_link", @click="logout") Выйти
</template>


<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from '@/store/main';
import { useHeaderStore } from '@/store/headerStore'
import AuthController from '@/api/controllers/AuthController'

const store = useStore();
const headerStore = useHeaderStore();
const router = useRouter();

const logout = async (): Promise<void> => {
   await AuthController.logout();
   headerStore.isUserMenuVisible = false;
}

const settings = (): void => {
   router.push('/tools');
   headerStore.isUserMenuVisible = false;
}
</script>


<style lang="scss" module>
.menu {
   min-width: 150px;
   background-color: white;
   border-radius: 4px;
   box-shadow: 0 4px 16px #ccc;

   &::before {
      content: "";
      position: absolute;
      margin-left: -5px;
      top: -7px;
      right: 24.5px;
      width: 12px;
      height: 12px;
      background: white;
      border: solid #ccc;
      border-width: 1px 0 0 1px;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
   }

   & .user_info {
      display: flex;
      flex-direction: column;
      align-items: center;
   }

   & .menu_list {
      padding: 10px 20px;

      & .list_item {
         & .menu_link {
            text-decoration: none;
            cursor: pointer;

            &:visited {
               color: inherit;
            }

            &:hover,
            &:focus {
               color: #C4433A;
            }
         }
      }
   }
}
</style>
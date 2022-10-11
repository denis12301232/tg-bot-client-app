<template lang="pug">
div(:class="[$style.menu, dark ? $style.menu_dark : $style.menu_light]")
   ul(:class="$style.menu_list")
      li(:class="$style.list_item")
         router-link(:class="$style.menu_link", to="/account", @click="headerStore.isUserMenuVisible = false") Аккаунт
      li(:class="$style.list_item", v-if="store?.user?.roles?.includes('admin')")
         router-link(:class="$style.menu_link", to="/tools", @click="headerStore.isUserMenuVisible = false") Инструменты
      li(:class="$style.list_item")
         a(:class="$style.menu_link", @click="logout") Выйти
</template>


<script setup lang="ts">
import { useStore } from '@/store/mainStore'
import { useHeaderStore } from '@/store/headerStore'
import { useTheme } from '@/hooks/useTheme'
import AuthController from '@/api/controllers/AuthController'

const emit = defineEmits<{ (e: 'loading', value: boolean): void }>();
const store = useStore();
const headerStore = useHeaderStore();
const { dark } = useTheme();

async function logout(): Promise<void> {
   emit('loading', true);
   await AuthController.logout();
   headerStore.isUserMenuVisible = false;
   emit('loading', false);
}
</script>


<style lang="scss" module>
.menu {
   min-width: 150px;
   background-color: white;
   border-radius: 4px;
   user-select: none;
   -webkit-tap-highlight-color: transparent;

   &::before {
      content: "";
      position: absolute;
      margin-left: -5px;
      top: -7px;
      right: 24.5px;
      width: 12px;
      height: 12px;
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

.menu_light {
   background-color: var(--background-color-light);
   box-shadow: 0 4px 16px #ccc;

   &::before {
      background-color: var(--background-color-light);
   }
}

.menu_dark {
   background-color: var(--background-color-dark);
   box-shadow: 0px 4px 16px #e9e6e41a;

   &::before {
      background-color: var(--background-color-dark);
   }
}
</style>
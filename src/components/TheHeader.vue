<template lang="pug">
v-modal(:show="headerStore.isModalVisible", @hide="headerStore.hideWindow")
   FormLog(v-show="headerStore.isLogVisible", @swap="swapForms", @restore="restore")
   FormReg(v-show="headerStore.isRegVisible", @swap="swapForms")
div(:class="$style.container")
   ul(:class="$style.menu")
      li(v-if="store.isAdmin")
         v-burger(:class="$style.burger_hide", @click.stop="showMenu")
      li(v-if="!store.isAdmin")
         div(:class="$style.title") Kharkov Volonteer
      li(v-if="store.isAdmin")
         a(
            :class="[$style.menu_link, currentRoute === 'home' ? $style.selected : '']", 
            @click.prevent="$router.push('/')", 
            href="/"
         ) Внести данные
      li(v-if="store.isAdmin")
         a(
            :class="[$style.menu_link, currentRoute === 'list' ? $style.selected : '']",
            @click.prevent="$router.push('/list')", 
            href="/list"
         ) Полный список
      li(v-if="store.isAdmin")
         a(
            :class="[$style.menu_link, currentRoute === 'info' ? $style.selected : '']", 
            @click.prevent="$router.push('/info')", 
            href="/info"
         ) Информация по человеку
   div(:class="$style.sign")
      v-button(@click="setLogVisible", v-if="!store.isAuth") Вход
      v-button-user(@click.stop="showUserMenu", v-else)
   MenuHeader(:class="$style.header_menu", v-show="headerStore.isHeaderMenuVisible")
   MenuUser(:class="$style.user_menu", v-show="headerStore.isUserMenuVisible")
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "@/store/main"
import { useHeaderStore } from "@/store/headerStore"
import MenuHeader from "./MenuHeader.vue"
import FormLog from "./FormLog.vue"
import FormReg from "./FormReg.vue"
import MenuUser from "./MenuUser.vue"


const store = useStore();
const router = useRouter();
const headerStore = useHeaderStore();
const currentRoute = computed(() => useRoute().name);

const showMenu = (): void => {
   headerStore.isHeaderMenuVisible = !headerStore.isHeaderMenuVisible;
};

const showUserMenu = (): void => {
   headerStore.isUserMenuVisible = !headerStore.isUserMenuVisible
};

const setModalVisible = (): void => {
   headerStore.isModalVisible = !headerStore.isModalVisible;
};

const setLogVisible = (): void => {
   setModalVisible();
   headerStore.isLogVisible = !headerStore.isLogVisible;
};

const swapForms = (): void => {
   headerStore.isRegVisible = !headerStore.isRegVisible;
   headerStore.isLogVisible = !headerStore.isLogVisible;
};

const restore = (): void => {
   setLogVisible();
   router.push('/restore');
};
</script>

<style lang="scss" module>
.title {
   text-align: center;
   color: $water-color;
   position: relative;
   //padding: 5px;
   font-weight: 700;
   font-style: italic;
   font-size: 1.3em;
}

.container {
   background-color: $light-content-color;
   box-shadow: 0px 4px 8px #E9E6E4;
   height: 50px;
   position: relative;
   display: flex;
   justify-content: space-between;
   align-items: center;
   position: fixed;
   width: 100%;
   z-index: 10;
   top: 0;

   &>.menu {
      display: flex;
      align-items: center;
      margin: 0 15px;

      & .menu_link {
         cursor: pointer;
         text-align: center;
         text-decoration: none;
         padding: 5px;
         object-fit: cover;
         display: inline-block;

         &:visited {
            color: black;
         }

         &.selected,
         &:hover {
            color: #C4433A
         }
      }

   }

   & .sign {
      margin: 0 15px;
   }

   & .header_menu {
      position: absolute;
      left: 0px;
      top: 50px;
   }

   & .user_menu {
      position: absolute;
      right: 0px;
      top: 50px;
   }
}

.burger_hide {
   display: none !important;
}

@media(max-width:768px) {
   .burger_hide {
      display: block !important;
   }

   .menu_link {
      display: none !important;
   }
}
</style>
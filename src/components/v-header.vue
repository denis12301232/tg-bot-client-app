<template lang="pug">
v-modal(:show="headerStore.isModalVisible", @hide="headerStore.hideWindow")
   v-form-log(v-show="headerStore.isLogVisible", @swap="swapForms")
   v-form-reg(v-show="headerStore.isRegVisible", @swap="swapForms")
div(:class="$style.menu_container")
   div(:class="$style.menu")
      div(
         :class="[$style.point, currentRoute === 'home' ? $style.selected : '']",
         @click="$router.push('/')"
         )  Внести данные
      div(
         :class="[$style.point, currentRoute === 'list' ? $style.selected : '']",
         @click="$router.push('/list')"
         )  Полный список
      div( 
         :class="[$style.point, currentRoute === 'info' ? $style.selected : '']",
         @click="$router.push('/info')"
         ) Информация по человеку
      v-burger(:class="$style.burger_hide", @click="showMenu")
   div(:class="$style.sign")
      v-button(@click="setLogVisible", v-if="!store.isAuth") Вход
      v-button(@click="showUserMenu", v-else) {{ store.user.name }}
   v-header-menu(:class="$style.header_menu", v-show="headerStore.isHeaderMenuVisible")
   v-user-menu(:class="$style.user_menu", v-show="headerStore.isUserMenuVisible")
h1(:class="$style.title") Kharkov Volonteer
</template>


<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store/main";
import { useHeaderStore } from "@/store/headerStore"
import VHeaderMenu from "./v-header-menu.vue";
import VFormLog from "./v-form-log.vue"
import vFormReg from "./v-form-reg.vue";
import VUserMenu from "./v-user-menu.vue";

const store = useStore();
const headerStore = useHeaderStore();
const currentRoute = computed(() => {
   return useRoute().name;
})

const showMenu = (): void => {
   headerStore.isHeaderMenuVisible = !headerStore.isHeaderMenuVisible;
};

const showUserMenu = (): void => {
   headerStore.isUserMenuVisible = !headerStore.isUserMenuVisible
}

const setModalVisible = (): void => {
   headerStore.isModalVisible = !headerStore.isModalVisible;
};

const setLogVisible = (): void => {
   setModalVisible();
   headerStore.isLogVisible = !headerStore.isLogVisible;
};

const setRegVisible = (): void => {
   setModalVisible();
   headerStore.isRegVisible = !headerStore.isRegVisible;
};

const swapForms = (): void => {
   headerStore.isRegVisible = !headerStore.isRegVisible;
   headerStore.isLogVisible = !headerStore.isLogVisible;
};
</script>


<style lang="scss" module>
.title {
   text-align: center;
   color: $water-color;
}

.menu_container {
   background-color: $light-content-color;
   box-shadow: 0px 4px 8px #E9E6E4;
   height: 50px;
   position: relative;
   display: flex;
   justify-content: space-between;
   align-items: center;

   &>.menu {
      display: flex;
      margin: 0 15px;

      & .point {
         cursor: pointer;
         user-select: none;
         text-align: center;
         padding: 5px;
         object-fit: cover;
         //font-weight: bold;

         &:hover {
            //font-weight: bold;
         }
      }
   }

   .sign {
      margin: 0 15px;
   }
}

.header_menu {
   position: absolute;
   left: 0px;
   top: 50px;
}

.user_menu {
   position: absolute;
   right: 0px;
   top: 50px;
}

.burger_hide {
   display: none !important;
}

.selected {
   //color: rgba(8, 186, 79, 0.414) !important;
   color: $water-color;
   font-weight: bold;
}

@media(max-width:768px) {
   .burger_hide {
      display: block !important;
   }

   .point {
      display: none !important;
   }
}
</style>
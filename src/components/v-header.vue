<template lang="pug">
.menu_container
   .menu
      div.point(@click="$router.push('/')", :class="{ selected: currentRoute === 'home' }") Внести данные
      div.point(@click="$router.push('/list')", :class="{ selected: currentRoute === 'list' }") Полный список
      div.point(@click="$router.push('/info')", :class="{ selected: currentRoute === 'info' }") Информация по человеку
      v-burger.burger_hide(@click="showMenu")
   v-header-menu.header_menu(v-show="headerStore.isHeaderMenuVisible")
h1.title Kharkov Volonteer
</template>


<script setup lang="ts">
import { useHeaderStore } from "@/store/headerStore"
import { computed } from "vue";
import VHeaderMenu from "./v-header-menu.vue";
import { useRoute } from "vue-router";

const headerStore = useHeaderStore();
const currentRoute = computed(() => {
   return useRoute().name;
})

const showMenu = (): void => {
   headerStore.isHeaderMenuVisible = !headerStore.isHeaderMenuVisible;
};
</script>


<style lang="scss" scoped>
.title {
   text-align: center;
}

.menu_container {
   background-color: $main-color;
   height: 50px;
   position: relative;

   &>.menu {
      flex-basis: 10%;
      display: flex;
      right: 15px;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);

      & .point {
         color: white;
         cursor: pointer;
         user-select: none;
         text-align: center;
         padding: 5px;
         object-fit: cover;
         font-weight: bold;

         &:hover {
            font-weight: bold;
         }
      }
   }
}

.header_menu {
   position: absolute;
   right: 10px;
   top: 50px;
}

.burger_hide {
   display: none !important;
}

.selected {
   color: rgba(8, 186, 79, 0.414) !important;
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
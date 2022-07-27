<template lang="pug">
div(:class="$style.menu_container")
   div(:class="$style.menu")
      div(
         :class="[$style.point, currentRoute === 'home' ? $style.selected : '']",
         @click="$router.push('/')") 
         | Внести данные
      div(
         :class="[$style.point, currentRoute === 'list' ? $style.selected : '']",
         @click="$router.push('/list')") 
         | Полный список
      div( 
         :class="[$style.point, currentRoute === 'info' ? $style.selected : '']",
         @click="$router.push('/info')")
         | Информация по человеку
      v-burger(:class="$style.burger_hide", @click="showMenu")
   v-header-menu(:class="$style.header_menu", v-show="headerStore.isHeaderMenuVisible")
h1(:class="$style.title") Kharkov Volonteer
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


<style lang="scss" module>
.title {
   text-align: center;
}

.menu_container {
   background-color: #303B44;
   height: 50px;
   position: relative;

   &>.menu {
      flex-basis: 10%;
      display: flex;
      left: 15px;
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
   left: 10px;
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
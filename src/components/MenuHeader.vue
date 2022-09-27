<template lang="pug">
div(class="nav")
   ul(class="nav_menu")
      li(class="nav_item")
         a(
            :class="['nav_link', currentRoute === 'home' ? 'active' : '']", 
            href="/", 
            @click.prevent="changeRoute('/')"
         ) Внести данные
      li(class="nav_item")
         a(
            :class="['nav_link', currentRoute === 'list' ? 'active' : '']", 
            href="/list",
            @click.prevent="changeRoute('/list')"
         ) Полный список
      li(class="nav_item")
         a(
            :class="['nav_link', currentRoute === 'info' ? 'active' : '']", 
            href="/info", 
            @click.prevent="changeRoute('/info')"
         ) Информация по человеку
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHeaderStore } from '@/store/headerStore'

const router = useRouter();
const headerStore = useHeaderStore();
const currentRoute = computed(() => {
   return useRoute().name;
});

function changeRoute(route: string): void {
   headerStore.isHeaderMenuVisible = false;
   router.push(route);
};
</script>


<style lang="scss" scoped>
.nav {
   min-width: 150px;
   background-color: white;
   border-radius: 4px;
   box-shadow: 0 4px 16px #ccc;

   & .nav_menu {
      & .nav_item {

         &:hover {
            color: #C4433A;
         }

         & .active {
            color: #C4433A !important;
            font-weight: bold;
         }

         & .nav_link {
            padding: 10px;
            text-decoration: none;
            cursor: pointer;
            display: block;
            -webkit-tap-highlight-color: transparent;

            &:visited {
               color: inherit;
            }
         }
      }
   }
}
</style>
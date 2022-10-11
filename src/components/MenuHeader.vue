<template lang="pug">
div(class="nav")
   ul(:class="['nav_menu', {'nav_light': light, 'nav_dark': dark}]")
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
import { useTheme } from '@/hooks/useTheme'


const router = useRouter();
const headerStore = useHeaderStore();
const { dark, light } = useTheme();
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
   border-radius: 4px;

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

.nav_light {
   background-color: var(--background-color-light);
   box-shadow: 0 4px 16px #ccc;
}

.nav_dark {
   background-color: var(--background-color-dark);
   box-shadow: 0px 4px 16px #e9e6e41a;
}
</style>
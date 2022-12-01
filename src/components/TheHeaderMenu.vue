<template lang="pug">
v-navigation-drawer(clipped floating temporary app v-model="store.isMenuVisible")
   v-list
      v-list-item
         v-btn(to="/", width="100%", class="nav")
            router-link(to="/", class="link") Внести данные
      v-list-item(v-if="store.isAdmin")
         v-btn(to="/list", width="100%", class="nav")
            router-link(to="/list", class="link") Полный список
      v-list-item(v-if="store.isAdmin")
         v-btn(to="/info", width="100%", class="nav")
            router-link(to="/info", class="link") Информация
      v-list-item
         v-btn(to="/images", width="100%", class="nav")
            router-link(to="/images", class="link") Галерея
</template>

<script setup lang="ts">
import { useStore } from '@/store/mainStore'

const store = useStore();
</script>
      
      
<style scoped lang="scss">
.nav {
   & .link {
      text-decoration: none;

      &:visited {
         color: inherit;
      }
   }

   &:hover {
      color: teal;
   }

}
</style>
      
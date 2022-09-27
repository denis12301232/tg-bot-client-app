<template lang="pug">
v-modal(:show="headerStore.isModalVisible", @hide="headerStore.hideWindow")
   FormLog(v-show="headerStore.isLogVisible", @swap="swapForms", @restore="restore")
   FormReg(v-show="headerStore.isRegVisible", @swap="swapForms")
div(:class="$style.container")
   ul(:class="$style.menu")
      li(v-if="store.isAdmin")
         v-burger(:class="$style.burger_hide", @click.stop="setMenu('isHeaderMenuVisible')")
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
      v-loading-wheel(width="30px", height="30px", v-if="isLoading")
      v-button(@click="setLogVisible", v-if="!store.isAuth") Вход
      v-button-user(@click.stop="setMenu('isUserMenuVisible')", v-else)
   Transition(name="fade")
      MenuHeader(:class="$style.header_menu", v-show="headerStore.isHeaderMenuVisible")
   Transition(name="fade")
      MenuUser(:class="$style.user_menu", v-show="headerStore.isUserMenuVisible", @loading="setLoading")
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store/main'
import { useHeaderStore } from '@/store/headerStore'
import MenuHeader from './MenuHeader.vue'
import FormLog from './FormLog.vue'
import FormReg from './FormReg.vue'
import MenuUser from './MenuUser.vue'


const store = useStore();
const router = useRouter();
const headerStore = useHeaderStore();
const currentRoute = computed(() => useRoute().name);
const isLoading = ref(false);

function setLoading(value: boolean): void {
   isLoading.value = value;
}

function setMenu(value: keyof typeof headerStore.$state): void {
   headerStore[value] = !headerStore[value];
}

function setLogVisible(): void {
   setMenu('isModalVisible');
   setMenu('isLogVisible');
};

function swapForms(): void {
   setMenu('isRegVisible');
   setMenu('isLogVisible');
};

function restore(): void {
   setLogVisible();
   router.push('/restore');
};
</script>

<style lang="scss" module>
.title {
   text-align: center;
   color: var(--water-color);
   position: relative;
   font-weight: 700;
   font-style: italic;
   font-size: 1.3em;
}

.container {
   background-color: var(--background-color-light);
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
      display: flex;
      place-items: center;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
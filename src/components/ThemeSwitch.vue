<template lang="pug">
label(class="theme_switch")
   input(class="theme_input", type="checkbox", @change="onChange", :checked="store.currentTheme === 'dark'")
   div(class="theme_check")
</template>
   
<script setup lang="ts">
import { useStore } from '@/store/mainStore'

const store = useStore();

function onChange(event: Event): void {
   const target = event.target as HTMLInputElement;

   if (target.checked) {
      store.theme = 'dark';
   } else {
      store.theme = 'light';
   }
   localStorage.setItem('theme', store.theme);
   document.documentElement.className = store.currentTheme;
}

</script>
   
   
<style lang="scss" scoped>
.theme_switch {
   width: 30px;
   height: 30px;
   display: block;
   position: relative;
   border-radius: 100%;
   cursor: pointer;
   -webkit-tap-highlight-color: transparent;

   &:hover {
      transform: scale(1.05);
   }

   & .theme_input {
      display: none;

      &:checked+.theme_check {
         background-image: url('@/assets/images/theme-light.png');
         filter: invert(1);
      }
   }

   & .theme_check {
      width: 100%;
      height: 100%;
      background-image: url('@/assets/images/theme-dark.png');
      background-size: cover;
   }
}
</style>
   
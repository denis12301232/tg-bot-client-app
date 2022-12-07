<template lang="pug">
page-loader(:is-loading="store.isPageLoading") 
v-app(:theme="store.currentTheme")
  div(class="alert", v-if="store.alert.isVisible")
  v-main
    router-view 
AlertModal(
  class="alert", 
  :message="store.alert.message",  
  :is-visible="store.alert.isVisible", 
  :type="store.alert.type",
  @show="store.showAlert"
  )
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useStore } from '@/store/mainStore'
import PageLoader from '@/components/PageLoader.vue'
import AlertModal from '@/components/AlertModal.vue'
import AuthController from '@/api/controllers/AuthController'

const store = useStore();

onBeforeMount(() => {
  store.ifThemeSaved();
  if (localStorage.getItem('token')) {
    AuthController.refresh();
  }
});
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
  width: 100vw;
  overflow-x: hidden;
  scrollbar-width: thin;
  font: 16px/1.4 Arial, sans-serif;
  letter-spacing: 0.5px;
  transition: background-color 0.1s ease-in;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --background-color-light: #FFFFFF;

  --background-color-dark: #232529;

  --water-color: rgb(66, 72, 186);
  --error-message-color: rgb(131, 12, 12);

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

html.light {
  background-color: var(--background-color-light);
  color: var(--background-color-dark);
}

html.dark {
  background-color: var(--background-color-dark);
  color: var(--background-color-light);
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
}

ul,
ol {
  padding: 0;
  margin: 0;
  list-style: none;
}

input,
button,
textarea,
select {
  font: inherit;
}

.alert {
  position: fixed;
  right: 5px;
  top: 65px;
  z-index: 9999;
}
</style>

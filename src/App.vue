<template lang="pug">
PageLoader(:is-loading="store.isPageLoading")
router-view
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useStore } from '@/store/mainStore'
import { useHeaderStore } from '@/store/headerStore'
import AuthController from '@/api/controllers/AuthController'
import PageLoader from '@/components/PageLoader.vue'

const store = useStore();
const headerStore = useHeaderStore();

onBeforeMount(async () => {
  window.addEventListener('click', () => {
    headerStore.isHeaderMenuVisible = false;
    headerStore.isUserMenuVisible = false;
  });
  if (localStorage.getItem('token')) {
    await AuthController.refresh();
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
  font: 16px/1.4 Avenir, Helvetica, Arial, sans-serif;
  letter-spacing: 0.5px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --background-color-light: #FFFFFF;
  --water-color: rgb(19, 24, 114);
  --error-message-color: rgb(131, 12, 12);
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background-color: var(--background-color-light);
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

::-webkit-scrollbar {
  width: 2px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

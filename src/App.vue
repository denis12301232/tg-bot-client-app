<template lang="pug">
v-header
router-view
</template>

<script setup lang="ts">
import vHeader from "./components/v-header.vue";
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font: 16px/1.4 Georgia, serif;
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: rgb(240, 235, 248);
  color: #2c3e50;
  margin-right: calc(-1 * (100vw - 100%)) !important;
}

img {
  max-width: 100%;
  display: block;
}

ul,
ol {
  padding: 0;
  margin: 0;
  list-style: none;
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

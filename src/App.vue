<template lang="pug">
router-view
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import AuthController from "./api/controllers/AuthController";

onBeforeMount(async () => {
  if (localStorage.getItem("token")) {
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

html {
  width: 100vw;
  overflow-x: hidden;
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
  //background-color: rgb(240, 235, 248);
  background-color: $light-content-color;
  //color: #2c3e50;
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

<template lang="pug">
v-header
router-view
</template>


<script lang="ts">
import { defineComponent } from "vue";
import vHeader from "./components/v-header.vue";

export default defineComponent({
  components: { vHeader }

});
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
</style>

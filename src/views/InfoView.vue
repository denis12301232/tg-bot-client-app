<template lang="pug">
v-human-info
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import vHumanInfo from "@/components/v-human-info.vue"


export default defineComponent({
   name: 'HomeView',
   components: {
      vHumanInfo 
   },
});
</script>

<style lang="scss" scoped>
</style>
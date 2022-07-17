<template lang="pug">
v-humans-list
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import vHumansList from "@/components/v-humans-list.vue"

export default defineComponent({
   name: 'HomeView',
   components: {
      vHumansList
   },
});
</script>

<style lang="scss" scoped>
</style>
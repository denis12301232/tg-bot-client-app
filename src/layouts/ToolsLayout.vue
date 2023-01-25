<template lang="pug">
q-layout(:class="store.currentTheme === 'dark' ? 'dark' : 'light'" view="hHh lpR fFf")
   q-header(class="header" reveal elevated height-hint="98")
      q-toolbar
         q-btn(dense flat round icon="arrow_back" @click="$router.push('/')")
         q-toolbar-title {{ title }}
      slot(name="tabs")
   q-page-container
      slot
</template>

<script setup lang="ts">
import { useStore } from '@/stores'


defineProps<{
   title: string;
}>();

const store = useStore();
</script>

<style lang="scss" scoped>
.light {
   & .header {
      background-color: white;
      color: black;
   }
}

.dark {
   & .header {
      background-color: #121212;
   }
}
</style>
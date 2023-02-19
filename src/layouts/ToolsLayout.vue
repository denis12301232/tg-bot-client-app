<template lang="pug">
QLayout(:class="store.currentTheme === 'dark' ? 'dark' : 'light'" view="hHh lpR fFf")
   QHeader(class="header" reveal elevated height-hint="98")
      QToolbar
         QBtn(dense flat round icon="arrow_back" @click="$router.push('/')")
         QToolbarTitle {{ title }}
      slot(name="tabs")
   QPageContainer
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
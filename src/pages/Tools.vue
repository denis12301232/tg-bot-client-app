<template lang="pug">
ToolsLayout(title="Настройки")
   template(#tabs)
      q-tabs(align="left")
         q-route-tab(to="/tools/google" label="Интегрция с Google")
         q-route-tab(to="/tools/sheets" label="Выгрузить заявки")
         q-route-tab(to="/tools/roles" label="Настроить роли")
   div(class="container")
      RouterView
</template>

<script setup lang="ts">
import ToolsLayout from '@/layouts/ToolsLayout.vue'
</script>

<style scoped lang="scss">
.container {
   padding: 0 20px 20px 20px;
   width: 50%;
}

@media (max-width:1024px) {
   .container {
      width: 60%;
   }
}

@media (max-width:768px) {
   .container {
      width: 70%;
   }
}

@media (max-width:480px) {
   .container {
      width: 100%;
   }
}
</style>
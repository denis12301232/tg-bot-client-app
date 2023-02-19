<template lang="pug">
ToolsLayout(title="Настройки")
   template(#tabs)
      QTabs(align="left")
         QRouteTab(to="/tools/google" label="Интегрция с Google" active-class="active")
         QRouteTab(to="/tools/sheets" label="Выгрузить заявки" active-class="active")
         QRouteTab(to="/tools/roles" label="Настроить роли" active-class="active")
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
   margin: 0 auto;
}

.active {
   color: $secondary;
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

@media (max-width:560px) {
   .container {
      width: 100%;
      padding: 0 10px 20px 10px;
   }
}
</style>
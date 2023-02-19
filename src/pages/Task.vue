<template lang="pug">
ToolsLayout(title="Задачи")
   template(#tabs)
      QTabs(align="left")
         QRouteTab(v-if="store.isAdmin" to="/task/create" label="Создать задачу" :active-class="$style.active")
         QRouteTab(to="/task/list" label="Список задач" :active-class="$style.active")
   div(:class="$style.container")
      RouterView
</template>

<script setup lang="ts">
import ToolsLayout from '@/layouts/ToolsLayout.vue'
import { useStore } from '@/stores'


const store = useStore();
</script>

<style lang="scss" module>
.field {
   margin-top: 10px;
}

.tag {
   max-width: 90px;
}

.active {
   color: $secondary;
}
</style>
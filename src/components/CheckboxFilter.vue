<template lang="pug">
div(class="filter_container")
   div(class="filter_title") Критерии выгрузки
   div(class="filter_content")
      div(class="filter_item", v-for="filter in filters", :key="filter.name")
         header(class="item_title") {{filter.name}}
         VCheckbox(v-model="filterValue", :value="filter.value")
</template> 
   
<script setup lang="ts">
import { ref, watch } from 'vue';

defineProps({
   filters: {
      type: Array as () => Array<{ name: string, value: string }>,
      default: [],
   },
});
const emit = defineEmits(['filtered']);
const filterValue = ref<string[]>([]);

watch(filterValue, (current) => {
   emit('filtered', current);
}, { deep: true, immediate: true });
</script>
   
<style scoped lang="scss">
.filter_container {
   width: 250px;

   &>.filter_title {
      color: var(--water-color);
      font-weight: 600;
      margin-bottom: 5px;
   }

   &>.filter_content {
      border: 2px solid #738095;
      box-shadow: inset 0 0 2px 0 rgb(207 215 230 / 40%);
      border-radius: 5px;
      padding: 5px;

      &>.filter_item {
         padding: 3px 0;
         display: flex;

         &>.item_title {
            flex-basis: 100px;
         }
      }
   }


}
</style>
<template lang="pug">
select(
   @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)", 
   :value="modelValue",
   class="select"
   )
   option(value="", disabled) {{ title }}
   option(v-for="option in options", :key="option.value", :value="option.value") {{ option.name }}
</template>


<script setup lang="ts">
defineProps({
   modelValue: {
      type: String,
   },
   options: {
      type: Array as () => Array<{ value: string, name: string }>,
      default: () => [],
   },
   title: {
      type: String,
      default: 'Сортировать',
   }
});
</script>

<style lang="scss" scoped>
.select {
   padding: 5px;
   border-radius: 4px;
   cursor: pointer;
   outline: none;
   background-color: inherit;

   &:focus {
      border-color: $main-color;
      outline: 1px solid $main-color  !important;
   }
}
</style>
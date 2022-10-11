<template lang="pug">
select(
   @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)", 
   :value="modelValue",
   :class="['select', {'select_dark': dark, 'select_light': light}]"
   )
   option(value="", disabled) {{ title }}
   option(v-for="option in options", :key="option.value", :value="option.value") {{ option.name }}
</template>


<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'

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

const { light, dark } = useTheme();
</script>

<style lang="scss" scoped>
.select {
   padding: 5px;
   border-radius: 4px;
   cursor: pointer;
   outline: none;
   background-color: inherit;
   color: inherit;

   &:focus {
      border-color: rgb(38, 43, 150);
      outline: 1px solid #2c3e50 !important;
   }
}

.select_light {
   & option {
      background-color: var(--background-color-light);
   }
}

.select_dark {
   & option {
      background-color: var(--background-color-dark);
   }
}
</style>
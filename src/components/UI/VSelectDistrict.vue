<template lang="pug">
select(:class="[$style.select, dark ? $style.select_dark : $style.select_light]", @change="setSelectValue", :value="modelValue")
   option(:class="$style.select_label", disabled, selected) Район
   option(:class="$style.select_variants" v-for="district in districts") {{ district }}
</template>
   
<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'
import Constants from '@/libs/Constants'
defineProps({
   modelValue: {
      type: String,
   },
});
const emit = defineEmits(['update:modelValue']);
const { dark } = useTheme();
const districts = Constants.districts;
const setSelectValue = (event: Event): void => {
   const target = event.target as HTMLSelectElement;
   emit('update:modelValue', target.value);
};
</script>
   
   
<style lang="scss" module>
.select {
   display: block;
   border: none;
   font-family: sans-serif;
   letter-spacing: 1px;
   font-size: 1em;
   width: 100%;
   height: 1.7em;
   border-bottom: 1px solid #e0e0e0;
   cursor: pointer;
   background-color: transparent;
   -webkit-tap-highlight-color: transparent;
   color: inherit;

   & .select_label {
      color: #9e9e9e;
   }

   &:focus {
      border: none;
      border-bottom: 1px solid #1a73a8;
      outline: none;
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
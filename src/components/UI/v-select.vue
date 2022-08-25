<template lang="pug">
select(:class="$style.select", @change="setSelectValue", :value="modelValue")
   option(:class="$style.select_label", disabled, selected) Район
   option(:class="$style.select_variants" v-for="district in districts") {{ district }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Constants from '@/libs/Constants';

export default defineComponent({
   name: 'v-select',
   props: {
      modelValue: {
         type: String,
      },
   },
   setup(props, { emit }) {
      const districts = Constants.districts;

      const setSelectValue = (event: Event): void => {
         const target = event.target as HTMLSelectElement;
         emit('update:modelValue', target.value);
      };

      return { districts, setSelectValue }
   }
});
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

   & .select_label {
      color: #9e9e9e;
   }

   & .select_variants {
      color: black;
   }

   &:focus {
      border: none;
      border-bottom: 1px solid #1a73a8;
      outline: none;
   }
}
</style>
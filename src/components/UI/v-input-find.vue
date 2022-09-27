<template lang="pug">
input(
   :class="$style.find_human", 
   :value="modelValue", 
   @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
   )
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
   name: "v-input-find",
   props: {
      modelValue: {
         type: [String, Number],
         default: '',
      }
   },
});
</script>

<style lang="scss" module>
.find_human {
   height: 45px;
   border-radius: 10px;
   border: 2px solid #cfd7e6;
   box-shadow: inset 0 1px 2px 0 rgb(207 215 230 / 40%);
   padding: 10px 5px;
   font-size: 1em;
   outline: none;
   letter-spacing: 1px;
   transition: all .1s ease;
   -webkit-appearance: none;
   -moz-appearance: none;
   appearance: none;
   outline: 0;

   &:focus {
      border: 2px solid var(--water-color);
   }
}
</style>
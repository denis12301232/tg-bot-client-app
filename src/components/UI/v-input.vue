<template lang="pug">
input(
   class="input"
   :value="modelValue", 
   @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
)
</template>
   
<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
   name: "v-input",
   props: {
      modelValue: {
         type: [String, Number],
         default: '',
      }
   },
});
</script>
   
<style lang="scss" scoped>
.input {
   -webkit-appearance: none;
   -moz-appearance: none;
   outline: 0;
   border-radius: 4px;
   padding: 5px 10px;
   font-size: inherit;
   background: #fff;
   border: 2px solid #cfd7e6;
   box-shadow: inset 0 1px 2px 0 rgb(207 215 230 / 40%);
   letter-spacing: 1px;
   font-size: 1em;
   transition: all .1s ease;
   width: 100%;
   height: 42px;
   min-width: 240px;

   &:focus {
      border: 2px solid var(--water-color);
   }
}
</style>
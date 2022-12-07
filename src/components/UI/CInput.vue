<template lang="pug">
input(
   class="input"
   :value="modelValue", 
   @input="onInput"
)
</template>
   
<script setup lang="ts">

defineProps({
   modelValue: {
      type: [String, Number],
      default: '',
   }
});

const emit = defineEmits(['update:modelValue']);

function onInput(event: Event) {
   emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>
   
<style lang="scss" scoped>
.input {
   -webkit-appearance: none;
   -moz-appearance: none;
   appearance: none;
   outline: 0;
   border-radius: 4px;
   padding: 5px 10px;
   font-size: inherit;
   background: inherit;
   color: inherit;
   border: 2px solid #738095;
   box-shadow: inset 0 0 2px 0 rgb(207 215 230 / 40%);
   letter-spacing: 1px;
   font-size: 1em;
   transition: border .1s ease;
   width: 100%;
   height: 42px;
   min-width: 240px;

   &:focus {
      border: 2px solid var(--water-color);
   }
}
</style>
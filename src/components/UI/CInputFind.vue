<template lang="pug">
input(
   :class="$style.find_human", 
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

<style lang="scss" module>
.find_human {
   height: 45px;
   border-radius: 10px;
   border: 2px solid #738095;
   padding: 10px 5px;
   font-size: 1em;
   outline: none;
   letter-spacing: 1px;
   transition: all .1s ease;
   -webkit-appearance: none;
   -moz-appearance: none;
   appearance: none;
   outline: 0;
   background-color: inherit;
   color: inherit;

   &:focus {
      border: 2px solid var(--water-color);
   }
}
</style>
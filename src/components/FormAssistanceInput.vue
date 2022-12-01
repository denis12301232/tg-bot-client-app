<template lang="pug">
div(:class="$style.form_group")
   input(
      :class="$style.form_input", 
      placeholder=" ",
      :value="modelValue",
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)", 
      @blur="emit('touch')",
      :style="{paddingLeft: offset}",
      :="$attrs"
      )
   label(:class="[mask ? $style.form_phone :$style.form_label]") {{placeholder}}  
</template>
 
<script setup lang="ts">
defineProps({
   modelValue: {
      type: [String, Number]
   },
   placeholder: {
      type: String,
   },
   mask: {
      type: Boolean,
      default: false,
   },
   offset: {
      type: String,
      default: ''
   }
});

const emit = defineEmits(['update:modelValue', 'touch']);
</script>
   
   
<style lang="scss" module>
.form_group {
   position: relative;

   & .form_input {
      font-family: inherit;
      width: 100%;
      border: none;
      border-bottom: 1px solid #e0e0e0;
      background-color: transparent;
      outline: none;
      display: block;
      z-index: 1;
      position: relative;
      appearance: none;
      color: inherit;
      letter-spacing: 1px;
      font-size: 1em;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
         appearance: none;
      }

      &:focus {
         border-bottom: 1px solid #1a73a8;
      }

      &:focus+.form_label,
      &:not(:placeholder-shown)+.form_label {
         top: -18px;
         font-size: 12px;
         color: #e0e0e0;
      }
   }

   & .form_label {
      position: absolute;
      top: 1.5px;
      transition: 0.3s;
      color: #9e9e9e;
   }

   & .form_phone {
      position: absolute;
      height: 1.5rem;
      top: 0px;
   }
}
</style>
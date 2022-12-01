<template lang="pug">
label(:class="[$style.radio, dark ? $style.radio_dark: $style.radio_light]")
   input(
      :class="$style.radio_input",
      type="radio",
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :value="value",
      :name="name",
      :checked="value === modelValue"
      )
   div(:class="$style.radio_circle") 
</template>

<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'

defineProps({
   modelValue: {
      type: String,
   },
   name: {
      type: String,
   },
   value: {
      type: String
   }
});

const { dark } = useTheme();
</script>

<style lang="scss" module>
.radio {
   position: relative;
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
   width: 20px;
   height: 20px;
   border-radius: 100%;
   -webkit-tap-highlight-color: transparent;

   & .radio_input {
      --webkit-appearance: none;
      appearance: none;
      position: absolute;

      &:checked+.radio_circle {
         opacity: 1;
      }
   }

   & .radio_circle {
      width: 14px;
      height: 14px;
      background-color: rgb(50, 11, 101);
      border-radius: 100%;
      opacity: 0;
      transition: all .1s linear;
   }
}

.radio_light {
   border: 1px solid var(--background-color-dark);
}

.radio_dark {
   border: 1px solid var(--background-color-light);
}
</style>
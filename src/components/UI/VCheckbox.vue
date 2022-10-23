<template lang="pug">
label(:class="[$style.checkbox, dark ? $style.checkbox_dark: $style.checkbox_light]")
   input(
      :class="$style.checkbox_input", 
      type="checkbox", 
      @change="event => onChange(event, (event.target as HTMLInputElement).value)", 
      :value="value",
      :checked="Array.isArray(modelValue) ? modelValue!.includes(value) : modelValue === value"
      )
   span(:class="$style.checkbox_img") 
</template>

<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'

const props = defineProps({
   modelValue: {
      type: [Array, Boolean],
   },
   value: {
      type: [String, Boolean],
      default: '',
   }
});

const { dark } = useTheme();
const emit = defineEmits(['update:modelValue']);
const onChange = (event: Event, value: string | boolean) => {
   const isChecked = (event.target as HTMLInputElement).checked;
   if (Array.isArray(props.modelValue)) {
      if (props.modelValue?.includes(value)) {
         emit('update:modelValue', props.modelValue.filter(item => item !== value))
      } else {
         emit('update:modelValue', props.modelValue?.concat(value));
      }
   } else {
      value = isChecked;
      emit('update:modelValue', value);
   }
}
</script>

<style lang="scss" module>
.checkbox {
   position: relative;
   cursor: pointer;
   display: block;
   width: 20px;
   height: 20px;
   -webkit-tap-highlight-color: transparent;

   & .checkbox_input {
      --webkit-appearance: none;
      appearance: none;
      position: absolute;

      &:checked+.checkbox_img {
         background-color: rgb(50, 11, 101);
         background-image: url('@/assets/images/checkbox.png');
         background-position: center;
         background-size: 20px 20px;
      }
   }

   & .checkbox_img {
      position: absolute;
      background-size: 20px 20px;
      width: 20px;
      height: 20px;

      padding: 2px;
      transition: all .1s linear;
   }
}

.checkbox_light {
   & .checkbox_img {
      border: 1px solid var(--background-color-dark);
   }
}

.checkbox_dark {
   & .checkbox_img {
      border: 1px solid var(--background-color-light);
   }
}
</style>
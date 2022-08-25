<template lang="pug">
label(:class="$style.checkbox")
   input(
      :class="$style.checkbox_input", 
      type="checkbox", 
      @change="event => onChange(event, (event.target as HTMLInputElement).value)", 
      :value="value",
      :checked="Array.isArray(modelValue) ? modelValue!.includes(value) : modelValue === value"
      )
   span(:class="$style.checkbox_img") 
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
   name: 'v-checkbox',
   props: {
      modelValue: {
         type: [Array, Boolean],
      },
      value: {
         type: [String, Boolean],
         default: '',
      }
   },
   setup(props, { emit }) {
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
      return { onChange }
   }
});
</script>

<style lang="scss" module>
.checkbox {
   position: relative;
   cursor: pointer;
   display: block;
   width: 20px;
   height: 20px;
   -webkit-tap-highlight-color: transparent;
   .checkbox_input {
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
      border: 1px solid black;
      padding: 2px;
      transition: all .1s linear;
   }
}
</style>


<!-- <template lang="pug">
label(:class="$style.checkbox")
   input(
      :class="$style.checkbox_input", 
      type="checkbox", 
      @change="setCheckBoxValue", 
      :value="value"
      )
   span(:class="$style.checkbox_img") 
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
   name: 'v-checkbox',
   props: {
      modelValue: {
         type: [Boolean, Array],
      },
      value: {
         type: String,
         default: '',
      }
   },
   setup(props, { emit }) {
      const setCheckBoxValue = (event: Event): void => {
         const isChecked = (event.target as HTMLInputElement).checked;
         if (typeof props.modelValue === 'boolean') {
            emit('update:modelValue', isChecked);
         } else if (Array.isArray(props.modelValue)) {
            const mas = [...props.modelValue];
            if (isChecked) {
               mas.push(props.value);
            } else {
               mas.splice(mas.indexOf(props.value), 1);
            }
            emit('update:modelValue', mas);
         }
      }
      return { setCheckBoxValue }
   }
});
</script>

<style lang="scss" module>
.checkbox {
   position: relative;
   cursor: pointer;
   display: block;
   width: 20px;
   height: 20px;

   .checkbox_input {
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
      border: 1px solid black;
      padding: 2px;
      transition: all .1s linear;
   }
}
</style> -->
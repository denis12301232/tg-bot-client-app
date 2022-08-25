<template lang="pug">
label(:class="$style.radio")
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

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
   name: 'v-radio',
   props: {
      modelValue: {
         type: String,
      },
      name: {
         type: String,
      },
      value: {
         type: String
      }
   }

});
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
   border: 1px solid black;
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
</style>

<!-- <template lang="pug">
label(:class="$style.radio")
   input(
      :class="$style.radio_input",
      @change="$emit('update:modelValue', value)"
      type="radio",
      :value="value",
      :name="name",
      :checked="!value"
      )
   div(:class="$style.radio_circle") 
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
   name: 'v-radio',
   props: {
      modelValue: {
         type: Boolean,
      },
      name: {
         type: String,
      },
      value: {
         type: Boolean
      }
   }

});
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
   border: 1px solid black;
   border-radius: 100%;

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
</style> -->
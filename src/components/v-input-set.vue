<template lang="pug">
div(:class="$style.container", :hidden="hidden")
   input(
      :type="type", 
      :value="modelValue",
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      )
   div(:class="$style.buttons")
      v-button-confirm(@click="$emit('submit')")
      v-button-cancel(@click="$emit('hide')")
      v-loading-wheel(v-if="isLoading")
</template>

<script setup lang="ts">
defineProps({
   modelValue: {
      type: [String, Number],
      default: '',
   },
   type: {
      type: String,
      default: 'text',
   },
   hidden: {
      type: Boolean,
      default: false,
   },
   isLoading: {
      type: Boolean,
      default: false,
   },
   placeholder: {
      type: String,
   }
});

</script>

<style lang="scss" module>
.container {
   padding: 5px 0 0 0;
   border-radius: 4px;
   display: flex;
   align-items: center;
   width: 100%;
   font-size: 1em;


   & input {
      height: 30px;
      padding: 0 5px 0 5px;
      flex-basis: 80%;
      box-shadow: inset 1px 1px 5px 0 #eee;
      border-radius: 3px;
      border: solid #e9e6e4;
      outline: none;
      font-size: 1rem;

      &:focus {
         border: 1px solid var(--water-color);
      }
   }

   & *:not(:first-child) {
      margin-left: 5px;
   }
}
.buttons{
   display: flex;
   align-items: center;
}

[hidden] {
   display: none !important;
}
</style>
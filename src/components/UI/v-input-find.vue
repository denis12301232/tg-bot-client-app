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
   height: 30px;
   border-radius: 10px;
   border: 1px solid #ccc;
   padding: 5px;
}
</style>
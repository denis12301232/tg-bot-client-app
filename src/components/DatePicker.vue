<template lang="pug">
div(:class="[$style.container, isActive ? $style.active: '']")
   div(:class="$style['select-btn']", tabindex="0", @click.stop="onClick")
      span(class="value") {{modelValue}}
   label(:class="[$style.label, checked || modelValue  ? 'selected': '']") {{ label }}
   div(:class="$style.content")
      div(:class="$style.calendar")
         table
            tr
               th(v-for="i in 7") {{i}}
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
   modelValue: {
      type: String,
   },
   label: {
      type: String,
      required: true
   },
   items: {
      type: Array,
      default: [],
   }
});

const checked = ref(false);
const isActive = ref(false);


function onClick() {
   isActive.value = !isActive.value;
}
</script>


<style lang="scss" module>
.container {
   border: 1px solid black;
   height: 100px;
   width: 100%;
   position: relative;

   & .select-btn {
      border-bottom: 1px solid #e0e0e0;
      background-color: transparent;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      position: relative;
      z-index: 2;

      &:focus {
         border-bottom: 1px solid #1a73a8;
      }

      & .icon {
         font-size: 31px;
         transition: transform 0.3s linear;
         position: absolute;
         right: 0;
      }
   }

   & .label {
      position: absolute;
      transition: 0.3s;
      color: #9e9e9e;
      top: 15px;
      z-index: 1;
      user-select: none;
   }

   & .content {
      padding: 5px;
      display: none;
      transition: 0.3s;
      position: absolute;
      width: 100%;
      background-color: #ccc;
      z-index: 100;
   }
}

.active {
   & .content {
      display: block;
   }
}

.calendar{
   width: 100px;
   margin: 0 auto;
}
</style>
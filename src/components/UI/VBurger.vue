<template lang="pug">
div(:class="[$style.header_burger, isSelected ? $style.header_burger_selected: '']")
</template>

<script setup lang="ts">
defineProps({
   isSelected: {
      type: Boolean,
      default: false
   }
});
</script>

<style lang="scss" module>
.header_burger {
   display: block;
   position: relative;
   width: 30px;
   height: 30px;
   cursor: pointer;
   user-select: none;
   -webkit-tap-highlight-color: transparent;
   background-image: url('@/assets/images/burger.png');
   background-size: cover;

   &:hover {
      background-color: rgb(236, 236, 236);
   }
}

.header_burger_selected {
   background-color: rgb(236, 236, 236);
}
</style>
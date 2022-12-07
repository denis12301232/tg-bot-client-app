<template lang="pug">
div(:class="[$style.header_burger, dark ? $style.header_burger_dark : $style.header_burger_light, isSelected ? $style.selected: '']")
</template>

<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'

defineProps({
   isSelected: {
      type: Boolean,
      default: false
   }
});

const { dark } = useTheme();
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
}

.header_burger_light {
   &:hover {
      background-color: rgb(236, 236, 236);
   }

   &.selected {
      background-color: rgb(236, 236, 236);
   }
}

.header_burger_dark {
   filter: invert(1);
   &:hover {
      background-color: rgba(236, 236, 236, 0.704);
   }

   &.selected {
      background-color: rgba(236, 236, 236, 0.704);
   }
}
</style>
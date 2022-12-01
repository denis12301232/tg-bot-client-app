<template lang="pug">
button(:class="$style.button")
   slot
</template>

<script setup lang="ts">

</script>


<style lang="scss" module>
.button {
   margin: 0;
   box-sizing: border-box;
   font-size: 1rem;
   outline: none;
   user-select: none;
   background-image: linear-gradient(90deg, rgb(41, 47, 164) 0%, rgb(32, 37, 141) 33%, rgb(19, 24, 114) 100%);
   padding: 10px 20px;
   border: none;
   border-radius: 5px;
   color: #fff;
   outline: none;
   cursor: pointer;
   letter-spacing: 1px;
   -webkit-tap-highlight-color: transparent;

   &:hover {
      background-image: linear-gradient(90deg, rgba(41, 47, 164, 0.937) 0%, rgba(32, 37, 141, 0.888) 33%, rgba(19, 24, 114, 0.899) 100%);
   }

   &:disabled {
      background: rgba(28, 5, 141, 0.514);
   }
}
</style>
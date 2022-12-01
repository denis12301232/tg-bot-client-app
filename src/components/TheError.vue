<template lang="pug">
div(:class="$style.error")
   div(:class="$style.error_info")
      div(:class="$style.error_code") {{ code }}
      div(:class="$style.error_text") {{ message }}
      CButton(:class="$style.error_button", @click="$router.push('/')") На главную
</template>

<script setup lang="ts">
defineProps({
   code: {
      type: [String, Number],
      required: true,
   },
   message: {
      type: String,
      required: true,
   }
});
</script>

<style lang="scss" module>
.error {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;

   &>.error_info {
      text-align: center;
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;

      &>.error_code {
         font-size: 7em;
      }

      &>.error_text {
         font-size: 2em;
      }

      &>.error_button{
         margin-top: 30px;
      }
   }
}
</style>
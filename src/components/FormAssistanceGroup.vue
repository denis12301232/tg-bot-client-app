<template lang="pug">
div(:class="[$style.group, isNotValid ? $style.error : '']")
   div(:class="$style.select_title") {{title}}
   slot
   small(:class="$style.error_message", v-if="isNotValid") {{message}}
</template>
    
<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
   title: {
      type: String,
      required: true,
   },
   invalid: {
      type: [Array as () => Array<boolean>, Boolean],
      default: false
   },
   error: {
      type: [Array as () => Array<string>, String],
      default: ''
   }
});

const message = ref('');
const isNotValid = computed(() => {
   if (typeof props.invalid === 'boolean') {
      message.value = Array.isArray(props.error) ? props.error[0] : props.error || 'Ошибка валидации';
      return props.invalid ? true : false;
   } else {
      for (let i = 0; i < props.invalid.length; i++) {
         if (props.invalid[i]) {
            message.value = Array.isArray(props.error) ? props.error[i] : props.error || 'Ошибка валидации';
            return true;
         }
      }
      message.value = '';
      return false;
   }
});
</script>
       
<style lang="scss" module>
.group {
   position: relative;
   margin-top: 10px;
   border-radius: 5px;
   padding: 20px 20px;
   border: 2px solid rgba(81, 78, 78, 0.189);
}

.error {
   border: 2px solid var(--error-message-color);
}

.error_message {
   color: var(--error-message-color);
   font-weight: 550;
   position: absolute;
   bottom: 15px;
}
</style>
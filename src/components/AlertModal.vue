<template lang="pug">
div(
   :class="[$style.alert, $style[type]]", 
   v-show="isVisible", 
   @click="emit('show', false)", 
   @pointerenter="clearTimer",
   @pointerleave="debounceTimer"
   )
   div(:class="$style.alert_content")
      svg(:class="$style.img", viewBox="0 0 24 24" role="img" aria-hidden="true")
         path(v-if="type==='success'", d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z")
         path(v-if="type==='error'", d="M8.27,3L3,8.27V15.73L8.27,21H15.73C17.5,19.24 21,15.73 21,15.73V8.27L15.73,3M9.1,5H14.9L19,9.1V14.9L14.9,19H9.1L5,14.9V9.1M11,15H13V17H11V15M11,7H13V13H11V7")
      span(:class="$style.message") {{message}}
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { AlertType } from '@/interfaces/interfaces'
import Util from '@/libs/Util'

interface Props {
   isVisible: boolean,
   message: string,
   type: AlertType,
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'show', value: boolean): void }>();
const timeout = ref(0);
const debounceTimer = Util.debounceDecorator(setTimer, 1000);

function clearTimer() {
   clearTimeout(timeout.value);
}

function setTimer() {
   if (!props.isVisible) return;
   (timeout.value as any) = setTimeout(() => emit('show', false), 3000);
}

watch(() => props.isVisible, () => {
   clearTimer();
   if (props.isVisible) {
      setTimer();
   }
});
</script>
   
   
<style lang="scss" module>
.alert {
   border: thin solid shadow;
   color: white;
   min-width: 250px;
   transition: .3s cubic-bezier(.25, .8, .5, 1);
   line-height: 1.5;
   border-radius: 3px;
   padding: 10px 10px;
   max-width: 300px;
   cursor: pointer;
   z-index: 9999;

   & .alert_content {
      display: flex;
      place-items: center;

      & .img {
         min-width: 20px;
         min-height: 20px;
         width: 20px;
         height: 20px;
         filter: invert(1);
      }

      & .message {
         margin-left: 5px;
      }
   }
}

.success {
   background-color: #4caf50;
}

.error {
   background-color: rgb(176, 18, 18);
}
</style>
   
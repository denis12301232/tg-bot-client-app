<template>
  <Transition :name="$style.animate">
    <div
      v-if="show"
      :class="[$style.message, $style[type]]"
      @click="hideAlert"
      @pointerenter="clearTimer"
      @pointerleave="debounceTimer"
    >
      <QIcon :name="icon" size="20px" />
      <div :class="$style.message_content">{{ message }}</div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { IAlert } from '@/types';
import { ref, computed, watchEffect } from 'vue';
import { Util } from '@/util';
import { useVModel } from '@/hooks';

const props = defineProps<{
  modelValue: boolean;
  type: IAlert;
  message: string;
}>();
defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const timeout = ref(0);
const show = useVModel<boolean>();

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'eva-checkmark-circle-2-outline';
    case 'error':
      return 'eva-close-circle-outline';
    case 'warning':
      return 'eva-alert-triangle-outline';
    case 'info':
      return 'eva-alert-circle-outline';
    default:
      return 'check_circle';
  }
});
const debounceTimer = Util.debounceDecorator(setTimer, 1000);

watchEffect(() => {
  if (show.value) {
    clearTimer();
    show.value && setTimer();
  }
});

function hideAlert() {
  show.value = false;
}

function setTimer() {
  if (!show.value) return;
  timeout.value = setTimeout(hideAlert, 3000);
}

function clearTimer() {
  clearTimeout(timeout.value);
}
</script>

<style lang="scss" module>
.message {
  min-height: 50px;
  width: 250px;
  padding: 5px 5px !important;
  border-radius: 5px;
  display: flex;
  align-items: center;
  color: white;
  position: fixed;
  cursor: pointer;
  z-index: 10000;

  & .message_content {
    margin-left: 5px;
    font-size: 1.1rem;
    overflow-wrap: break-word;
  }
}

.success {
  background-color: $green;

  &:hover {
    background-color: $green-5;
  }
}

.error {
  background-color: $negative;

  &:hover {
    background-color: $red-9;
  }
}

.warning {
  background-color: $warning;

  &:hover {
    background-color: $yellow-7;
  }
}

.info {
  background-color: $info;

  &:hover {
    background-color: $blue-4;
  }
}

.animate {
  &:global(-enter-active) {
    transition: all 0.3s ease-in-out;
  }

  &:global(-leave-active) {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }
  &:global(-enter-from),
  &:global(-leave-to) {
    transform: translateX(30px);
    opacity: 0;
  }
}
</style>

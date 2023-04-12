<template>
  <Transition :name="$style.animate">
    <div
      v-if="visible"
      :class="[$style.message, $style[type]]"
      @click="emit('show')"
      @pointerenter="clearTimer"
      @pointerleave="debounceTimer"
    >
      <QIcon :name="icon" size="20px" />
      <div :class="$style.message_content">{{ message }}</div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { AlertType } from '@/types';
import { ref, computed, watch } from 'vue';
import { Util } from '@/util';

const props = defineProps<{
  visible: boolean;
  message: string;
  type: AlertType;
}>();
const emit = defineEmits<{
  (event: 'show'): void;
}>();

const timeout = ref(0);
const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'check_circle';
    case 'error':
      return 'error_outline';
    case 'warning':
      return 'report_problem';
    case 'info':
      return 'info';
  }
});
const debounceTimer = Util.debounceDecorator(setTimer, 1000);

function clearTimer() {
  clearTimeout(timeout.value);
}

function setTimer() {
  if (!props.visible) return;
  timeout.value = setTimeout(() => emit('show'), 3000);
}
watch(() => props.visible, () => {
  clearTimer();
  props.visible && setTimer();
});
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

<template>
  <div :class="[$style.container, 'column', 'reverse', 'z-max', 'fixed']">
    <TransitionGroup :name="$style.animate">
      <div
        v-for="alert of alerts"
        :key="alert.id"
        :class="[$style.alert, $style[alert.type], 'q-pa-sm', 'row', 'q-mt-sm', 'items-center', 'no-wrap']"
        @click="hideById(alert.id)"
      >
        <div class="q-mr-sm">
          <QIcon :name="setIcon(alert.type)" size="25px" />
        </div>
        <div class="text-body1">{{ alert.message }}</div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import type { Alert } from '@/util';

const props = defineProps<{
  modelValue: Alert[];
}>();
const emit = defineEmits<{
  'update:modelValue': [alerts: Alert[]];
}>();

const alerts = computed({
  get() {
    return props.modelValue;
  },
  set(alerts: Alert[]) {
    emit('update:modelValue', alerts);
  },
});

watch(
  () => alerts.value.length,
  (n, o) => {
    if (n > Number(o) && alerts.value.length) hideAlert();
  },
  { immediate: true }
);

function setIcon(type: Alert['type']) {
  switch (type) {
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
}

function hideAlert() {
  setTimeout(() => {
    alerts.value.splice(0, 1);
  }, 3000);
}

function hideById(id: string) {
  alerts.value = alerts.value.filter((item) => item.id !== id);
}
</script>

<style lang="scss" module>
.container {
  top: 80px;
  right: 10px;
  overflow: hidden;
}

.alert {
  width: 200px;
}

.alert {
  min-height: 50px;
  width: 250px;
  padding: 5px 5px !important;
  border-radius: 5px;
  color: white;
  cursor: pointer;

  & .alert_text {
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

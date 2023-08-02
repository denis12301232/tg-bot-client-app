<template>
  <div
    :class="[$style.alert, $style[alert.type], 'q-pa-sm', 'row', 'q-mt-sm', 'items-center', 'no-wrap']"
    @click="emit('hideById', alert.id)"
  >
    <div class="q-mr-sm">
      <QIcon :name="icon" size="25px" />
    </div>
    <div class="text-body1">{{ alert.message }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Alert } from '@/models';

defineProps<{
  alert: Alert;
  icon: string;
}>();

const emit = defineEmits<{
  hideById: [id: string];
}>();
</script>

<style lang="scss" module>
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
</style>

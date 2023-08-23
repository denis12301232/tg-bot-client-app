<template>
  <div :class="[$style.container, 'column', 'z-max', 'fixed', 'reverse']">
    <TransitionGroup :name="$style.animate">
      <NoticeItem v-for="n in noticesShow" class="q-mb-sm" :notice="n" :key="n.id" @hide="onHide" />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import NoticeItem from './NoticeItem.vue';
import { Notice } from '@/models';
import { useVModel } from '@/hooks';

interface Props {
  modelValue: Map<string, Notice>;
}

defineProps<Props>();
defineEmits<{ 'update:modelValue': [value: Map<string, Notice>] }>();
const notices = useVModel<Map<string, Notice>>();
const noticesShow = computed(() =>
  Array.from(notices.value).reduce<Notice[]>((arr, [, notice]) => (notice.show ? [...arr, notice] : arr), [])
);

function onHide(id: string) {
  const n = notices.value.get(id);
  if (n) {
    n.show = false;
  }
}
</script>

<style lang="scss" module>
.container {
  max-width: 250px;
  top: 80px;
  right: 10px;
  overflow: hidden;
  width: 100%;
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

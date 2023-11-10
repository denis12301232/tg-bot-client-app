<template>
  <QCard class="q-pa-sm shadow-1 rounded-borders cursor-pointer full-width bg-blue-grey-4 text-white" @click="onClick">
    <div class="row justify-between no-wrap">
      <div :class="[$style.title, 'text-subtitle2']">{{ notice.title }}</div>
      <div class="text-caption">{{ d(notice.createdAt, 'time') }}</div>
    </div>
    <div class="text-body2">{{ notice.text }}</div>
  </QCard>
</template>

<script setup lang="ts">
import type { Props} from '@/types';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';



const props = defineProps<Props.Notice.Item>();
const emit = defineEmits<{ hide: [id: string] }>();
const { d } = useI18n();
const timer = ref(0);

onMounted(() => {
  timer.value = setTimeout(() => emit('hide', props.notice._id), 3000);
});

function onClick() {
  clearTimeout(timer.value);
  emit('hide', props.notice._id);
}
</script>

<style lang="scss" module>
.title {
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px 0 0;
}
</style>

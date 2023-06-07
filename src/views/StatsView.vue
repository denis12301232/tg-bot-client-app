<template>
  <div class="column items-center q-pa-md">
    <QSelect
      v-model="show"
      :class="[$style.input, 'q-mb-sm']"
      :options="options"
      :label="t('stats.labels.interval')"
      standout
    />
    <StatsAssistance class="full-width" :by="show.value" :label="show.label" />
  </div>
</template>

<script setup lang="ts">
import type { I18n, Langs } from '@/types';
import StatsAssistance from '~/stats/StatsAssistance.vue';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Show {
  label: string;
  value: 'year' | 'month';
}

const { t } = useI18n<I18n, Langs>();
const show = ref<Show>({ label: t('stats.opts.interval.year'), value: 'year' });
const options = computed(() => [
  { label: t('stats.opts.interval.year'), value: 'year' },
  { label: t('stats.opts.interval.month'), value: 'month' },
]);
</script>

<style module lang="scss">
.input {
  max-width: 500px;
  width: 100%;
}
</style>

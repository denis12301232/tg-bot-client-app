<template>
  <div class="column items-center q-pa-md">
    <QSelect
      v-model="show"
      :class="[$style.input, 'q-mb-sm']"
      :options="options"
      :label="t('stats.form.fields.interval.placeholder')"
      standout
    />
    <StatsAssistance class="full-width" :by="show.value" :label="show.label" />
  </div>
</template>

<script setup lang="ts">
import StatsAssistance from '~/stats/StatsAssistance.vue';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Show {
  label: string;
  value: 'year' | 'month';
}

const { t } = useI18n();
const show = ref<Show>({ label: t('stats.form.fields.interval.options[0]'), value: 'year' });
const options = computed(() => [
  { label: t('stats.form.fields.interval.options[0]'), value: 'year' },
  { label: t('stats.form.fields.interval.options[1]'), value: 'month' },
]);
</script>

<style module lang="scss">
.input {
  max-width: 500px;
  width: 100%;
}
</style>

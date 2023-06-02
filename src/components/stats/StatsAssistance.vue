<template>
  <div class="column items-center q-pa-md">
    <QInput
      v-model="date"
      class="input"
      :label="t('stats.label')"
      mask="date"
      :loading="loading"
      standout="text-white bg-indigo"
    >
      <template #append>
        <QIcon class="cursor-pointer" name="eva-calendar">
          <QPopupProxy cover transition-show="scale" transition-hide="scale">
            <QDate v-model="date" emit-immediately default-year-month="2023/05" color="red-10">
              <div class="row items-center justify-end">
                <QBtn v-close-popup label="Закрыть" color="primary" flat />
              </div>
            </QDate>
          </QPopupProxy>
        </QIcon>
      </template>
    </QInput>
    <canvas ref="chartRef" class="chart" />
  </div>
</template>

<script setup lang="ts">
import type { I18n, Langs } from '@/types';
import { ref, onMounted, watch, computed, shallowRef } from 'vue';
import Chart from 'chart.js/auto';
import { AssistanceService } from '@/api/services';
import { useFetch } from '@/hooks';
import { useI18n } from 'vue-i18n';

type T = { [key: string]: string };
type S = typeof AssistanceService.getStats;

const props = defineProps<{
  label: string;
  by: 'month' | 'day';
}>();

const { t } = useI18n<I18n, Langs>();
const date = ref('');
const chartRef = ref<HTMLCanvasElement | null>(null);
const chart = shallowRef<Chart<any>>();
const timestamp = computed(() => {
  const data = date.value?.split('/');
  return !date.value ? Date.now() : new Date(+data.at(0)!, +data.at(1)! - 1, +data.at(2)!).getTime();
});
const { request: getStats, data: stats, loading } = useFetch<T, S>(AssistanceService.getStats);
const monthes = computed(() => [
  t('stats.monthes.0'),
  t('stats.monthes.1'),
  t('stats.monthes.2'),
  t('stats.monthes.3'),
  t('stats.monthes.4'),
  t('stats.monthes.5'),
  t('stats.monthes.6'),
  t('stats.monthes.7'),
  t('stats.monthes.8'),
  t('stats.monthes.9'),
  t('stats.monthes.10'),
  t('stats.monthes.11'),
]);
onMounted(() => {
  chartRef.value &&
    (chart.value = new Chart(chartRef.value, {
      type: 'bar',
      data: {
        labels: props.by === 'month' ? monthes.value : calculateDays(),
        datasets: [
          {
            label: props.label,
            data: Object.values(stats.value || {}),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    }));

  getStats({ by: props.by, timestamp: timestamp.value });
});
watch(timestamp, () => getStats({ by: props.by, timestamp: timestamp.value }));
watch(stats, () => {
  if (chart.value) {
    chart.value.data.datasets = [
      {
        label: props.label,
        data: Object.values(stats.value || {}),
        borderWidth: 1,
        backgroundColor: '#3f51b5',
      },
    ];
    chart.value.update();
  }
});

function calculateDays() {
  const date = new Date();
  const days = [];
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  for (let i = 1; i <= lastDay; i++) {
    days.push(`${i}`);
  }
  return days;
}
</script>

<style scoped lang="scss">
.chart {
  max-width: 500px;
  min-width: 300px;
  width: 100%;
  max-height: 500px;
  padding-top: 10px;
}
.input {
  max-width: 500px;
  width: 100%;
}
</style>

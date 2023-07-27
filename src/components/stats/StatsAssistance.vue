<template>
  <div class="column items-center">
    <QInput v-model="date" class="input" :label="t('stats.labels.period')" mask="date" :loading="loading" standout>
      <template #append>
        <QIcon class="cursor-pointer" name="eva-calendar">
          <QPopupProxy cover transition-show="scale" transition-hide="scale">
            <QDate
              v-model="date"
              emit-immediately
              default-year-month="2023/05"
              color="primary"
              :locale="messages[locale].calendar"
            >
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
import { ref, onMounted, watch, computed, shallowRef } from 'vue';
import Chart from 'chart.js/auto';
import { AssistanceService } from '@/api/services';
import { useFetch, useI18nT } from '@/hooks';

const props = defineProps<{
  label: string;
  by: 'month' | 'year';
}>();

const { t, messages, locale } = useI18nT();
const date = ref('');
const chartRef = ref<HTMLCanvasElement | null>(null);
const chart = shallowRef<Chart>();
const timestamp = computed(() => {
  const data = date.value?.split('/');
  return !date.value ? Date.now() : new Date(+data.at(0)!, +data.at(1)! - 1, +data.at(2)!).getTime();
});
const monthes = computed(() => Object.values(messages.value[locale.value].calendar.monthsShort));
const {
  request: getStats,
  data: stats,
  loading,
} = useFetch<object, typeof AssistanceService.getStats>(AssistanceService.getStats);

onMounted(() => {
  chartRef.value &&
    (chart.value = new Chart(chartRef.value, {
      type: 'line',
      data: {
        labels: props.by === 'month' ? calculateDays() : monthes.value,
        datasets: [
          {
            label: props.label,
            data: Object.values(stats.value || {}),
            borderColor: '#3f51b5',
            backgroundColor: '#3f51b5',
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    }));

  getStats({ by: props.by, timestamp: timestamp.value });
});
watch([timestamp, () => props.by], () => getStats({ by: props.by, timestamp: timestamp.value }));
watch(stats, () => {
  if (chart.value) {
    (chart.value.data.labels = props.by === 'month' ? calculateDays() : monthes.value),
      (chart.value.data.datasets = [
        {
          label: props.label,
          data: Object.values(stats.value || {}),
          borderColor: '#3f51b5',
          backgroundColor: '#3f51b5',
        },
      ]);
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
  max-width: 650px;
  min-width: 300px;
  width: 100%;
  max-height: 450px;
  padding-top: 10px;
}
.input {
  max-width: 500px;
  width: 100%;
}
</style>

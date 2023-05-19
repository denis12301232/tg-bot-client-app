<template>
  <div class="column items-center q-pa-md">
    <QInput v-model="date" class="input" label="Период" mask="date" :loading="loading" standout="text-white bg-indigo">
      <template #append>
        <QIcon class="cursor-pointer" name="event">
          <QPopupProxy cover transition-show="scale" transition-hide="scale">
            <QDate v-model="date" emit-immediately default-year-month="2023/05">
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
import { Constants } from '@/util';
import { AssistanceService } from '@/api/services';
import { useFetch } from '@/hooks';

const props = defineProps<{
  label: string;
  by: 'month' | 'day';
}>();

const date = ref('');
const chartRef = ref<HTMLCanvasElement | null>(null);
const chart = shallowRef<Chart<any>>();
const timestamp = computed(() => {
  const data = date.value?.split('/');
  return !date.value ? Date.now() : new Date(+data.at(0)!, +data.at(1)!, +data.at(2)!).getTime();
});
const { f: onGetStats, data: stats, loading } = useFetch<{ [key: string]: string }>({ fn: getStats });

onMounted(() => {
  chartRef.value &&
    (chart.value = new Chart(chartRef.value, {
      type: 'bar',
      data: {
        labels: props.by === 'month' ? Constants.monthsShort : calculateDays(),
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
  onGetStats();
});
watch(timestamp, async () => onGetStats());
watch(stats, () => {
  if (chart.value) {
    chart.value.data.datasets = [
      {
        label: props.label,
        data: Object.values(stats.value || {}),
        borderWidth: 1,
      },
    ];
    chart.value.update();
  }
});

function getStats() {
  return AssistanceService.getStats({ by: props.by, timestamp: timestamp.value });
}

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

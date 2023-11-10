<template>
  <div class="column items-center">
    <QInput
      v-model="date"
      class="input"
      :label="t('stats.form.fields.period.placeholder')"
      mask="date"
      :loading="loading"
      standout
    >
      <template #append>
        <QIcon class="cursor-pointer" name="eva-calendar">
          <QPopupProxy cover transition-show="scale" transition-hide="scale">
            <QDate v-model="date" emit-immediately color="primary" :locale="messages[locale].extra.calendar">
              <div class="row items-center justify-end">
                <QBtn v-close-popup :label="t('extra.calendar.close')" color="primary" flat />
              </div>
            </QDate>
          </QPopupProxy>
        </QIcon>
      </template>
    </QInput>
    <div :class="['actions', 'q-pt-lg', 'q-pb-md', 'flex', 'justify-between']">
      <QFab direction="down" color="primary" padding="10px" icon="eva-arrow-ios-downward-outline">
        <QFabAction icon="eva-activity-outline" color="indigo" :disable="type === 'line'" @click="changeType('line')" />
        <QFabAction icon="eva-bar-chart-outline" color="indigo" :disable="type === 'bar'" @click="changeType('bar')" />
        <QFabAction icon="eva-pie-chart-outline" color="indigo" :disable="type === 'pie'" @click="changeType('pie')" />
        <QFabAction
          icon="eva-radio-button-off-outline"
          color="indigo"
          :disable="type === 'doughnut'"
          @click="changeType('doughnut')"
        />
      </QFab>
      <div>
        <QBtn icon="eva-download" color="primary" @click="createPdf">PDF</QBtn>
      </div>
    </div>
    <canvas ref="canvas" class="chart" />
  </div>
</template>

<script setup lang="ts">
import type { Props } from '@/types';
import { ref, onMounted, watch, computed, shallowRef, watchEffect } from 'vue';
import { Chart, registerables, type ChartConfiguration, type ChartType, type ChartDataset } from 'chart.js';
import { AssistanceService } from '@/api/services';
import { useQuery } from '@/hooks';
import { useI18n } from 'vue-i18n';

const props = defineProps<Props.Stats.Assistance>();
const { t, messages, locale } = useI18n();
const now = new Date();
const chart = shallowRef<Chart | null>(null);
const type = ref<ChartType>('line');
const date = ref(now.toISOString().replace('-', '/').split('T')[0].replace('-', '/'));
const canvas = ref<HTMLCanvasElement | null>(null);
const timestamp = computed(() => (!date.value ? Date.now() : new Date(date.value).getTime()));
const monthes = computed(() => Object.values(messages.value[locale.value].extra.calendar.monthsShort));
const { query: getStats, data: stats, loading } = useQuery(AssistanceService.getStats);
const config: ChartConfiguration = {
  type: 'line',
  data: { datasets: [{} as ChartDataset] },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  },
};
const colors = [
  '#3f51b5',
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#9e9e9e',
  '#607d8b',
];

onMounted(() => {
  Chart.register(...registerables);
  chart.value = new Chart(canvas.value!, config);
  getStats({ by: props.by, timestamp: timestamp.value });
});

watchEffect(() => {
  config.type = type.value;
  if (type.value === 'line') {
    config.data.datasets[0].borderColor = '#3f51b5';
    config.data.datasets[0].backgroundColor = '#3f51b5';
  } else {
    config.data.datasets[0].backgroundColor = colors;
    config.data.datasets[0].borderColor = 'transparent';
  }

  chart.value?.update();
});
watch([timestamp, () => props.by], () => getStats({ by: props.by, timestamp: timestamp.value }));
watch(stats, () => {
  config.data = {
    labels: props.by === 'month' ? calculateDays() : monthes.value,
    datasets: [{ ...config.data.datasets[0], label: props.label, data: Object.values(stats.value || {}) }],
  };

  chart.value?.update();
});

function calculateDays() {
  const days = [];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  for (let i = 1; i <= lastDay; i++) {
    days.push(`${i}`);
  }
  return days;
}

function changeType(value: ChartType) {
  type.value = value;
}

async function createPdf() {
  const formData = new FormData();
  canvas.value?.toBlob(sendBlob, 'image/png', 1);

  async function sendBlob(blob: Blob | null) {
    if (!blob) {
      return;
    }
    formData.append('image', blob);
    const pdf = await AssistanceService.getStatsPdf(formData);
    const file = new File([pdf], 'chart.pdf', { type: pdf.type });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    a.remove();
  }
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

.actions {
  max-width: 650px;
  min-width: 300px;
  width: 100%;
}
.input {
  max-width: 500px;
  width: 100%;
}
</style>

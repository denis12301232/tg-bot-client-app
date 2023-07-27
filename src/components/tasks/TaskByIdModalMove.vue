<template>
  <QCard :class="$style.table">
    <QTable
      v-model:pagination="pagination"
      v-model:selected="selected"
      :class="$style.table"
      :loading="loading || isMoving"
      :columns="columns"
      :rows="tasks"
      :pagination-label="(f, l, a) => `${f}-${l} ${t('table.of')} ${a}`"
      :loading-label="t('table.loading')"
      :no-data-label="t('table.noData')"
      :rows-per-page-label="t('table.show')"
      :no-results-label="t('table.notFound')"
      :selected-rows-label="(n) => `${t('table.selected')} ${n}`"
      selection="single"
      row-key="_id"
      title="Задачи"
      separator="cell"
      @request="request"
    >
      <template #header="scope">
        <QTr>
          <QTh
            ><QBtn
              :disable="!selected.length"
              round
              dense
              flat
              icon="eva-diagonal-arrow-right-up-outline"
              color="teal"
              @click="moveSubtask(subtaskId, taskId, selected.at(0)?._id || '')"
            >
              <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">Переместить</QTooltip>
            </QBtn>
          </QTh>
          <QTh v-for="col in scope.cols" :key="col.label" :style="col.headerStyle">{{ col.label }}</QTh>
        </QTr>
      </template>
      <template #body="scope: { row: ITask, selected: boolean, expand: boolean }">
        <QTr :key="scope.row._id">
          <QTd>
            <QCheckbox v-model="scope.selected" :disable="scope.row._id === taskId" />
          </QTd>
          <QTd>{{ scope.row.title }}</QTd>
          <QTd auto-width>
            <QBtn
              color="indigo"
              round
              dense
              flat
              :icon="scope.expand ? 'eva-minus-circle-outline' : 'eva-plus-circle-outline'"
              @click="scope.expand = !scope.expand"
            />
          </QTd>
          <QTd>
            <div class="row justify-center">
              <QBadge :label="scope.row.status" :color="Util.setStatusColor(scope.row.status)" />
            </div>
          </QTd>
        </QTr>
        <QTr v-show="scope.expand">
          <QTd colspan="100%">
            <QChip
              v-for="(tag, index) in scope.row.tags"
              :key="index"
              :label="tag"
              style="max-width: 90px"
              clickable
              color="indigo"
              text-color="white"
              size="md"
            >
              <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ tag }}</QTooltip>
            </QChip>
          </QTd>
        </QTr>
      </template>
    </QTable>
  </QCard>
</template>

<script setup lang="ts">
import type { QTable } from 'quasar';
import type { ITask } from '@/types';
import { ref, onMounted } from 'vue';
import { useRequest, useFetch, useI18nT } from '@/hooks';
import { TaskService } from '@/api/services';
import { Util } from '@/util';

const props = defineProps<{
  taskId: string;
  subtaskId: string;
}>();
const emit = defineEmits<{
  move: [id: string];
}>();

const { t } = useI18nT();
const selected = ref<ITask[]>([]);
const {
  request,
  pagination,
  loading,
  data: tasks,
} = useRequest<ITask>(TaskService.getTasks, {
  limit: 5,
  sort: 'createdAt',
});
const { request: moveSubtask, loading: isMoving } = useFetch(TaskService.moveSubtask, {
  afterResponse: () => emit('move', props.subtaskId),
});
const columns: QTable['columns'] = [
  { name: 'title', required: true, label: 'Название', align: 'center', field: 'title' },
  { name: 'tags', label: 'Теги', align: 'center', field: 'tags' },
  { name: 'status', label: 'Статус', align: 'center', field: 'status' },
];

onMounted(() => request({ pagination: pagination.value }));
</script>

<style lang="scss" module>
.table {
  width: 100%;
  max-width: 600px;
}
</style>

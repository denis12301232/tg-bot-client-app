<template>
  <QCard :class="$style.table">
    <QTable
      v-model:pagination="pagination"
      v-model:selected="selected"
      :class="$style.table"
      :loading="loading || isMoving"
      :columns="columns"
      :rows="tasks || []"
      :pagination-label="(f, l, a) => `${f}-${l} ${t('extra.table.of')} ${a}`"
      :loading-label="t('extra.table.loading')"
      :no-data-label="t('extra.table.noData')"
      :rows-per-page-label="t('extra.table.show')"
      :no-results-label="t('extra.table.notFound')"
      :selected-rows-label="(n) => `${t('extra.table.selected')} ${n}`"
      selection="single"
      row-key="_id"
      :title="t('taskId.subtasks.move.title')"
      separator="cell"
      @request="request"
    >
      <template #header="scope">
        <QTr>
          <QTh>
            <QBtn
              :disable="!selected.length"
              round
              dense
              flat
              icon="eva-diagonal-arrow-right-up-outline"
              color="teal"
              @click="moveSubtask(subtaskId, taskId, selected.at(0)?._id || '')"
            >
              <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('taskId.hints.move') }}</QTooltip>
            </QBtn>
          </QTh>
          <QTh v-for="col in scope.cols" :key="col.label" :style="col.headerStyle">{{ col.label }}</QTh>
        </QTr>
      </template>
      <template #body="scope: { row: ITask, selected: boolean, expand: boolean }">
        <QTr :key="scope.row._id">
          <QTd auto-width>
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
              <QBadge :label="t(`tasks.statuses.${scope.row.status}`)" :color="Util.setStatusColor(scope.row.status)" />
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
import { useRequest, useQuery } from '@/hooks';
import { TaskService } from '@/api/services';
import { Util } from '@/util';
import { useI18n } from 'vue-i18n';

interface Props {
  taskId: string;
  subtaskId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ move: [id: string] }>();
const { t } = useI18n();
const selected = ref<ITask[]>([]);
const {
  request,
  pagination,
  loading,
  data: tasks,
} = useRequest<ITask[]>(TaskService.getTasks, {
  limit: 5,
  sort: 'createdAt',
});
const { query: moveSubtask, loading: isMoving } = useQuery(TaskService.moveSubtask, { onSuccess });
const columns: QTable['columns'] = [
  { name: 'title', required: true, label: t('taskId.task.card.title'), align: 'center', field: 'title' },
  { name: 'tags', label: t('taskId.task.card.tags'), align: 'center', field: 'tags' },
  { name: 'status', label: t('taskId.task.card.status'), align: 'center', field: 'status' },
];

onMounted(() => request({ pagination: pagination.value }));

function onSuccess() {
  emit('move', props.subtaskId);
}
</script>

<style lang="scss" module>
.table {
  width: 100%;
  max-width: 600px;
}
</style>

<template>
  <div :class="$style.container">
    <h4 class="text-center q-mt-lg q-mb-lg">Задачи</h4>
    <QTable
      v-model:pagination="pagination"
      :class="$style.table"
      :columns="columns"
      :rows="tasks"
      :filter="filter"
      :loading="loading || isStatusLoading"
      :rows-per-page-options="[5, 10, 20]"
      :pagination-label="(f, t, a) => `${f}-${t} из ${a}`"
      no-data-label="Задач нет"
      loading-label="Загрузка..."
      rows-per-page-label="Отображать на странице:"
      separator="cell"
      row-key="_id"
      binary-state-sort
      @request="onRequest"
    >
      <template #top>
        <QSelect
          v-model="filter"
          class="full-width"
          borderless
          dense
          label="Отображать"
          :options="options"
          emit-value
          map-options
        />
      </template>
      <template #body="scope: { row: ITask, expand: boolean }">
        <QTr :key="scope.row._id">
          <QTd>
            <div :class="$style.title">{{ scope.row.title }}</div>
          </QTd>
          <QTd auto-width>
            <QBtn
              size="sm"
              color="accent"
              round
              dense
              @click="scope.expand = !scope.expand"
              :icon="scope.expand ? 'remove' : 'add'"
            />
          </QTd>
          <QTd>
            <div class="row justify-center">
              <QBadge :label="scope.row.status" :color="setStatusColor(scope.row.status)" />
            </div>
          </QTd>
          <QTd class="text-center">{{ new Date(scope.row.createdAt).toLocaleDateString() }}</QTd>
          <QTd>
            <div class="row justify-center">
              <QBtnGroup flat>
                <QBtn
                  v-if="scope.row.user && scope.row.status === 'В работе'"
                  round
                  dense
                  flat
                  icon="done"
                  color="positive"
                  @click="onUpdateTaskStatus(scope.row._id, 'Выполнена')"
                />
                <QBtn
                  v-if="!scope.row.user"
                  round
                  dense
                  flat
                  icon="add"
                  color="warning"
                  @click="setUserForTask(scope.row._id)"
                />
                <QBtn
                  v-if="scope.row.status !== 'Выполнена' && scope.row.status !== 'Отменена' && store.isAdmin"
                  round
                  dense
                  flat
                  icon="close"
                  color="negative"
                  @click="onUpdateTaskStatus(scope.row._id, 'Отменена')"
                />
                <QBtn
                  round
                  dense
                  flat
                  icon="open_in_new"
                  color="primary"
                  @click="$router.push(`/task/id/${scope.row._id}`)"
                />
              </QBtnGroup>
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
              color="amber-8"
              text-color="white"
              size="md"
            >
              <QTooltip :delay="1000">{{ tag }}</QTooltip>
            </QChip>
          </QTd>
        </QTr>
      </template>
    </QTable>
  </div>
</template>

<script setup lang="ts">
import type { QTable } from 'quasar';
import type { ITask, TaskStatus } from '@/types/interfaces';
import { onMounted } from 'vue';
import { useStore } from '@/stores';
import { useFetch, useRequest } from '@/hooks';
import { TaskService } from '@/api/services';

onMounted(() => onRequest({ pagination: pagination.value }));

const store = useStore();
const { pagination, data: tasks, loading, filter, onRequest } = useRequest<ITask>({
  f: TaskService.getTasks,
  sort: 'createdAt',
});
const { f: onUpdateTaskStatus, loading: isStatusLoading } = useFetch({
  fn: updateStatus,
});
const columns: QTable['columns'] = [
  {
    name: 'title',
    label: 'Название',
    align: 'center',
    field: 'title',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  { name: 'tags', label: 'Теги', align: 'center', field: 'tags', headerStyle: 'font-size: 1.1em;' },
  {
    name: 'status',
    label: 'Статус',
    align: 'center',
    field: 'status',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: 'Дата создания',
    align: 'center',
    field: 'createdAt',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  { name: '_id', label: 'Действия', align: 'center', field: '_id', headerStyle: 'font-size: 1.1em;' },
];
const options = [
  { label: 'Все', value: 'all' },
  { label: 'Только мои', value: 'my' },
];

async function updateStatus(task_id: string, status: TaskStatus) {
  await TaskService.updateTaskStatus(task_id, status);
  const task = tasks.value?.find((task) => task._id === task_id);
  if (task) task.status = status;
}

async function setUserForTask(task_id: string) {
  await TaskService.setUserForTask(task_id);
  const task = tasks.value?.find((task) => task._id === task_id);
  if (task) {
    task.status = 'В работе';
    ((task.user as unknown) as string) = store.user._id;
  }
}

function setStatusColor(status: TaskStatus) {
  switch (status) {
    case 'Не выбрана':
      return 'warning';
    case 'В работе':
      return 'primary';
    case 'Отменена':
      return 'negative';
    case 'Выполнена':
      return 'positive';
    default:
      return 'positive';
  }
}
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
}

.table {
  max-width: 100%;

  & .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100px;
  }

  & .description {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 170px;
  }
}
</style>

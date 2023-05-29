<template>
  <div class="column items-center q-pa-sm">
    <h4 class="text-center q-mt-lg q-mb-lg">Задачи</h4>
    <QTable
      v-model:pagination="pagination"
      :class="$style.table"
      :columns="columns"
      :rows="tasks"
      :filter="filter"
      :loading="loading || isTaskStatusLoading || isSetUserLoading"
      :rows-per-page-options="[5, 10, 20]"
      :pagination-label="(f, t, a) => `${f}-${t} из ${a}`"
      no-data-label="Задач нет"
      loading-label="Загрузка..."
      rows-per-page-label="Отображать на странице:"
      separator="cell"
      row-key="_id"
      binary-state-sort
      @request="request"
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
            <div>{{ scope.row.title }}</div>
          </QTd>
          <QTd auto-width>
            <QBtn
              color="indigo"
              round
              dense
              flat
              @click="scope.expand = !scope.expand"
              :icon="scope.expand ? 'eva-minus-circle-outline' : 'eva-plus-circle-outline'"
            >
              <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">
                {{ scope.expand ? 'Скрыть' : 'Показать' }}
              </QTooltip>
            </QBtn>
          </QTd>
          <QTd>
            <div class="row justify-center">
              <QBadge :label="scope.row.status" :color="Util.setStatusColor(scope.row.status)" />
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
                  icon="eva-checkmark-outline"
                  color="positive"
                  @click="onUpdateTaskStatus(scope.row._id, 'Выполнена')"
                >
                  <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">Отметить, как выполненую</QTooltip>
                </QBtn>
                <QBtn
                  v-if="!scope.row.user"
                  round
                  dense
                  flat
                  icon="eva-plus-outline"
                  color="warning"
                  @click="[setUserForTask(scope.row._id)]"
                >
                  <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">Взять задачу</QTooltip>
                </QBtn>
                <QBtn
                  v-if="scope.row.status !== 'Выполнена' && scope.row.status !== 'Отменена' && store.isAdmin"
                  round
                  dense
                  flat
                  icon="eva-close"
                  color="negative"
                  @click="onUpdateTaskStatus(scope.row._id, 'Отменена')"
                >
                  <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">Оменить задачу</QTooltip>
                </QBtn>
                <QBtn
                  round
                  dense
                  flat
                  icon="eva-book-open-outline"
                  color="primary"
                  @click="$router.push(`/task/${scope.row._id}`)"
                >
                  <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">Подробнее о задаче</QTooltip>
                </QBtn>
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
  </div>
</template>

<script setup lang="ts">
import type { QTable } from 'quasar';
import type { ITask } from '@/types';
import { onMounted } from 'vue';
import { useStore } from '@/stores';
import { useFetch, useRequest } from '@/hooks';
import { TaskService } from '@/api/services';
import { Util } from '@/util';

type T = { message: string; taskId: string };
type S = typeof TaskService.setUserForTask;

const store = useStore();
const { request: updateTaskStatus, loading: isTaskStatusLoading } = useFetch(TaskService.updateTaskStatus);
const { request: setUserForTask, loading: isSetUserLoading } = useFetch<T, S>(TaskService.setUserForTask, {
  afterResponse: ({ data }) => {
    const task = tasks.value?.find((task) => task._id === data.value.taskId);
    if (task) {
      task.status = 'В работе';
      ((task.user as unknown) as any) = store.user?._id;
    }
  },
});
const { request, data: tasks, pagination, filter, loading } = useRequest<ITask>(TaskService.getTasks, {
  sort: 'createdAt',
  limit: 5,
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

onMounted(() => request({ pagination: pagination.value }));

async function onUpdateTaskStatus(taskId: string, status: ITask['status']) {
  await updateTaskStatus(taskId, status);
  const task = tasks.value?.find((task) => task._id === taskId);
  task && (task.status = status);
}
</script>

<style lang="scss" module>
.table {
  max-width: 600px;
  width: 100%;
}
</style>

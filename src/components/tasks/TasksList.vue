<template>
  <div class="column items-center q-pa-sm">
    <h4 class="text-center q-mt-lg q-mb-lg">{{ t('tasks.list.title') }}</h4>
    <QTable
      v-model:pagination="pagination"
      :class="$style.table"
      :columns="columns"
      :rows="tasks"
      :filter="filter"
      :loading="loading || isUpdating"
      :rows-per-page-options="[5, 10, 20]"
      :pagination-label="(f, l, a) => `${f}-${l} ${t('extra.table.of')} ${a}`"
      :loading-label="t('extra.table.loading')"
      :no-data-label="t('extra.table.noData')"
      :rows-per-page-label="t('extra.table.show')"
      :no-results-label="t('extra.table.notFound')"
      :selected-rows-label="(n) => `${t('extra.table.selected')} ${n}`"
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
          :label="t('tasks.list.table.filter.placeholder')"
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
              <QBadge :label="t(`tasks.statuses.${scope.row.status}`)" :color="Util.setStatusColor(scope.row.status)" />
            </div>
          </QTd>
          <QTd class="text-center">{{ d(scope.row.createdAt, 'YYYYMMDD') }}</QTd>
          <QTd>
            <div class="row justify-center">
              <QBtnGroup flat>
                <QBtn
                  v-if="scope.row.user && scope.row.status === 'performed'"
                  round
                  dense
                  flat
                  icon="eva-checkmark-outline"
                  color="positive"
                  @click="onUpdateTaskStatus(scope.row._id, 'completed')"
                >
                  <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">
                    {{ t('tasks.list.hints.complete') }}
                  </QTooltip>
                </QBtn>
                <QBtn
                  v-if="!scope.row.user"
                  round
                  dense
                  flat
                  icon="eva-plus-outline"
                  color="warning"
                  @click="onUpdateTaskUser(scope.row._id, user?._id || '')"
                >
                  <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">
                    {{ t('tasks.list.hints.take') }}
                  </QTooltip>
                </QBtn>
                <QBtn
                  v-if="scope.row.status !== 'completed' && scope.row.status !== 'canceled' && isAdmin"
                  round
                  dense
                  flat
                  icon="eva-close"
                  color="negative"
                  @click="onUpdateTaskStatus(scope.row._id, 'canceled')"
                >
                  <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">
                    {{ t('tasks.list.hints.cancel') }}
                  </QTooltip>
                </QBtn>
                <QBtn
                  round
                  dense
                  flat
                  icon="eva-book-open-outline"
                  color="primary"
                  @click="$router.push({ name: 'tasks-id', params: { id: scope.row._id } })"
                >
                  <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">
                    {{ t('tasks.list.hints.about') }}
                  </QTooltip>
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
import { computed, onMounted } from 'vue';
import { useStore } from '@/stores';
import { useFetch, useRequest } from '@/hooks';
import { TaskService } from '@/api/services';
import { Util } from '@/util';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

const { t, d } = useI18n();
const { user, isAdmin } = storeToRefs(useStore());
const { request: update, loading: isUpdating } = useFetch(TaskService.update);
const {
  request,
  data: tasks,
  pagination,
  filter,
  loading,
} = useRequest<ITask>(TaskService.getTasks, {
  sort: 'createdAt',
  limit: 5,
});
const columns = computed<QTable['columns']>(() => [
  {
    name: 'title',
    label: t('tasks.list.table.columns.title'),
    align: 'center',
    field: 'title',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'tags',
    label: t('tasks.list.table.columns.tags'),
    align: 'center',
    field: 'tags',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'status',
    label: t('tasks.list.table.columns.status'),
    align: 'center',
    field: 'status',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: t('tasks.list.table.columns.date'),
    align: 'center',
    field: 'createdAt',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: '_id',
    label: t('tasks.list.table.columns.actions'),
    align: 'center',
    field: '_id',
    headerStyle: 'font-size: 1.1em;',
  },
]);
const options = computed(() => [
  { label: t('tasks.list.table.filter.options[0]'), value: 'all' },
  { label: t('tasks.list.table.filter.options[1]'), value: 'my' },
]);

onMounted(() => request({ pagination: pagination.value }));

async function onUpdateTaskStatus(taskId: string, status: ITask['status']) {
  await update(taskId, { status });
  const task = tasks.value?.find((task) => task._id === taskId);
  task && (task.status = status);
}

async function onUpdateTaskUser(taskId: string, userId: string) {
  await update(taskId, { userId, status: 'performed' });
  const task = tasks.value?.find((task) => task._id === taskId);
  if (task) {
    task.status = 'performed';
    (task.user as unknown as any) = user.value?._id;
  }
}
</script>

<style lang="scss" module>
.table {
  max-width: 700px;
  width: 100%;
  max-height: calc(100vh - 210px);
}
</style>

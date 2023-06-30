<template>
  <div class="column items-center">
    <QDialog v-model="modal">
      <Tasks.TaskByIdModalMove :task-id="taskId" :subtask-id="selected.at(0)?._id || ''" @move="onMove" />
    </QDialog>
    <QTable
      v-model:selected="selected"
      :class="[$style.table, 'q-mt-lg']"
      :rows="subtasks"
      :columns="columns"
      :rows-per-page-options="[5, 10]"
      :loading="isUpdating || isDeleting"
      row-key="_id"
      separator="cell"
      :pagination-label="(f, l, a) => `${f}-${l} ${t('table.of')} ${a}`"
      :loading-label="t('table.loading')"
      :no-data-label="t('table.noData')"
      :rows-per-page-label="t('table.show')"
      :no-results-label="t('table.notFound')"
      :selected-rows-label="(n) => `${t('table.selected')} ${n}`"
      title="Список"
      selection="single"
    >
      <template #top-right>
        <QBtn
          v-if="subtasks.length"
          :loading="isCsvCreating"
          color="teal"
          icon-right="eva-download-outline"
          label="CSV"
          no-caps
          @click="createTaskCsv(taskId)"
        />
      </template>
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
              @click="openModal"
            >
              <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">
                {{ t('tasks.byId.subtasks.hints.move') }}
              </QTooltip>
            </QBtn>
            <QBtn
              :disable="!selected.length"
              round
              dense
              flat
              icon="eva-trash"
              color="negative"
              @click="onDeleteSubtask"
            >
              <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{
                t('tasks.byId.subtasks.hints.delete')
              }}</QTooltip>
            </QBtn>
          </QTh>
          <QTh v-for="col in scope.cols" :key="col.label" :style="col.headerStyle">{{ col.label }}</QTh>
        </QTr>
      </template>
      <template #body="scope: { row: ISubtask, selected: boolean }">
        <QTr :key="scope.row._id">
          <QTd auto-width>
            <div class="row justify-center"><QCheckbox v-model="scope.selected" /></div>
          </QTd>
          <QTd :class="$style.cut_text">{{ scope.row.title }}</QTd>
          <QTd :class="$style.cut_text">{{ scope.row.description }}</QTd>
          <QTd class="text-center cursor-pointer">
            <QPopupEdit
              v-model="scope.row.status"
              #="data"
              :title="t('tasks.byId.subtasks.table.edit.status')"
              @save="(v) => updateSubtask({ subtask_id: scope.row._id, status: v })"
            >
              <QSelect
                v-model="data.value"
                :options="options"
                :color="Util.setStatusColor(data.value)"
                standout
                emit-value
                @keyup.enter="data.value.set"
              >
                <template #selected>
                  <div :class="`text-${Util.setStatusColor(data.value)}`">{{ t(`tasks.statuses.${data.value}`) }}</div>
                </template>
              </QSelect>
              <div class="row justify-between q-my-sm">
                <QBtn round dense flat icon="eva-checkmark-outline" color="positive" @click="data.set" />
                <QBtn round dense flat icon="eva-close-outline" color="negative" @click="data.cancel" />
              </div>
            </QPopupEdit>
            <QBadge :label="t(`tasks.statuses.${scope.row.status}`)" :color="Util.setStatusColor(scope.row.status)" />
          </QTd>
          <QTd :class="$style.cut_text">
            {{ scope.row.cause }}
            <QPopupEdit
              v-model="scope.row.cause"
              #="data"
              :title="t('tasks.byId.subtasks.table.edit.cause')"
              @save="(v) => updateSubtask({ subtask_id: scope.row._id, cause: v })"
            >
              <QInput
                v-model="data.value"
                dense
                counter
                autofocus
                standout
                autogrow
                type="textarea"
                maxlength="200"
                @keyup.enter="data.set"
              />
              <div class="row justify-between q-mt-sm q-mb-sm">
                <QBtn round dense flat icon="eva-checkmark-outline" color="positive" @click="data.set" />
                <QBtn round dense flat icon="eva-close-outline" color="negative" @click="data.cancel" />
              </div>
            </QPopupEdit>
          </QTd>
        </QTr>
      </template>
    </QTable>
    <a v-if="csvUrl" :class="$style.link" :href="(csvUrl as string)">Скачать файл</a>
  </div>
</template>

<script setup lang="ts">
import Tasks from '~/tasks';
import type { QTable } from 'quasar';
import type { ISubtask, I18n, Langs } from '@/types';
import { ref, computed } from 'vue';
import { useFetch, useVModel } from '@/hooks';
import { TaskService } from '@/api/services';
import { Util } from '@/util';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  taskId: string;
  subtasks: ISubtask[];
}>();
defineEmits<{
  'update:subtasks': [value: ISubtask[]];
}>();

const { t } = useI18n<I18n, Langs>();
const modal = ref(false);
const selected = ref<ISubtask[]>([]);
// eslint-disable-next-line vue/no-dupe-keys
const subtasks = useVModel<ISubtask[]>('subtasks');
const { request: updateSubtask, loading: isUpdating } = useFetch(TaskService.updateSubtask);
const {
  request: createTaskCsv,
  loading: isCsvCreating,
  data: csvUrl,
} = useFetch(TaskService.createTaskCsv, {
  afterResponse: async ({ response }) => {
    const blob = await response.blob();
    const file = new File([blob], 'subtasks', { type: 'text/csv' });
    csvUrl.value = URL.createObjectURL(file);
  },
  type: 'blob',
});
const { request: deleteSubtask, loading: isDeleting } = useFetch(TaskService.deleteSubtask);
const columns = computed<QTable['columns']>(() => [
  {
    name: 'title',
    label: t('tasks.byId.subtasks.table.columns.title'),
    align: 'center',
    field: 'title',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'description',
    label: t('tasks.byId.subtasks.table.columns.description'),
    align: 'center',
    field: 'description',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'status',
    label: t('tasks.byId.subtasks.table.columns.status'),
    align: 'center',
    field: 'status',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'cause',
    label: t('tasks.byId.subtasks.table.columns.cause'),
    align: 'center',
    field: 'cause',
    headerStyle: 'font-size: 1.1em;',
  },
]);
const options = computed(() => [
  { label: t('tasks.statuses.untaken'), value: 'untaken' },
  { label: t('tasks.statuses.performed'), value: 'performed' },
  { label: t('tasks.statuses.canceled'), value: 'canceled' },
  { label: t('tasks.statuses.completed'), value: 'completed' },
]);

async function onDeleteSubtask() {
  const subtaskId = selected.value.at(0)?._id || '';
  await deleteSubtask(subtaskId, props.taskId);
  subtasks.value = subtasks.value.filter((subtask) => subtask._id !== subtaskId);
  selected.value = [];
}

function openModal() {
  modal.value = true;
}

function onMove(subtaskId: string) {
  subtasks.value = subtasks.value.filter((subtask) => subtask._id !== subtaskId);
  modal.value = false;
}
</script>

<style lang="scss" module>
.table {
  width: 100%;
  max-width: 600px;
}

.link {
  display: inline-block;
  color: $positive;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1em;
  margin-top: 10px;

  &:hover {
    color: $orange;
  }
}
</style>

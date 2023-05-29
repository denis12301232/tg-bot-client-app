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
      loading-label="Загрузка..."
      no-data-label="Список пуст"
      rows-per-page-label="Отображать:"
      no-results-label="Ничего не найдено"
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
              <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">Переместить</QTooltip>
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
              <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">Удалить</QTooltip>
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
              title="Изменить статус"
              @save="(v) => updateSubtask({ subtask_id: scope.row._id, status: v })"
            >
              <QSelect
                v-model="data.value"
                :options="['Не выбрана', 'В работе', 'Выполнена', 'Отменена']"
                :color="Util.setStatusColor(data.value)"
                standout
                @keyup.enter="data.value.set"
              >
                <template #selected>
                  <div :class="`text-${Util.setStatusColor(data.value)}`">{{ data.value }}</div>
                </template>
              </QSelect>
              <div class="row justify-between q-my-sm">
                <QBtn round dense flat icon="eva-checkmark-outline" color="positive" @click="data.set" />
                <QBtn round dense flat icon="eva-close-outline" color="negative" @click="data.cancel" />
              </div>
            </QPopupEdit>
            <QBadge :label="scope.row.status" :color="Util.setStatusColor(scope.row.status)" />
          </QTd>
          <QTd :class="$style.cut_text">
            {{ scope.row.cause }}
            <QPopupEdit
              v-model="scope.row.cause"
              #="data"
              title="Укажите причину"
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
import type { ISubtask } from '@/types';
import { ref, computed } from 'vue';
import { useFetch } from '@/hooks';
import { TaskService } from '@/api/services';
import { Util } from '@/util';

const props = defineProps<{
  taskId: string;
  subtasks: ISubtask[];
}>();
const emit = defineEmits<{
  'update:subtasks': [value: ISubtask[]];
}>();

const modal = ref(false);
const selected = ref<ISubtask[]>([]);
// eslint-disable-next-line vue/no-dupe-keys
const subtasks = computed({
  get() {
    return props.subtasks;
  },
  set(value: ISubtask[]) {
    emit('update:subtasks', value);
  },
});
const { request: updateSubtask, loading: isUpdating } = useFetch(TaskService.updateSubtask);
const { request: createTaskCsv, loading: isCsvCreating, data: csvUrl } = useFetch(TaskService.createTaskCsv, {
  afterResponse: async ({ response }) => {
    const blob = await response.blob();
    const file = new File([blob], 'subtasks', { type: 'text/csv' });
    csvUrl.value = URL.createObjectURL(file);
  },
  type: 'blob',
});
const { request: deleteSubtask, loading: isDeleting } = useFetch(TaskService.deleteSubtask);

const columns: QTable['columns'] = [
  { name: 'title', label: 'Название', align: 'center', field: 'title', headerStyle: 'font-size: 1.1em;' },
  { name: 'description', label: 'Описание', align: 'center', field: 'description', headerStyle: 'font-size: 1.1em;' },
  { name: 'status', label: 'Статус', align: 'center', field: 'status', headerStyle: 'font-size: 1.1em;' },
  { name: 'cause', label: 'Причина', align: 'center', field: 'cause', headerStyle: 'font-size: 1.1em;' },
];

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

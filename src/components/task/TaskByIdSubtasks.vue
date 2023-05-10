<template>
  <QDialog v-model="modal">
    <component :is="modalComponent?.component" :="modalComponent?.props" />
  </QDialog>
  <h4 class="q-mb-lg text-center">Подзадачи</h4>
  <QTable
    :rows="subtasks"
    :columns="columns"
    :rows-per-page-options="[5, 10]"
    :loading="isUpdateSubtaskLoading"
    row-key="_id"
    separator="cell"
    loading-label="Загрузка..."
    no-data-label="Список пуст"
    rows-per-page-label="Отображать:"
    no-results-label="Ничего не найдено"
    title="Список"
  >
    <template #top-right>
      <QBtn
        v-if="subtasks.length"
        :loading="isCsvLoading"
        color="teal"
        icon-right="archive"
        label="CSV"
        no-caps
        @click="onCreateCsv"
      />
    </template>
    <template #body="{ row }: { row: ISubtask }">
      <QTr :key="row._id">
        <QTd :class="$style.cut_text">{{ row.title }}</QTd>
        <QTd :class="$style.cut_text">{{ row.description }}</QTd>
        <QTd class="text-center cursor-pointer">
          <QPopupEdit
            v-model="row.status"
            #="scope"
            title="Изменить статус"
            @save="(v) => onUpdateSubtask({ subtask_id: row._id, status: v })"
          >
            <QSelect
              v-model="scope.value"
              :options="['Не выбрана', 'В работе', 'Выполнена', 'Отменена']"
              :color="setStatusColor(scope.value)"
              filled
              @keyup.enter="scope.set"
            >
              <template #selected>
                <div :class="`text-${setStatusColor(scope.value)}`">{{ scope.value }}</div>
              </template>
            </QSelect>
            <div class="row justify-between q-my-sm">
              <QBtn round dense flat icon="check_circle" color="positive" @click="scope.set" />
              <QBtn round dense flat icon="cancel" color="negative" @click="scope.cancel" />
            </div>
          </QPopupEdit>
          <QBadge :label="row.status" :color="setStatusColor(row.status)" />
        </QTd>
        <QTd :class="$style.cut_text">
          {{ row.cause }}
          <QPopupEdit
            v-model="row.cause"
            #="scope"
            title="Укажите причину"
            @save="(v) => onUpdateSubtask({ subtask_id: row._id, cause: v })"
          >
            <QInput
              v-model="scope.value"
              dense
              counter
              autofocus
              outlined
              type="textarea"
              maxlength="200"
              @keyup.enter="scope.set"
            />
            <div class="row justify-between q-mt-sm q-mb-sm">
              <QBtn round dense flat icon="check_circle" color="positive" @click="scope.set" />
              <QBtn round dense flat icon="cancel" color="negative" @click="scope.cancel" />
            </div>
          </QPopupEdit>
        </QTd>
        <QTd auto-width>
          <QBtnGroup flat>
            <QBtn round dense flat icon="trending_flat" color="teal" @click="onOpenModal(row._id, 'move')" />
            <QBtn round dense flat icon="delete" color="negative" @click="onOpenModal(row._id, 'delete')" />
          </QBtnGroup>
        </QTd>
      </QTr>
    </template>
  </QTable>
  <a v-if="csvUrl" :class="$style.link" :href="csvUrl">Скачать файл</a>
</template>

<script setup lang="ts">
import type { QTable } from 'quasar';
import type { ISubtask } from '@/types';
import Task from '~/task';
import {  ref, watch, shallowRef } from 'vue';
import { useFetch } from '@/hooks';
import { TaskService } from '@/api/services';

interface ModalComponent {
  component: typeof Task.ModalDelete | typeof Task.ModalMove;
  props: { [name: string]: any };
}

const props = defineProps<{
  task_id: string;
  subtasks: ISubtask[];
  setStatusColor: (status: string) => string;
}>();

const modal = ref(false);
const modalName = ref<'delete' | 'move'>('delete');
const subtaskId = ref<string | null>(null);
const modalComponent = shallowRef<ModalComponent | null>(null);

watch(modalName, (n) => {
  switch (n) {
    case 'delete':
      return (modalComponent.value = {
        component: Task.ModalDelete,
        props: { subtask_id: subtaskId.value },
      });
    case 'move':
      return (modalComponent.value = {
        component: Task.ModalMove,
        props: { subtask_id: subtaskId.value, setStatusColor: props.setStatusColor },
      });
  }
}, { immediate: true });

const { f: onUpdateSubtask, loading: isUpdateSubtaskLoading } = useFetch({
  fn: TaskService.updateSubtask,
});
const { f: onCreateCsv, loading: isCsvLoading, data: csvUrl } = useFetch<string>({
  fn: createTaskCsv,
  successMsg: 'Файл готов',
  alert: true,
});

const columns: QTable['columns'] = [
  { name: 'title', label: 'Название', align: 'center', field: 'title', headerStyle: 'font-size: 1.1em;' },
  { name: 'description', label: 'Описание', align: 'center', field: 'description', headerStyle: 'font-size: 1.1em;' },
  { name: 'status', label: 'Статус', align: 'center', field: 'status', headerStyle: 'font-size: 1.1em;' },
  { name: 'cause', label: 'Причина', align: 'center', field: 'cause', headerStyle: 'font-size: 1.1em;' },
  { name: 'actions', label: 'Действия', align: 'center', field: '_id', headerStyle: 'font-size: 1.1em;' },
];

function onOpenModal(subtask_id: string, name: 'delete' | 'move') {
  subtaskId.value = subtask_id;
  modalName.value = name;
  modal.value = true;
}

async function createTaskCsv() {
  csvUrl.value = '';
  const response = await TaskService.createTaskCsv(props.task_id);
  const file = new File([response.data], 'subtasks', { type: 'text/csv' });
  return URL.createObjectURL(file);
}
</script>

<style module lang="scss">
.cut_text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
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

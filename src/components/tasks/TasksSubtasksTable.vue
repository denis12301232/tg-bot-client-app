<template>
  <QTable
    v-model:pagination="pagination"
    v-model:selected="select"
    style="max-height: 250px"
    flat
    bordered
    title="Подзадачи"
    :rows="subtasksWithId"
    :columns="columns"
    row-key="id"
    virtual-scroll
    :rows-per-page-options="[0]"
    selection="multiple"
    separator="cell"
  >
    <template #header-selection>
      <QBtn dense round flat icon="eva-trash" color="negative" @click="removeSubtask">
        <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">Удалить</QTooltip>
      </QBtn>
    </template>
    <template #body="scope: { row: Subtask, rowIndex: number, selected: boolean }">
      <QTr :key="scope.rowIndex">
        <QTd>
          <QCheckbox v-model="scope.selected" />
        </QTd>
        <QTd>{{ scope.row.title }}</QTd>
        <QTd>{{ scope.row.description }}</QTd>
      </QTr>
    </template>
  </QTable>
</template>

<script setup lang="ts">
import type { QTable } from 'quasar';
import { ref, computed } from 'vue';

type Subtask = { title: string; description: string };

const props = defineProps<{
  subtasks: Subtask[];
}>();
const emit = defineEmits<{
  'update:subtasks': [value: Subtask[]];
}>();

const select = ref<(Subtask & { id: number })[]>([]);
const pagination = ref({ rowsPerPage: 0 });
// eslint-disable-next-line vue/no-dupe-keys
const subtasks = computed({
  get() {
    return props.subtasks;
  },
  set(value) {
    emit('update:subtasks', value);
  },
});
const subtasksWithId = computed(() => props.subtasks.map((item, index) => Object.assign({ id: index }, item)));

const columns: QTable['columns'] = [
  { name: 'title', label: 'Название', align: 'center', field: 'title', headerStyle: 'font-size: 1.1em;' },
  { name: 'description', label: 'Описание', align: 'center', field: 'description', headerStyle: 'font-size: 1.1em;' },
];

function removeSubtask() {
  subtasks.value = subtasksWithId.value.filter((item) => {
    const selected = select.value.find((elem) => elem.id === item.id);
    return item.id !== selected?.id;
  });
  select.value = [];
}
</script>

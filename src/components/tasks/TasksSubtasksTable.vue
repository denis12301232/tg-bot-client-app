<template>
  <QTable
    v-model:pagination="pagination"
    v-model:selected="select"
    style="max-height: 250px"
    flat
    bordered
    :title="t('tasks.create.second.table.title')"
    :rows="subtasksWithId"
    :columns="columns"
    row-key="id"
    virtual-scroll
    :rows-per-page-options="[0]"
    :pagination-label="(f, l, a) => `${f}-${l} ${t('table.of')} ${a}`"
    :loading-label="t('table.loading')"
    :no-data-label="t('table.noData')"
    :rows-per-page-label="t('table.show')"
    :no-results-label="t('table.notFound')"
    :selected-rows-label="(n) => `${t('table.selected')} ${n}`"
    selection="multiple"
    separator="cell"
  >
    <template #header-selection>
      <QBtn dense round flat icon="eva-trash" color="negative" @click="removeSubtask">
        <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">
          {{ t('tasks.byId.subtasks.hints.delete') }}
        </QTooltip>
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
import type { I18n, Langs } from '@/types';
import type { QTable } from 'quasar';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVModel } from '@/hooks';

type Subtask = { title: string; description: string };

defineProps<{
  subtasks: Subtask[];
}>();
defineEmits<{
  'update:subtasks': [value: Subtask[]];
}>();

const { t } = useI18n<I18n, Langs>({ useScope: 'global' });
const select = ref<(Subtask & { id: number })[]>([]);
const pagination = ref({ rowsPerPage: 0 });
// eslint-disable-next-line vue/no-dupe-keys
const subtasks = useVModel<Subtask[]>('subtasks');
const subtasksWithId = computed(() => subtasks.value.map((item, index) => Object.assign({ id: index }, item)));
const columns = computed<QTable['columns']>(() => [
  {
    name: 'title',
    label: t('tasks.create.second.table.columns.title'),
    align: 'center',
    field: 'title',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'description',
    label: t('tasks.create.second.table.columns.description'),
    align: 'center',
    field: 'description',
    headerStyle: 'font-size: 1.1em;',
  },
]);

function removeSubtask() {
  subtasks.value = subtasksWithId.value.filter((item) => {
    const selected = select.value.find((elem) => elem.id === item.id);
    return item.id !== selected?.id;
  });
  select.value = [];
}
</script>

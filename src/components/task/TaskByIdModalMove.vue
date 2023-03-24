<template>
  <QCard>
    <QCardSection>
      <h5 class="text-center">Выберите, куда переместить подзадачу</h5>
    </QCardSection>
    <QCardSection>
      <QTable
        v-model:selected="selected"
        v-model:pagination="pagination"
        :rows="tasks"
        :columns="columns"
        :loading="loading || isMoveLoading"
        :rows-per-page-options="[5, 10]"
        title="Задачи"
        row-key="_id"
        selection="single"
        separator="cell"
        @request="onRequest"
      >
        <template #body="scope: { row: ITask, selected: boolean, expand: boolean }">
          <QTr :key="scope.row._id">
            <QTd>
              <QCheckbox v-model="scope.selected" :disable="scope.row._id === task?._id" />
            </QTd>
            <QTd>{{ scope.row.title }}</QTd>
            <QTd auto-width>
              <QBtn
                size="sm"
                color="accent"
                round
                dense
                :icon="scope.expand ? 'remove' : 'add'"
                @click="scope.expand = !scope.expand"
              />
            </QTd>
            <QTd>
              <div class="row justify-center">
                <QBadge :label="scope.row.status" :color="setStatusColor(scope.row.status)" />
              </div>
            </QTd>
          </QTr>
          <QTr v-show="scope.expand">
            <QTd colspan="100%">
              <QChip v-for="(tag, index) in scope.row.tags" :key="index" :label="tag" style="max-width: 90px" clickable>
                <QTooltip :delay="1000">{{ tag }}</QTooltip>
              </QChip>
            </QTd>
          </QTr>
        </template>
      </QTable>
    </QCardSection>
    <QCardActions>
      <QBtn v-close-popup color="primary" :disable="!selectedTaskId" @click="onMoveSubtask">Переместить</QBtn>
    </QCardActions>
  </QCard>
</template>

<script setup lang="ts">
import type { QTable } from 'quasar';
import type { ITask } from '@/types';
import { type Ref, inject, ref, onMounted, computed } from 'vue';
import { useRequest, useFetch } from '@/hooks';
import { TaskService } from '@/api/services';


const props = defineProps<{
   subtask_id: string;
   setStatusColor: (status: string) => string;
}>();
const task = inject<Ref<ITask>>('task');
const selected = ref<ITask[]>([]);
const selectedTaskId = computed(() => selected.value?.at(0)?._id || null);
const { pagination, loading, onRequest, data: tasks } = useRequest<ITask>({
  f: TaskService.getTasks,
  limit: 5,
  sort: 'createdAt'
});
const { f: onMoveSubtask, loading: isMoveLoading } = useFetch({
  fn: moveSubtask
})
const columns: QTable['columns'] = [
   { name: 'title', required: true, label: 'Название', align: 'center', field: 'title' },
   { name: 'tags', label: 'Теги', align: 'center', field: 'tags'},
   { name: 'status', label: 'Статус', align: 'center', field: 'status' },
];

onMounted(() => onRequest({ pagination: pagination.value }));

async function moveSubtask() {
   if(task?.value && selectedTaskId.value) {
      await TaskService.moveSubtask(props.subtask_id, task.value._id, selectedTaskId.value)
      task.value.subtasks = task.value.subtasks.filter((subtask) => subtask._id !== props.subtask_id);
   }
}
</script>

<template>
  <QSplitter
    v-model="splitterModel"
    :limits="[10, Infinity]"
    :before-class="$style.splitter_before"
    :after-class="$style.splitter_after"
  >
    <template #before>
      <QTabs v-model="tab" vertical active-color="indigo">
        <QTab name="task" icon="task" label="Задача" />
        <QTab name="subtasks" icon="view_list" label="Подзадачи" />
      </QTabs>
    </template>
    <template #after>
      <QTabPanels
        v-model="tab"
        animated
        swipeable
        vertical
        infinite
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <QTabPanel name="task" :class="$style.tab_panel">
          <TaskByIdTask :task="task || ({} as ITask)" :loading="loading" :set-status-color="setStatusColor" />
        </QTabPanel>
        <QTabPanel name="subtasks" :class="$style.tab_panel">
          <TaskByIdSubtasks
            v-if="task"
            :subtasks="task.subtasks"
            :set-status-color="setStatusColor"
            :task_id="task._id"
          />
        </QTabPanel>
      </QTabPanels>
    </template>
  </QSplitter>
</template>

<script setup lang="ts">
import type { ITask } from '@/types';
import { TaskByIdTask, TaskByIdSubtasks } from '~/task';
import { ref, onMounted, provide } from 'vue';
import { useRoute } from 'vue-router';
import { useFetch } from '@/hooks';
import { TaskService } from '@/api/services';

const route = useRoute();
const splitterModel = ref(10);
const tab = ref('task');
const { f: onGetTask, data: task, loading } = useFetch<ITask>({
  fn: () => TaskService.getTaskById(route.params.id.toString()),
});

provide('task', task);
onMounted(onGetTask);

function setStatusColor(status?: string) {
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
.splitter_before {
  min-width: 100px;
}
.splitter_after {
  min-width: 200px;
}

.tab_panel {
  margin: 0 auto;
  width: 70% !important;
  height: calc(100vh - 98px) !important;
}

@media (max-width: 1024px) {
  .tab_panel {
    width: 80% !important;
  }
}

@media (max-width: 768px) {
  .tab_panel {
    width: 90% !important;
  }
}

@media (max-width: 480px) {
  .tab_panel {
    width: 100% !important;
    padding: 16px 5px;
  }

  .splitter_before {
    display: none;
  }
}
</style>

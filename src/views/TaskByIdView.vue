<template>
  <QSplitter
    v-model="splitterModel"
    disable
    class="absolute-top-left fit"
    unit="px"
    :limits="[10, Infinity]"
    :horizontal="width < 500"
  >
    <QResizeObserver @resize="onResize" />
    <template v-slot:before>
      <QTabs v-model="tab" :vertical="width > 500" active-color="primary">
        <QTab name="task" icon="eva-list" :label="t('tasks.byId.tabs.task')" />
        <QTab name="subtasks" icon="eva-list" :label="t('tasks.byId.tabs.subtasks')" />
      </QTabs>
    </template>
    <template #after>
      <QTabPanels
        v-model="tab"
        animated
        swipeable
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
        class="full-height"
      >
        <QTabPanel name="task">
          <Tasks.TaskById :task="task" />
        </QTabPanel>
        <QTabPanel name="subtasks">
          <Tasks.TaskByIdSubtasks v-if="task" v-model:subtasks="task.subtasks" :task-id="task._id" />
        </QTabPanel>
      </QTabPanels>
    </template>
  </QSplitter>
</template>

<script setup lang="ts">
import type { ITask } from '@/types';
import Tasks from '~/tasks';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFetch } from '@/hooks';
import { TaskService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const tab = ref('task');
const splitterModel = ref(150);
const width = ref(0);
const { request, data: task } = useFetch<ITask, typeof TaskService.getTaskById>(TaskService.getTaskById);

onMounted(() => request(String(route.params.id)));

function onResize(size: { height: number; width: number }) {
  width.value = size.width;
  width.value < 500 ? (splitterModel.value = 75) : (splitterModel.value = 150);
}
</script>

<style lang="scss" module>
.card {
  width: 100%;
  max-width: 500px;
}
</style>

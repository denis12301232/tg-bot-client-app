<template>
  <QTabs v-model="tab" class="text-indigo" align="left">
    <QTab name="task" :label="t('taskId.tabs.task')" />
    <QTab name="subtasks" :label="t('taskId.tabs.subtasks')" />
  </QTabs>
  <Tasks.TaskById v-if="tab === 'task' && task" :task="task" />
  <Tasks.TaskByIdSubtasks v-else-if="tab === 'subtasks' && task" v-model:subtasks="task.subtasks" :task-id="task._id" />
</template>

<script setup lang="ts">
import Tasks from '~/tasks';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@/hooks';
import { TaskService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const tab = ref<'task' | 'subtasks'>('task');
const { query: show, data: task } = useQuery(TaskService.show);

onMounted(() => show(String(route.params.id)));
</script>

<style lang="scss" module>
.card {
  width: 100%;
  max-width: 500px;
}
</style>

<template>
  <QCard :class="$style.card" flat>
    <QCardSection>
      <h5 class="text-center">Удалить?</h5>
    </QCardSection>
    <QCardActions align="between">
      <QBtn v-close-popup round dense flat color="positive" icon="done" size="15px" @click="onDeleteSubtask" />
      <QBtn v-close-popup round dense flat color="negative" icon="close" size="15px" />
    </QCardActions>
  </QCard>
</template>

<script setup lang="ts">
import type { ITask } from '@/types';
import { type Ref, inject } from 'vue';
import { TaskService } from '@/api/services';


const props = defineProps<{
   subtask_id: string;
}>();
const task = inject<Ref<ITask>>('task');

async function onDeleteSubtask(){
   if(task?.value){
      await TaskService.deleteSubtask(props.subtask_id, task.value._id);
      task.value.subtasks = task.value.subtasks.filter((subtask) => subtask._id !== props.subtask_id);
   }
}
</script>

<style lang="scss" module>
.card {
  min-width: 300px;
}
</style>

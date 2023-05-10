<template>
  <div class="column items-center q-pt-lg q-px-sm q-pb-sm">
    <QStepper v-model="step" vertical flat color="primary" animated :class="$style.stepper">
      <QStep :name="1" title="Создать задачу" icon="task_alt" :done="step > 1">
        <Task.CreateFirstStep v-model:title="task.title" v-model:tags="task.tags" @valid="setFirstStepValid" />
        <QStepperNavigation>
          <QBtn flat color="primary" label="Далее" :loading="loading" :disable="!valid.first" @click="step++" />
        </QStepperNavigation>
      </QStep>
      <QStep :name="2" title="Добавить подзадачи" caption="Как минимум одна" icon="add_task" :done="step > 2">
        <Task.CreateSecondStep
          v-model:title="subtask.title"
          v-model:description="subtask.description"
          v-model:subtasks="task.subtasks"
        />
        <QStepperNavigation>
          <QBtn
            flat
            color="primary"
            label="Создать"
            :loading="loading"
            :disable="!task.subtasks.length"
            @click="onSubmit"
          />
          <QBtn class="q-ml-sm" flat color="primary" label="Назад" @click="step--" />
        </QStepperNavigation>
      </QStep>
    </QStepper>
  </div>
</template>

<script setup lang="ts">
import Task from '~/task';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useFetch } from '@/hooks';
import { TaskService } from '@/api/services';

const router = useRouter();
const step = ref(1);
const task = reactive({
  title: '',
  tags: [] as string[],
  subtasks: [] as { title: string; description: string }[],
});
const subtask = reactive({
  title: '',
  description: '',
});
const valid = reactive({
  first: false,
  second: false,
});
const { f: onSubmit, loading } = useFetch({
  fn: () => TaskService.createTask(task.title, task.tags, task.subtasks).then(() => router.push('/task/list')),
});

function setFirstStepValid(value: boolean) {
  valid.first = value;
}
</script>

<style lang="scss" module>
.stepper {
  max-width: 500px;
  width: 100%;
}
</style>

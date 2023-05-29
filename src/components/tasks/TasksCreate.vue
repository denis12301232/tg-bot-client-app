<template>
  <div class="column items-center q-mt-md">
    <QStepper v-model="step" vertical flat color="primary" animated :class="$style.stepper">
      <QStep :name="1" title="Создать задачу" icon="task_alt" :done="step > 1">
        <Tasks.CreateFirstStep v-model:title="task.title" v-model:tags="task.tags" @valid="setFirstStepValid" />
        <QStepperNavigation>
          <QBtn flat color="primary" label="Далее" :loading="loading" :disable="!valid.first" @click="step++" />
        </QStepperNavigation>
      </QStep>
      <QStep :name="2" title="Добавить подзадачи" caption="Как минимум одна" icon="eva-list" :done="step > 2">
        <Tasks.CreateSecondStep
          v-model:title="subtask.title"
          v-model:description="subtask.description"
          v-model:subtasks="task.subtasks"
        >
          <template #subtasks>
            <Tasks.SubtasksTable v-model:subtasks="task.subtasks" />
          </template>
        </Tasks.CreateSecondStep>
        <QStepperNavigation>
          <QBtn flat color="primary" label="Создать" :disable="!task.subtasks.length" @click="request(task)" />
          <QBtn class="q-ml-sm" flat color="primary" label="Назад" @click="step--" />
        </QStepperNavigation>
      </QStep>
    </QStepper>
  </div>
</template>

<script setup lang="ts">
import Tasks from '~/tasks';
import { ref, reactive } from 'vue';
import { useFetch } from '@/hooks';
import { TaskService } from '@/api/services';
import { useRouter } from 'vue-router';

const router = useRouter();
const step = ref(1);
const valid = reactive({ first: false, second: false });
const task = reactive({
  title: '',
  tags: [] as string[],
  subtasks: [] as { title: string; description: string }[],
});
const subtask = reactive({
  title: '',
  description: '',
});
const { request, loading } = useFetch(TaskService.createTask, {
  afterResponse: () => router.push('/tasks/list'),
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

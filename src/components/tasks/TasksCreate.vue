<template>
  <div class="column items-center q-mt-lg">
    <QStepper v-model="step" vertical flat color="primary" animated :class="$style.stepper">
      <QStep :name="1" :title="t('tasks.create.first.title')" icon="task_alt" :done="step > 1">
        <Tasks.CreateFirstStep v-model:title="task.title" v-model:tags="task.tags" @valid="setFirstStepValid" />
        <QStepperNavigation>
          <QBtn
            flat
            color="primary"
            :label="t('tasks.create.first.buttons.next')"
            :loading="loading"
            :disable="!valid.first"
            @click="step++"
          />
        </QStepperNavigation>
      </QStep>
      <QStep
        :name="2"
        :title="t('tasks.create.second.title')"
        :caption="t('tasks.create.second.subtitle')"
        icon="eva-list"
        :done="step > 2"
      >
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
          <QBtn
            flat
            color="primary"
            :label="t('tasks.create.second.buttons.create')"
            :disable="!task.subtasks.length"
            @click="request(task)"
          />
          <QBtn class="q-ml-sm" flat color="primary" :label="t('tasks.create.second.buttons.back')" @click="step--" />
        </QStepperNavigation>
      </QStep>
    </QStepper>
  </div>
</template>

<script setup lang="ts">
import type { I18n, Langs } from '@/types';
import Tasks from '~/tasks';
import { ref, reactive } from 'vue';
import { useFetch } from '@/hooks';
import { TaskService } from '@/api/services';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n<I18n, Langs>();
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

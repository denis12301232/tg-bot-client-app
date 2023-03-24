<template>
  <div class="column items-center">
    <h4 class="q-mb-lg text-center">Задача</h4>
    <QCard v-if="loading" :class="['q-pa-none', $style.card]">
      <QCardSection style="height: 371px">
        <QSkeleton class="fit" />
      </QCardSection>
    </QCard>
    <QCard v-else :class="['q-pa-sm', $style.card]">
      <QCardSection class="q-pa-none">
        <h6 class="text-center text-subtitle">Название:</h6>
        <div class="text-center q-my-sm text-bold text-indigo">{{ task.title }}</div>
      </QCardSection>
      <QCardSection class="q-pa-none">
        <h6 class="text-center text-subtitle">Теги:</h6>
        <div class="row justify-center q-my-sm">
          <QChip v-for="tag in task.tags" :label="tag" clickable color="amber-8" text-color="white" size="md">
            <QTooltip :delay="1000"> {{ tag }}</QTooltip>
          </QChip>
        </div>
      </QCardSection>
      <QCardSection class="q-pa-none">
        <h6 class="text-center text-subtitle">Статус:</h6>
        <div class="row justify-center q-my-sm">
          <QBadge :label="task.status" :color="setStatusColor(task.status)" />
        </div>
      </QCardSection>
      <QCardSection class="q-pa-none">
        <h6 class="text-center text-subtitle">Дата создания:</h6>
        <div class="text-center q-my-sm">{{ new Date(task.createdAt).toLocaleDateString() }}</div>
      </QCardSection>
      <QCardSection class="q-pa-none">
        <h6 class="text-center text-subtitle">Взял задачу:</h6>
        <div class="text-center q-my-sm text-bold text-positive">
          {{ task.user && task.user.name }}
          <span v-if="!task.user" class="text-negative text-bold">Не взята</span>
        </div>
      </QCardSection>
    </QCard>
  </div>
</template>

<script setup lang="ts">
import type { ITask } from '@/types';

defineProps<{
  task: ITask;
  loading: boolean;
  setStatusColor: (status: string) => string;
}>();
</script>

<style module lang="scss">
.card {
  max-width: 500px;
  min-width: 300px;
  width: 100%;
}
</style>

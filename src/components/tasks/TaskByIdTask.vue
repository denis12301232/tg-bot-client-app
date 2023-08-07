<template>
  <div class="row justify-center">
    <QCard v-if="!task" :class="['q-pa-none', $style.card]" style="height: 387px">
      <QSkeleton class="fit" />
    </QCard>
    <QCard v-else :class="[$style.card, 'q-mt-lg']">
      <QCardSection class="q-pb-none">
        <h6 class="text-center text-subtitle">{{ t('taskId.task.card.title') }}</h6>
        <div class="text-center q-my-sm text-bold text-indigo">{{ task.title }}</div>
      </QCardSection>
      <QCardSection class="q-pa-none">
        <h6 class="text-center text-subtitle">{{ t('taskId.task.card.tags') }}</h6>
        <div class="row justify-center q-my-sm">
          <QChip
            v-for="(tag, index) in task.tags"
            :key="index"
            :label="tag"
            clickable
            color="indigo"
            text-color="white"
            size="md"
          >
            <QTooltip class="bg-indigo" :delay="1000"> {{ tag }}</QTooltip>
          </QChip>
        </div>
      </QCardSection>
      <QCardSection class="q-pa-none">
        <h6 class="text-center text-subtitle">{{ t('taskId.task.card.status') }}</h6>
        <div class="row justify-center q-my-sm">
          <QBadge :label="t(`tasks.statuses.${task.status}`)" :color="Util.setStatusColor(task.status)" />
        </div>
      </QCardSection>
      <QCardSection class="q-pa-none">
        <h6 class="text-center text-subtitle">{{ t('taskId.task.card.date') }}</h6>
        <div class="text-center q-my-sm">{{ new Date(task.createdAt || '').toLocaleDateString() }}</div>
      </QCardSection>
      <QCardSection class="q-pt-none">
        <h6 class="text-center text-subtitle">{{ t('taskId.task.card.takenBy') }}</h6>
        <div class="text-center q-my-sm text-bold text-positive">
          {{ task?.user && task.user.name }}
          <span v-if="!task.user" class="text-negative text-bold">{{ t('taskId.messages.untaken') }}</span>
        </div>
      </QCardSection>
    </QCard>
  </div>
</template>

<script setup lang="ts">
import type { ITask } from '@/types';
import { Util } from '@/util';
import { useI18n } from 'vue-i18n';

defineProps<{
  task?: ITask;
}>();

const { t } = useI18n();
</script>

<style lang="scss" module>
.card {
  width: 100%;
  max-width: 500px;
}
</style>

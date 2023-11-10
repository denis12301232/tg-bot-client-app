<template>
  <QCard class="full-height">
    <QCardSection>
      <h5 class="text-center">{{ t('meetId.info.title') }}</h5>
    </QCardSection>
    <QSeparator />
    <QCardSection class="q-pb-sm">
      <h6 class="text-indigo text-center">«{{ title }}»</h6>
    </QCardSection>
    <QCardSection class="column items-center">
      <h6>{{ t('meetId.info.labels.id') }}</h6>
      <div class="q-py-md text-caption">{{ link }}</div>
      <QBtn dense flat round icon="eva-copy" color="indigo" @click="copyText(link)">
        <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('meetId.hints.copy') }}</QTooltip>
      </QBtn>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import type { Props } from '@/types';
import { copyText } from '@/util';
import { useI18n } from 'vue-i18n';

defineProps<Props.Meet.Info>();

const { t } = useI18n();
</script>

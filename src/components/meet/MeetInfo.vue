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
      <h6>{{ t('meetId.info.id') }}</h6>
      <div class="q-py-md text-caption">{{ link }}</div>
      <QBtn dense flat round icon="eva-copy" color="indigo" @click="Util.copyTextToClipboard(link)">
        <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('meetId.hints.copy') }}</QTooltip>
      </QBtn>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import type { I18n, Langs } from '@/types';
import { Util } from '@/util';
import { useI18n } from 'vue-i18n';

defineProps<{
  link: string;
  title: string;
}>();

const { t } = useI18n<I18n, Langs>();
</script>

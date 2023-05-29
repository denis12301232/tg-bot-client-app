<template>
  <QCard class="full-height">
    <QCardSection>
      <h5 class="text-center">Информация о встречe</h5>
    </QCardSection>
    <QSeparator />
    <QCardSection class="q-pb-sm">
      <h6 class="text-indigo text-center">«{{ title }}»</h6>
    </QCardSection>
    <QCardSection class="column items-center">
      <h6>ID встречи</h6>
      <div class="q-py-md text-caption">{{ link }}</div>
      <QBtn dense flat round icon="eva-copy" color="indigo" @click="Util.copyTextToClipboard(link)">
        <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">Скопировать ссылку</QTooltip>
      </QBtn>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import { Util } from '@/util';

defineProps<{
  link: string;
  title: string;
}>();
</script>

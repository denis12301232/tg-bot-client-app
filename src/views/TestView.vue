<template>
  <QBtnGroup>
    <QBtn>RU</QBtn>
    <QBtn>UA</QBtn>
  </QBtnGroup>
  <div class="row items-center">
    <div>UA</div>
    <QToggle v-model="test" color="primary"></QToggle>
    <div>RU</div>
  </div>
  
  <q-select
    v-model="locale"
    :options="localeOptions"
    rounded
    dense
    standout
    emit-value
    map-options
    options-dense
    style="width: 70px"
  />
  <div>{{ $t('') }}</div>
</template>

<script setup lang="ts">
import type { I18n, Langs } from '@/types';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const test = ref(false);
const { t, n, locale } = useI18n({ inheritLocale: true });
const localeOptions = [
  { value: 'ru', label: 'RU' },
  { value: 'ua', label: 'UA' },
];
</script>

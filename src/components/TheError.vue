<template>
  <div class="window-height column items-center justify-center">
    <h1 class="q-py-md text-negative text-uppercase">{{ code }}</h1>
    <h3 class="q-py-md text-uppercase">{{ message }}</h3>
    <QBtn class="q-mt-lg" color="primary" :label="t('error.btn')" @click="$router.push('/')" />
  </div>
</template>

<script setup lang="ts">
import type { I18n, Langs } from '@/types';
import { useI18n } from 'vue-i18n';

defineProps<{
  code: number;
  message: string;
}>();

const { t } = useI18n<I18n, Langs>();
</script>

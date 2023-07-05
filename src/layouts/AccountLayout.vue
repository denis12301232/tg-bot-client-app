<template>
  <QLayout view="hHh lpR fFf">
    <QHeader elevated class="header" height-hint="98">
      <QToolbar>
        <QBtn icon="eva-arrow-back" color="primary" dense flat round @click="goBack" />
        <QToolbarTitle>{{ t('account.layout.title') }}</QToolbarTitle>
      </QToolbar>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import type { I18n, Langs } from '@/types';
import { useI18n } from 'vue-i18n';
import { useNavigation } from '@/hooks';

const { t } = useI18n<I18n, Langs>();
const { goBack } = useNavigation();
</script>

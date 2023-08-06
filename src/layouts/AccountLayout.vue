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
import { useNavigation } from '@/hooks';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { goBack } = useNavigation();
</script>

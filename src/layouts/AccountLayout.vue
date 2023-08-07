<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" height-hint="98" bordered>
      <QToolbar>
        <QBtn icon="eva-arrow-back" color="primary" dense flat round @click="goBack" />
      </QToolbar>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import { useNavigation } from '@/hooks';

const { goBack } = useNavigation();
</script>

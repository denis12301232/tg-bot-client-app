<template>
  <QLayout :class="store.currentTheme === 'dark' ? 'dark' : 'light'" view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="arrow_back" color="indigo" @click="goBack" />
        <QToolbarTitle>Встреча</QToolbarTitle>
      </QToolbar>
      <QTabs v-model="tab" align="left" active-color="secondary">
        <QTab name="meet" label="Встреча" />
        <QTab name="chat" label="Чат" />
      </QTabs>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';
import { useStore } from '@/stores';
import { useNavigation } from '@/hooks';

const tab = ref('meet');
const store = useStore();
const { goBack } = useNavigation();

provide('tab', tab);
</script>

<style lang="scss" scoped>
.light {
  & .header {
    background-color: white;
    color: black;
  }
}

.dark {
  & .header {
    background-color: #121212;
  }
}
</style>

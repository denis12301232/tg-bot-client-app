<template>
  <Layout>
    <template #left-bottom="scope">
      <ListSearch v-if="scope.search" v-model="scope.search" />
      <List v-else />
    </template>
    <template #right-bottom>
      <div class="row items-center justify-center fit text-h6">{{ t('chat.messages.select') + '...' }}</div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { Layout, List, ListSearch } from '@/components/chat';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

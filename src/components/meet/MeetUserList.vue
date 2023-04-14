<template>
  <QCard class="full-height">
    <QCardSection class="q-pb-none">
      <h5 class="text-center">Список участников</h5>
      <QSeparator class="q-mt-sm" />
    </QCardSection>
    <QCardSection>
      <QList>
        <QItem v-for="user of users" clickable>
          <QItemSection avatar>
            <UserAvatar :name="user?.name" :avatar="user?.avatar" />
          </QItemSection>
          <QItemSection>
            <QItemLabel> {{ user?.name }}</QItemLabel>
            <QItemLabel caption> @{{ user?.login }}</QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import type { CallInfo } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { computed } from 'vue';

const props = defineProps<{
  abonents: Map<string, CallInfo>;
}>();

const users = computed(() => Array.from(props.abonents.values()).map((a) => a.user));
</script>

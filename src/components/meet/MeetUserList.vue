<template>
  <QCard class="full-height">
    <QCardSection>
      <h5 class="text-center">Список участников</h5>
    </QCardSection>
    <QSeparator />
    <QCardSection>
      <QList>
        <QItem v-for="user of users" clickable :key="user?._id">
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
import type { IAbonent } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { computed } from 'vue';
import { useStore } from '@/stores';

const props = defineProps<{
  abonents: Map<string, IAbonent>;
}>();

const store = useStore();
const users = computed(() => [store.user, ...Array.from(props.abonents.values()).map((a) => a.info)]);
</script>

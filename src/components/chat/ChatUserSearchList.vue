<template>
  <QList>
    <h6 v-if="!users?.length" class="text-center text-negative">Ничего не найдено</h6>
    <QItem v-for="user in users" v-ripple clickable @click="">
      <QItemSection avatar>
        <UserAvatar :name="user.name" :avatar="user.avatar" />
      </QItemSection>
      <QItemSection>
        <QItemLabel>{{ user.name }}</QItemLabel>
        <QItemLabel>@{{ user.login }}</QItemLabel>
      </QItemSection>
    </QItem>
  </QList>
</template>

<script setup lang="ts">
import type { IUser } from '@/types';
import UserAvatar from '~/UserAvatar.vue';

defineProps<{
   users?: IUser[];
}>();
</script>

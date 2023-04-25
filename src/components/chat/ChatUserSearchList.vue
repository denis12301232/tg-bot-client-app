<template>
  <QList>
    <h6 v-if="!users?.length" class="text-center text-negative">Ничего не найдено</h6>
    <QItem v-for="user in users" v-ripple clickable @click="openOrCreateChat(user._id)">
      <QItemSection avatar>
        <UserAvatar :name="user.name" :avatar="user.avatar" />
      </QItemSection>
      <QItemSection>
        <QItemLabel>{{ user.name }}</QItemLabel>
        <QItemLabel caption>@{{ user.login }}</QItemLabel>
      </QItemSection>
    </QItem>
  </QList>
</template>

<script setup lang="ts">
import type { IUser } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { storeToRefs } from 'pinia';
import { useStore, useChatStore } from '@/stores';
import { MessangerService } from '@/api/services';

defineProps<{
  users?: IUser[];
}>();
const emit = defineEmits<{
  (event: 'update:search', value: string): void;
}>();

const { user } = storeToRefs(useStore());
const { chats, currentChatId } = storeToRefs(useChatStore());

async function openOrCreateChat(userId: string) {
  const response = await MessangerService.createChat([user.value._id, userId]);
  if (chats.value.has(response.data._id)) {
    currentChatId.value = response.data._id;
  } else {
    chats.value.set(response.data._id, response.data);
  }
  emit('update:search', '');
}
</script>

<template>
  <QList>
    <h6 v-if="!users?.length" class="text-center text-negative q-mt-lg">{{ t('chat.errors.search') }}</h6>
    <QItem v-for="user in users" v-ripple :key="user._id" clickable @click="openOrCreateChat(user._id)">
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
import type { IUser, ChatResponse } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useChatStore } from '@/stores';

import { useI18nT } from '@/hooks';

defineProps<{
  users?: IUser[];
}>();
const emit = defineEmits<{
  (event: 'update:search', value: string): void;
}>();

const { t } = useI18nT();
const { user } = storeToRefs(useStore());
const chatStore = useChatStore();
const { chats, currentChatId } = storeToRefs(chatStore);

onMounted(() => chatStore.socket.on('chat:create', onChatCreate));
onUnmounted(() => chatStore.socket.removeListener('chat:create', onChatCreate));

function onChatCreate(chat: ChatResponse) {
  if (chats.value.has(chat._id)) {
    currentChatId.value = chat._id;
  } else {
    chats.value.set(chat._id, chat);
  }
  currentChatId.value = chat._id;
  emit('update:search', '');
}

async function openOrCreateChat(userId: string) {
  chatStore.socket.emit('chat:create', user.value!._id, [user.value!._id, userId]);
}
</script>

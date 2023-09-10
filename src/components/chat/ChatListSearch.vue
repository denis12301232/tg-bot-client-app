<template>
  <QList class="list">
    <h6 v-if="!users?.length" class="text-center text-negative q-mt-lg">{{ t('chat.search.errors.none') }}</h6>
    <QItem
      v-for="user in users"
      v-ripple
      class="list-item"
      :key="user._id"
      clickable
      @click="openOrCreateChat(user._id)"
    >
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
import type { IUser, Responses } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { onMounted, onUnmounted, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useSocketStore } from '@/stores';
import { useI18n } from 'vue-i18n';
import { useFetch, useVModel } from '@/hooks';
import { UserService } from '@/api/services';
import { useRouter } from 'vue-router';

interface Props {
  modelValue: string;
}

defineProps<Props>();
const { t } = useI18n();
const router = useRouter();
const search = useVModel<string>();
const { user } = storeToRefs(useStore());
const socketStore = useSocketStore();
const { chats } = storeToRefs(socketStore);
const { request: searchUsers, data: users } = useFetch<IUser[], typeof UserService.getUsers>(UserService.getUsers);

onMounted(() => socketStore.socket.on('chat:create', onChatCreate));
onUnmounted(() => socketStore.socket.removeListener('chat:create', onChatCreate));
watchEffect(() => searchUsers({ filter: search.value }));

function onChatCreate(chat: Responses.Chat) {
  if (!chats.value.has(chat._id)) {
    chats.value.set(chat._id, chat);
  }
  router.push(`/chat/${chat._id}`).then(() => (search.value = ''));
}

async function openOrCreateChat(userId: string) {
  socketStore.socket.emit('chat:create', user.value!._id, [user.value!._id, userId]);
}
</script>

<style lang="scss" scoped>
.list {
  padding: 5px 5px;
}

.list-item {
  border-radius: 10px;
}
</style>

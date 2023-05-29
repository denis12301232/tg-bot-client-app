import { defineStore } from 'pinia';
import { watchEffect } from 'vue';
import { useStore } from '@/stores';
import { useMessanger, useSocketIo } from '@/hooks';

export const useChatStore = defineStore('chat', () => {
  const store = useStore();
  const { socket, isConnected, connect } = useSocketIo();
  const { chats, currentChat, currentChatId, sortedChats, onGetUserChats, onOpenChat } = useMessanger(socket);

  watchEffect(() => {
    if (isConnected.value && store.user) {
      store.user.status = 'online';
      onGetUserChats();
    }
  });

  return { socket, connect, chats, currentChat, currentChatId, sortedChats, onOpenChat };
});

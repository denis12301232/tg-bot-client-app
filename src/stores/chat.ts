import { defineStore } from 'pinia'
import { watchEffect } from 'vue'
import { useMessanger, useSocketIo} from '@/hooks'

export const useChatStore = defineStore('chat', () => {
   const { socket, isConnected, connect } = useSocketIo();
   const { chats, currentChat, currentChatId, sortedChats, onGetUserChats, onOpenChat } = useMessanger(socket);

   watchEffect(() => isConnected.value && onGetUserChats());

   return { socket, connect, chats, currentChat, currentChatId, sortedChats, onOpenChat }
});
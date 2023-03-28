import { defineStore } from 'pinia'
import { watchEffect } from 'vue';
import { useMessanger, usePeer, useVideoDialog, useSocketIo } from '@/hooks';

export const useChatStore = defineStore('chat', () => {
   const { socket, isConnected, connect } = useSocketIo();
   const { chats, currentChat, currentChatId, sortedChats, events, onGetUserChats, onOpenChat } = useMessanger();
   const { peer, connect: connectPeer } = usePeer();
   const { myVideo, userVideo, currentCall, myStream, callToUser, connectToNewUser, answer } = useVideoDialog(peer);

   watchEffect(() => {
      if (isConnected.value) {
         onGetUserChats();
      }
   });

   events.forEach((func, event) => socket.on(event, func));

   return { socket, connect, chats, currentChat, currentChatId, sortedChats, onOpenChat, peer, connectPeer, myVideo, userVideo, currentCall, callToUser, connectToNewUser, answer, myStream }
});
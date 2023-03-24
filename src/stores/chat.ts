import { defineStore } from 'pinia'
import { watchEffect } from 'vue';
import { useMessanger, useWebRTC, useVideoDialog, useSocketIo  } from '@/hooks';
import { ACTIONS } from '@/util'


export const useChatStore = defineStore('chat', () => {
   const { socket, isConnected, connect } = useSocketIo();
   const { chats, currentChat, currentChatId, sortedChats, events, onGetUserChats, onOpenChat } = useMessanger();
   const { peer, connect: connectPeer } = useWebRTC();
   const { myVideo, userVideo, currentCall, myStream, callToUser, connectToNewUser, answer } = useVideoDialog(peer);
   
   watchEffect(() => {
      if (isConnected.value) {
         onGetUserChats();
      }
   });

   socket.value.on(ACTIONS.NEW_MESSAGE, events.onNewMessage);
   socket.value.on(ACTIONS.READ_MESSAGE, events.onReadMessage);
   socket.value.on(ACTIONS.UPDATE_STATUS, events.onUpdateStatus);
   socket.value.on(ACTIONS.INVITE_TO_GROUP, events.onInviteToGroup);
   socket.value.on(ACTIONS.KICK_FROM_GROUP, events.onKickFromGroup);
   socket.value.on(ACTIONS.TYPING, events.onTyping);

   return { socket, connect, chats, currentChat, currentChatId, sortedChats, onOpenChat, peer, connectPeer, myVideo, userVideo, currentCall, callToUser, connectToNewUser, answer, myStream}
});
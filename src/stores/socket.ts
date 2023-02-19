import type { WsMessage } from '@/types/interfaces'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useStore } from '@/stores'
import { useMessanger } from '@/hooks'
import { Constants } from '@/util'


export const useSocketStore = defineStore('socket', () => {
   const store = useStore();
   const {
      chatsList, currentChatId, currentChat,
      onMessage, onGetUserChats, onOpenChat, onRead,
      onUpdateUserStatus, onGroupInvite, onKickFromGroup
   } = useMessanger();
   const isConnected = ref(false);
   const ws = ref<WebSocket | null>(null);
   const timer = ref(0);

   watch(isConnected, () => {
      isConnected.value ? onGetUserChats() : '';
      if (store.isAuth)
         isConnected.value ? store.user.status = 'online' : store.user.status = 'offline';
   }, { immediate: true });

   function connect() {
      ws.value = new WebSocket(Constants.SOCKET_URL + `?token=Bearer ${localStorage.getItem('token')}`);
      ws.value.onopen = function (event) {
         console.log('socket open');
         isConnected.value = true;
         clearTimeout(timer.value);
      }
      ws.value.onclose = function (event) {
         console.log('socket close');
         store.isAuth ? timer.value = setTimeout(connect, 10000) : '';
         isConnected.value = false;
      }
      ws.value.onerror = function (event) {
         console.log('socket error');
      }

      ws.value.onmessage = function (event) {
         const message: WsMessage = JSON.parse(event.data);

         switch (message.event) {
            case 'message':
               console.log('on message');
               onMessage(message, send);
               break;
            case 'read':
               console.log('on read')
               onRead(message);
               break;
            case 'update_status':
               console.log('on update_status')
               onUpdateUserStatus(message)
               break;
            case 'invite_to_group':
               console.log(message);
               onGroupInvite(message);
               break;
            case 'kick_from_group':
               console.log(message);
               onKickFromGroup(message);
               break;
         }
      }
   }

   function disconnect() {
      ws.value?.close();
   }

   function send(msg: WsMessage) {
      ws.value?.send(JSON.stringify(msg));
   }

   return { connect, disconnect, isConnected, chatsList, currentChatId, currentChat, send, onOpenChat };
});
import type { IMessage, WsMessage } from '@/types/interfaces'
import type { ChatResponse } from '@/types/http'
import { ref, computed, watch } from 'vue'
import { MessangerService } from '@/api/services'


export function useMessanger() {
   const chatsList = ref<ChatResponse[]>([]);
   const currentChatId = ref<string>('');
   const currentChat = computed(() => {
      return chatsList.value.filter(chat => chat._id === currentChatId.value)[0] || {};
   });

   watch(chatsList, () => {
      chatsList.value.sort((a, b) => {
         if (new Date(a.updatedAt) > new Date(b.updatedAt)) return -1;
         else return 1;
      });
   }, { deep: true });


   async function onGetUserChats() {
      const response = await MessangerService.getUserChats();
      console.log(response.data);

      chatsList.value = response.data;
   }

   function onMessage(msg: WsMessage<{ message: IMessage }>, send: (msg: WsMessage) => void) {
      const { message } = msg.payload;
      console.log(message);

      for (const chat of chatsList.value) {
         if (chat._id === message.chat_id) {
            chat.messages.push(message);
            chat.updatedAt = message.createdAt;
            console.log(currentChatId.value, message.chat_id);
            
            if (currentChatId.value !== message.chat_id) {
               chat.unread++;
            } else {
               MessangerService.updateRead(chat._id);
            }
            currentChat.value.total++;
            return;
         }
      }
   }

   async function onOpenChat(chat_id: string, page: number = 1, limit: number = 5) {
      currentChatId.value = chat_id;
      const length = currentChat.value.messages.length;
      const slice = currentChat.value.total > length && length < limit ? length : 0;
      const response = await MessangerService.openChat(chat_id, page, limit);
      const chat = chatsList.value.find(chat => chat._id === response.data.chat_id);

      if (chat) {
         chat.unread = 0;
         chat.messages.splice(0, slice, ...response.data.messages);
         return;
      }
   }

   function onRead(msg: WsMessage<{ chat_id: string, user_id: string }>) {
      const { chat_id, user_id } = msg.payload;
      console.log(user_id);
      for (const chat of chatsList.value) {
         if (chat._id === chat_id) {
            for (let i = chat.messages.length - 1; i >= 0; i--) {
               if (chat.messages[i]?.read.includes(user_id)) break;
               else chat.messages[i]?.read.push(user_id);
            }
         }
      }
   }

   function onUpdateUserStatus(msg: WsMessage<{ user_id: string, status: 'online' | 'offline' }>) {
      const { user_id, status } = msg.payload;
      for (const chat of chatsList.value) {
         if (chat.companion && chat.companion._id === user_id) {
            chat.companion.status = status;
            break;
         }
      }
   }

   function onGroupInvite(msg: WsMessage<ChatResponse>) {
      const chat = msg.payload;
      chatsList.value.push(chat);
   }

   function onKickFromGroup(msg: WsMessage<{ chat_id: string }>) {
      const { chat_id } = msg.payload;
      chatsList.value = chatsList.value.filter(chat => chat._id !== chat_id);
      if (currentChatId.value === chat_id) {
         currentChatId.value = '';
      }
   }

   return {
      chatsList, currentChatId, currentChat,
      onMessage, onGetUserChats, onOpenChat, onRead,
      onUpdateUserStatus, onGroupInvite, onKickFromGroup
   }
}
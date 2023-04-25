import type { IMessage, ChatResponse, SocketTyped } from '@/types'
import { type Ref, ref, computed, watchEffect } from 'vue'
import { MessangerService } from '@/api/services'
import { ACTIONS } from '@/util'


export default function useMessanger(socket: SocketTyped) {
   const chats = ref<Map<string, ChatResponse>>(new Map);
   const currentChatId = ref<string | null>(null);
   const currentChat = computed(() => currentChatId.value ? chats.value.get(currentChatId.value) || null : null);
   const sortedChats = computed(() => new Map([...chats.value.entries()]
      .sort((a, b) => (new Date(a[1].updatedAt) > new Date(b[1].updatedAt)) ? - 1 : 1)));
   useMessangerEvents({ chats, currentChatId }).forEach((func, event) => socket.on(event, func));

   watchEffect(() => {
      if (currentChatId) {
         const chat = chats.value.get(currentChatId.value!);
         chat && (chat.unread = 0);
      }
   });

   async function onOpenChat(chat_id: string, page: number = 1, limit: number = 5) {
      currentChatId.value = chat_id;
      if (currentChat.value) {
         const length = currentChat.value.messages.length;
         const slice = currentChat.value.total > length && length < limit ? length : 0;
         const response = await MessangerService.openChat(chat_id, page, limit);
         const chat = chats.value.get(chat_id);
         if (chat) {
            chat.messages.splice(0, slice, ...response.data.messages);
         }
      }
   }

   async function onGetUserChats() {
      const response = await MessangerService.getUserChats();
      chats.value = response.data.reduce((map, chat) => map.set(chat._id, chat), new Map<string, ChatResponse>);
   }

   return { chats, currentChatId, currentChat, sortedChats, onGetUserChats, onOpenChat }
}


function useMessangerEvents({ chats, currentChatId }: { chats: Ref<Map<string, ChatResponse>>, currentChatId: Ref<string | null> }) {
   const timers = new Map<string, number>();
   const list = {
      [ACTIONS.CHAT_MESSAGE]: onNewMessage,
      [ACTIONS.CHAT_READ_MESSAGE]: onReadMessage,
      [ACTIONS.CHAT_USER_STATUS]: onUpdateStatus,
      [ACTIONS.CHAT_INVITE_TO_GROUP]: onInviteToGroup,
      [ACTIONS.CHAT_KICK_FROM_GROUP]: onKickFromGroup,
      [ACTIONS.CHAT_TYPING]: onTyping,
   }

   async function onNewMessage(message: IMessage) {
      const chat = chats.value.get(message.chat_id);
      if (chat) {
         chat.typing[message.author] = '';
         chat.messages.push(message);
         chat.updatedAt = message.createdAt;
         currentChatId.value !== message.chat_id ? chat.unread++ : MessangerService.updateRead(chat._id);
         chat.total++;
      } else {
         const response = await MessangerService.getUserChatById(message.chat_id);
         chats.value.set(response.data._id, response.data);
      }
   }

   function onReadMessage(chat_id: string, user_id: string) {
      const chat = chats.value.get(chat_id);
      if (chat) {
         for (let i = chat.messages.length - 1; i >= 0; i--) {
            if (chat.messages[i]?.read.includes(user_id)) break;
            else chat.messages[i]?.read.push(user_id);
         }
      }
   }

   function onUpdateStatus(user_id: string, status: 'online' | 'offline') {
      const chat = [...chats.value.values()].find(chat => chat.companion && chat.companion._id === user_id);
      chat && (chat.companion.status = status);
   }

   function onInviteToGroup(chat: ChatResponse) {
      chats.value.set(chat._id, chat);
   }

   function onKickFromGroup(chat_id: string) {
      chats.value.delete(chat_id);
      currentChatId.value === chat_id && (currentChatId.value = null);
   }

   function onTyping(chat_id: string, user_name: string, user_id: string) {
      const chat = chats.value.get(chat_id);
      if (chat) {
         clearTimeout(timers.get(chat_id));
         !chat.typing?.hasOwnProperty(user_id) && (chat.typing[user_id] = user_name);
         const timer = setTimeout(() => delete chat.typing[user_id], 2000);
         timers.set(chat_id, timer);
      }
   }

   return new Map<keyof typeof list, typeof list[keyof typeof list]>(Object.entries(list) as any);
}
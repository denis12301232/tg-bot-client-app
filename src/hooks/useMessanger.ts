import type { IMessage, Responses, SocketTyped, Entries } from '@/types';
import { type Ref, ref, computed, watchEffect } from 'vue';
import { ChatService } from '@/api/services';

interface MessangerEvents {
  chats: Ref<Map<string, Responses.Chat>>;
  currentChatId: Ref<string | null>;
}

export default function useMessanger(socket: SocketTyped) {
  const chats = ref<Map<string, Responses.Chat>>(new Map());
  const currentChatId = ref<string | null>(null);
  const currentChat = computed(() => (currentChatId.value ? chats.value.get(currentChatId.value) || null : null));
  const sortedChats = computed(
    () =>
      new Map([...chats.value.entries()].sort((a, b) => (new Date(a[1].updatedAt) > new Date(b[1].updatedAt) ? -1 : 1)))
  );
  const unread = computed(() => [...chats.value.entries()].reduce((sum, [, chat]) => (chat.unread ? ++sum : sum), 0));

  useMessangerEvents({ chats, currentChatId }).forEach((func, event) => socket.on(event, func));

  watchEffect(() => {
    if (currentChatId.value) {
      const chat = chats.value.get(currentChatId.value!);
      chat && (chat.unread = 0);
    }
  });

  function getChatMessages(chatId: string, limit: number = 10) {
    const chat = chats.value.get(chatId);

    if (!chat) {
      return;
    }

    const skip = chat.messages.length;
    ChatService.chatMessages(chatId, skip, limit).then((messages) => chat.messages.splice(0, 0, ...messages));
  }

  function onGetUserChats() {
    ChatService.index().then((data) => data.forEach((chat) => chats.value.set(chat._id, chat)));
  }

  return { chats, currentChatId, currentChat, sortedChats, onGetUserChats, unread, getChatMessages };
}

function useMessangerEvents({ chats, currentChatId }: MessangerEvents) {
  const timers = new Map<string, number>();
  const list = {
    'chat:message': onNewMessage,
    'chat:messages-delete': onMessagesDelete,
    'chat:read-message': onReadMessage,
    'chat:user-status': onUpdateStatus,
    'chat:invite-to-group': onInviteToGroup,
    'chat:kick-from-group': onKickFromGroup,
    'chat:typing': onTyping,
    'chat:message-reactions': onMessageReactions,
  };

  async function onNewMessage(message: IMessage) {
    const chat = chats.value.get(message.chatId);
    if (chat) {
      chat.typing[message.author] = '';
      chat.messages.push(message);
      chat.updatedAt = message.createdAt;
      currentChatId.value !== message.chatId ? chat.unread++ : ChatService.updateRead(chat._id);
      chat.total++;
    } else {
      ChatService.show(message.chatId).then((data) => chats.value.set(data._id, data));
    }
  }

  function onMessagesDelete(chatId: string, msgIds: string[]) {
    const chat = chats.value.get(chatId);
    if (chat) {
      chat.total = chat.total - msgIds.length;
      chat.messages = chat.messages.filter((msg) => !msgIds.includes(msg._id));
    }
  }

  function onReadMessage(chatId: string, userId: string) {
    const chat = chats.value.get(chatId);
    if (chat) {
      for (let i = chat.messages.length - 1; i >= 0; i--) {
        if (chat.messages[i]?.read.includes(userId)) break;
        else chat.messages[i]?.read.push(userId);
      }
    }
  }

  function onUpdateStatus(userId: string, status: 'online' | 'offline') {
    const chat = [...chats.value.values()].find((chat) => chat.companion && chat.companion._id === userId);
    chat && (chat.companion.status = status);
  }

  function onInviteToGroup(chat: Responses.Chat) {
    chats.value.set(chat._id, chat);
  }

  function onKickFromGroup(chatId: string) {
    chats.value.delete(chatId);
    currentChatId.value === chatId && (currentChatId.value = null);
  }

  function onTyping(chatId: string, user_name: string, userId: string) {
    const chat = chats.value.get(chatId);
    if (chat) {
      clearTimeout(timers.get(chatId));
      !Object.prototype.hasOwnProperty.call(chat.typing, userId) && (chat.typing[userId] = user_name);
      const timer = setTimeout(() => delete chat.typing[userId], 1000);
      timers.set(chatId, timer);
    }
  }

  function onMessageReactions(chatId: string, msgId: string, reactions: { [name: string]: string[] }) {
    const message = chats.value.get(chatId)?.messages.find((msg) => msgId === msg._id);
    if (!message) {
      return;
    }
    message.reactions = reactions;
  }

  return new Map<keyof typeof list, (typeof list)[keyof typeof list]>(Object.entries(list) as Entries<typeof list>);
}

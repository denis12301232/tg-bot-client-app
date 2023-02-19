<template lang="pug">
div(class="chats")
   QInput(v-model="search" debounce="300" label="Поиск" :loading="isUsersLoading" outlined dense clearable)
   QList(v-if="search" class="chats_list")
      h6(v-if="!users?.length" class="text-center") Ничего не найдено
      QItem(v-for="user in users" v-ripple clickable, @click="onCreateChat(user._id)")
         QItemSection(avatar)
            UserAvatar(:name="user.name", :avatar="user.avatar")
         QItemSection {{ user.name }}
   QList(v-else class="chats_list")
      h6(v-if="!chatsList?.length" class="text-center") Список диалогов пуст
      QItem(
         v-for="chat in chatsList" 
         class="list_item"
         v-ripple
         clickable
         :active-class="store.currentTheme === 'dark' ? 'active_dark' : 'active_light'"
         :active="currentChatId === chat._id"
         @click="socketStore.onOpenChat(chat._id)"
         )
         QItemSection(avatar)
            UserAvatar(
               :name="chat.type === 'dialog' ? chat.companion.name : chat.group?.title" 
               :avatar="chat.type === 'dialog' ? chat.companion.avatar: chat.group?.avatar")
         QItemSection
            QItemLabel {{ chat.type === 'dialog' ? chat.companion.name: chat.group?.title }}
            QItemLabel(caption lines="2") {{ chat.messages?.length ? showLastMessageText(chat.messages.at(-1)) : 'Еще нет сообщений' }}
         QItemSection(side top bottom)
            QItemLabel(caption)
               div(style="display: flex; align-items: center;")
                  QIcon(
                     v-if="chat.type === 'dialog' && chat.messages?.at(-1)?.author === store.user._id"
                     :name="chat.messages.at(-1)?.read.includes(chat.companion._id) ? 'mdi-check-all' : 'mdi-check'" 
                     style="padding-right: 5px;"
                     )
                  div {{ Time.showFilteredDate(new Date(chat.updatedAt)) }} 
               div(v-if="+chat.unread" class="unread_count")
                  span {{ chat.unread }}
</template>

<script setup lang="ts">
import type { IMessage, IUser } from '@/types/interfaces'
import UserAvatar from '~/UserAvatar.vue'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore, useSocketStore } from '@/stores'
import { useFetch } from '@/hooks'
import { MessangerService } from '@/api/services'
import { Time } from '@/util'


const store = useStore();
const socketStore = useSocketStore();
const { chatsList, currentChatId } = storeToRefs(socketStore);
const search = ref('');
const { f: onFindUsers, data: users, loading: isUsersLoading } = useFetch<IUser[]>({
   fn: MessangerService.findUsers,
});

watch(search, (n, o) => {
   if (n) {
      onFindUsers(n);
   } else {
      users.value = [];
   }
});

async function onCreateChat(user_id: string) {
   const response = await MessangerService.createChat([store.user._id, user_id]);
   const find = chatsList.value.find((chat) => chat._id === response.data._id);

   if (find) {
      currentChatId.value = find._id;
      socketStore.onOpenChat(find._id);
   } else {
      currentChatId.value = response.data._id;
      chatsList.value.push(response.data);
   }
   search.value = '';
}

function showLastMessageText(msg: IMessage | undefined){
   if(msg?.text)
      return msg.text;
   if(msg?.attachments[0].type === 'audio')
      return 'Аудиосообщение';
   if(msg?.attachments[0].type === 'image')
      return 'Фотография';
}
</script>

<style scoped lang="scss">
.chats {
   flex-basis: 20%;
   min-width: 300px;
   padding: 5px;

   & .chats_list {
      margin-top: 10px;

      & .list_item {
         user-select: none;
      }
   }

   & .unread_count {
      display: flex;
      justify-content: end;
      padding-top: 10px;
      align-items: center;

      & span {
         background-color: rgb(159, 154, 154);
         color: white;
         border-radius: 50%;
         min-width: 20px;
         min-height: 20px;
         text-align: center;
         line-height: 20px;
      }
   }
}

.active_light {
   background-color: $blue-grey-1;
   color: inherit;
}

.active_dark {
   background-color: $blue-grey-9;
   color: inherit;
}
</style>
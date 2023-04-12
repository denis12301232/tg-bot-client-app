<template>
  <div :class="['row', 'items-center', store.currentTheme === 'dark' ? 'chat_dark' : 'chat_light']">
    <QInput
      v-model="search"
      class="full-width"
      debounce="300"
      label="Поиск"
      :loading="isUsersLoading"
      clearable
      hide-bottom-space
      borderless
    >
      <template #prepend>
        <QBtn round dense flat icon="menu">
          <QMenu :offset="[50, 10]">
            <QList style="min-width: 250px;">
              <QItem v-ripple class="list_item" clickable tag="a" to="/" active-class="active">
                <QItemSection avatar>
                  <QIcon name="home" color="primary" />
                </QItemSection>
                <QItemSection>На главную</QItemSection>
              </QItem>
              <QItem v-ripple class="list_item" clickable tag="a" to="/account" active-class="active">
                <QItemSection avatar>
                  <QIcon name="account_circle" color="primary" />
                </QItemSection>
                <QItemSection>Аккаунт</QItemSection>
              </QItem>
              <QItem v-ripple v-close-popup class="list_item" clickable active-class="active" @click="openModal">
                <QItemSection avatar>
                  <QIcon name="note_add" color="primary" />
                </QItemSection>
                <QItemSection>Создать группу</QItemSection>
              </QItem>
            </QList>
          </QMenu>
        </QBtn>
      </template>
    </QInput>
  </div>
  <QScrollArea class="q-pa-none" delay="1200" :thumb-style="{ width: '7px' }" style="height: calc(100% - 63px)">
    <div class="chats">
      <QList v-if="search">
        <h6 v-if="!users?.length" class="text-center text-negative">Ничего не найдено</h6>
        <QItem v-for="user in users" v-ripple clickable @click="onCreateChat(user._id)">
          <QItemSection avatar>
            <UserAvatar :name="user.name" :avatar="user.avatar" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>{{ user.name }}</QItemLabel>
            <QItemLabel>@{{ user.login }}</QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
      <QList v-else>
        <h6 v-if="!sortedChats.size" class="text-center text-negative">Список диалогов пуст</h6>
        <QItem
          v-for="chat in sortedChats.values()"
          v-ripple
          class="non-selectable"
          clickable
          :active-class="store.currentTheme === 'dark' ? 'active_dark' : 'active_light'"
          :active="currentChatId === chat._id"
          @click="onOpenChat(chat._id)"
        >
          <QItemSection avatar>
            <UserAvatar
              :name="chat.type === 'dialog' ? chat.companion.name : chat.group?.title"
              :avatar="chat.type === 'dialog' ? chat.companion.avatar : chat.group?.avatar"
            />
          </QItemSection>
          <QItemSection>
            <QItemLabel>{{ chat.type === 'dialog' ? chat.companion.name : chat.group?.title }}</QItemLabel>
            <QItemLabel class="text-cut" caption lines="2">
              <div v-if="!Object.values(chat.typing || {}).at(0)">
                {{ chat.messages?.length ? showLastMessageText(chat.messages.at(-1)) : 'Еще нет сообщений' }}
              </div>
              <div v-else>
                <QSpinnerDots size="1rem" />
                {{ chat.type === 'group' ? Object.values(chat.typing || {}).at(0) + ' печатает' : 'печатает' }}
              </div>
            </QItemLabel>
          </QItemSection>
          <QItemSection side top bottom>
            <QItemLabel caption>
              <div class="row items-center">
                <QIcon
                  v-if="chat.type === 'dialog' && chat.messages?.at(-1)?.author === store.user._id"
                  class="q-pr-sm"
                  :name="chat.messages.at(-1)?.read.includes(chat.companion._id) ? 'done_all' : 'done'"
                />
                <div>{{ Time.showDialogListDate(new Date(chat.updatedAt)) }}</div>
              </div>
              <div v-if="Number(chat.unread)" class="unread_count">
                <span>{{ chat.unread }}</span>
              </div>
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
    </div>
  </QScrollArea>
</template>

<script setup lang="ts">
import type { IMessage, IUser, ModalContent } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useChatStore } from '@/stores';
import { useFetch } from '@/hooks';
import { MessangerService } from '@/api/services';
import { Time } from '@/util';

const emit = defineEmits<{
  (event: 'open-modal', content: ModalContent): void;
}>();
const store = useStore();
const { chats, currentChatId, sortedChats } = storeToRefs(useChatStore());
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

function openModal() {
  emit('open-modal', 'create-group');
}

async function onCreateChat(user_id: string) {
  const response = await MessangerService.createChat([store.user._id, user_id]);
  const chat = chats.value.get(response.data._id);

  if (chat) {
    currentChatId.value = chat._id;
    onOpenChat(chat._id);
  } else {
    chats.value.set(response.data._id, response.data);
    currentChatId.value = response.data._id;
  }
  search.value = '';
}

function showLastMessageText(msg: IMessage | undefined) {
  if (msg?.text) return msg.text;
  if (msg?.attachments[0].type === 'audio') return 'Аудиосообщение';
  if (msg?.attachments[0].type === 'image') return 'Фотография';
}

function onOpenChat(chat_id: string) {
  currentChatId.value = chat_id;
  MessangerService.updateRead(chat_id);
}
</script>

<style scoped lang="scss">
.chats {
  flex-basis: 20%;
  padding: 2px 5px;

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
  background-color: $blue-grey-10;
  color: inherit;
}

.chat_dark {
  background-color: $blue-grey-10;
  height: 61px;
}

.chat_light {
  background-color: $blue-grey-1;
  height: 61px;
}
</style>

<template>
  <QList class="list">
    <h6 v-if="!sortedChats.size" class="text-center text-negative q-mt-lg">{{ t('chat.write.dialogs') }}</h6>
    <QItem
      v-for="chat in sortedChats.values()"
      v-ripple
      :key="chat._id"
      class="non-selectable list-item"
      style="flex-wrap: wrap"
      clickable
      :active="currentChatId === chat._id"
      :active-class="currentTheme === 'light' ? 'bg-blue-grey-3 text-grey-8' : 'bg-blue-grey-9 text-white'"
      @click="onOpenChat(chat._id)"
    >
      <QItemSection avatar>
        <UserAvatar
          :name="chat.type === 'dialog' ? chat.companion.name : chat.group?.title"
          :avatar="chat.type === 'dialog' ? chat.companion.avatar : chat.group?.avatar"
          size="50px"
        />
      </QItemSection>
      <QItemSection>
        <QItemLabel class="text-cut" style="max-width: 90%">
          {{ chat.type === 'dialog' ? chat.companion.name : chat.group?.title }}
        </QItemLabel>
        <QItemLabel caption lines="2">
          <div v-if="!Object.values(chat.typing || {}).at(0)" class="text-cut" style="max-width: 90%">
            {{ chat.messages?.length ? showLastMessageText(chat.messages.at(-1)) : t('chat.messages.none') }}
          </div>
          <div v-else>
            <QSpinnerDots size="1rem" />
            {{
              chat.type === 'group'
                ? Object.values(chat.typing || {}).at(0) + ` ${t('chat.messages.typing')}`
                : ` ${t('chat.messages.typing')}`
            }}
          </div>
        </QItemLabel>
      </QItemSection>
      <QItemSection side top bottom>
        <QItemLabel caption>
          <div class="row items-center">
            <QIcon
              v-if="chat.type === 'dialog' && chat.messages?.at(-1)?.author === user?._id"
              class="q-pr-sm"
              :name="
                chat.messages.at(-1)?.read.includes(chat.companion._id)
                  ? 'eva-done-all-outline'
                  : 'eva-checkmark-outline'
              "
            />
            <div>{{ showDate(chat.updatedAt) }}</div>
          </div>
          <div v-if="Number(chat.unread)" class="row justify-end items-end q-mt-sm">
            <QBadge rounded :label="chat.unread" color="blue-grey-3" />
          </div>
        </QItemLabel>
      </QItemSection>
    </QItem>
  </QList>
</template>

<script setup lang="ts">
import type { IMessage } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { storeToRefs } from 'pinia';
import { useChatStore, useStore } from '@/stores';
import { ChatService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { t, d } = useI18n();
const { user, currentTheme } = storeToRefs(useStore());
const { currentChatId, sortedChats } = storeToRefs(useChatStore());

function showLastMessageText(msg: IMessage | undefined) {
  if (msg?.text) return msg.text;
  if (msg?.attachments?.at(0)?.ext === 'webm') return t('chat.messages.audio');
  if (msg?.attachments?.at(0)?.mime.includes('image')) return t('chat.messages.image');
}

function onOpenChat(chat_id: string) {
  currentChatId.value = chat_id;
  ChatService.updateRead(chat_id);
}

function showDate(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);

  if (
    now.getDay() === date.getDay() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()
  ) {
    return d(dateString, 'time');
  } else if (now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()) {
    return d(dateString, 'MMDD');
  } else {
    return d(dateString, 'YYYYMMDD');
  }
}
</script>

<style scoped lang="scss">
.list {
  padding: 5px 5px;
}

.list-item {
  border-radius: 10px;
}
</style>

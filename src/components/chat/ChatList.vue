<template>
  <QList class="list">
    <h6 v-if="!sortedChats.size" class="text-center text-negative q-mt-lg">{{ t('chat.write.dialogs') }}</h6>
    <QItem
      v-for="chat in sortedChats.values()"
      v-ripple
      :key="chat._id"
      class="non-selectable"
      style="flex-wrap: wrap"
      clickable
      :active="currentChatId === chat._id"
      :active-class="currentTheme === 'light' ? 'bg-indigo-1 text-grey-8' : 'bg-blue-grey-9 text-white'"
      @click="onOpenChat(chat._id)"
    >
      <QItemSection avatar>
        <UserAvatar
          :name="chat.type === 'dialog' ? chat.companion.name : chat.group?.title"
          :avatar="chat.type === 'dialog' ? chat.companion.avatar : chat.group?.avatar"
        />
      </QItemSection>
      <QItemSection>
        <QItemLabel class="text-cut" style="max-width: 90%">
          {{ chat.type === 'dialog' ? chat.companion.name : chat.group?.title }}
        </QItemLabel>
        <QItemLabel caption lines="2">
          <div v-if="!Object.values(chat.typing || {}).at(0)" class="text-cut" style="max-width: 90%">
            {{ chat.messages?.length ? showLastMessageText(chat.messages.at(-1)) : t('chat.msg.none') }}
          </div>
          <div v-else>
            <QSpinnerDots size="1rem" />
            {{
              chat.type === 'group'
                ? Object.values(chat.typing || {}).at(0) + ` ${t('chat.writing')}`
                : ` ${t('chat.writing')}`
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
            <div>{{ Time.showDialogListDate(new Date(chat.updatedAt)) }}</div>
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
import { Time } from '@/util';
import { ChatService } from '@/api/services';
import { useI18nT } from '@/hooks';

const { t } = useI18nT();
const { user, currentTheme } = storeToRefs(useStore());
const { currentChatId, sortedChats } = storeToRefs(useChatStore());

function showLastMessageText(msg: IMessage | undefined) {
  if (msg?.text) return msg.text;
  if (msg?.attachments?.at(0)?.ext === 'webm') return t('chat.msg.audio');
  if (msg?.attachments?.at(0)?.mime.includes('image')) return t('chat.msg.image');
}

function onOpenChat(chat_id: string) {
  currentChatId.value = chat_id;
  ChatService.updateRead(chat_id);
}
</script>

<style scoped lang="scss">
.list {
  padding: 5px 2px;
}
</style>

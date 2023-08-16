<template>
  <QDialog v-model="modal" maximized>
    <ModalImage :src="src" />
  </QDialog>
  <div v-if="!messages.length" class="row justify-center items-center text-indigo text-bold text-h6">
    {{ t('chat.messages.none') }}
  </div>
  <QScrollArea v-else ref="scroll" class="fit q-pt-sm" :thumb-style="{ width: '7px' }" @scroll="onScroll">
    <QInfiniteScroll reverse :key="`${currentChatId}`" :offset="10" :initial-index="initialIndex" @load="onLoad">
      <template #loading>
        <div v-if="currentChat?.total || 0 > messages.length" class="row justify-center q-my-md">
          <QSpinner color="primary" name="dots" size="40px" />
        </div>
      </template>
      <div v-if="verticalScroll < 1" class="fixed-bottom-right q-pa-md z-max">
        <QBtn
          round
          color="indigo"
          icon="eva-arrow-downward-outline"
          @click="scroll?.setScrollPercentage('vertical', 1)"
        />
      </div>
      <div
        v-for="msg in messages"
        :class="[
          'full-width',
          'row',
          'q-px-lg',
          'q-py-sm',
          { [$style[`selected-${currentTheme}`]]: selectedMessages.has(msg._id) },
          { 'justify-end': isSended(msg.author) },
        ]"
        :key="msg._id"
      >
        <MessageImage
          v-if="msg.attachments?.at(0)?.mime.includes('image/')"
          :sent="isSended(msg.author)"
          :time="msg.createdAt"
          :images="msg.attachments.map((attachment) => `${attachment?.name}.${attachment?.ext}`)"
          @open="onOpenImage"
        >
          <template #avatar="{ classes }">
            <UserAvatar
              v-if="currentChat?.group"
              :class="classes"
              :name="getAuthor(msg)?.name"
              :avatar="getAuthor(msg)?.avatar"
            />
          </template>
          <template #reactions>
            <div>
              <template v-for="(users, key) of msg.reactions" :key="key">
                <QChip
                  v-if="users.length"
                  class="shadow-2 text-white"
                  :label="`${key} ${users.length}`"
                  :color="isSended(msg.author) ? 'primary' : 'grey-9'"
                  clickable
                  dense
                  @click="setReaction(msg._id, key as string)"
                />
              </template>
            </div>
          </template>
        </MessageImage>
        <Message
          v-else
          style="word-break: break-all"
          :sent="isSended(msg.author)"
          :read="msg.read.length > 1"
          :text="msg.text"
          :time="msg.createdAt"
          :color="isSended(msg.author) ? '#1976d2' : '#424242'"
        >
          <template #avatar="{ classes }">
            <UserAvatar
              v-if="currentChat?.group"
              :class="classes"
              :name="getAuthor(msg)?.name"
              :avatar="getAuthor(msg)?.avatar"
            />
          </template>
          <template #reactions>
            <div>
              <template v-for="(users, key) of msg.reactions" :key="key">
                <QChip
                  v-if="users.length"
                  :label="`${key} ${users.length}`"
                  clickable
                  dense
                  class="shadow-2 text-white"
                  :color="isSended(msg.author) ? 'primary' : 'grey-9'"
                  @click="setReaction(msg._id, key as string)"
                />
              </template>
            </div>
          </template>
          <template #audio>
            <MessageVoice
              v-if="msg.attachments?.at(0)?.mime.includes('webm')"
              style="width: 200px"
              :filename="`${msg.attachments.at(0)?.name}.${msg.attachments.at(0)?.ext}`"
            />
          </template>
        </Message>
        <QMenu touch-position context-menu @before-show="onShowContext(msg._id)" @before-hide="onHideContext(msg._id)">
          <div class="row justify-center q-pa-sm">
            <QBtn
              v-for="reaction of reactions"
              v-close-popup
              round
              flat
              dense
              :key="reaction"
              @click="setReaction(msg._id, reaction)"
            >
              {{ reaction }}
            </QBtn>
          </div>
          <QList class="q-pa-sm" dense style="min-width: 100px">
            <QItem :class="$style.menu_item" clickable v-close-popup @click="Util.copyTextToClipboard(msg.text)">
              <QItemSection avatar style="min-width: 20px">
                <QIcon name="eva-copy" color="indigo" />
              </QItemSection>
              <QItemSection>{{ t('chat.messages.copyMessage') }}</QItemSection>
            </QItem>
            <QItem v-if="!currentChat?.group" v-close-popup :class="$style.menu_item" clickable @click="onDelete">
              <QItemSection avatar style="min-width: 20px">
                <QIcon color="negative" name="eva-trash" />
              </QItemSection>
              <QItemSection>{{ t('chat.messages.deleteMessage') }}</QItemSection>
            </QItem>
          </QList>
        </QMenu>
      </div>
    </QInfiniteScroll>
  </QScrollArea>
</template>

<script setup lang="ts">
import type { IMessage, Q } from '@/types';
import type { QScrollArea } from 'quasar';
import UserAvatar from '~/UserAvatar.vue';
import { Message, MessageImage, MessageVoice, ModalImage } from '~/chat';
import { ref, computed, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useChatStore } from '@/stores';
import { Util } from '@/util';
import { useI18n } from 'vue-i18n';

interface Props {
  type: 'dialog' | 'group';
}

defineProps<Props>();
const LIMIT = 10;
const { t } = useI18n();
const chatStore = useChatStore();
const { user, currentTheme } = storeToRefs(useStore());
const { currentChatId, currentChat } = storeToRefs(chatStore);
const modal = ref(false);
const src = ref('');
const scroll = ref<QScrollArea | null>(null);
const loading = ref(false);
const selectedMessages = ref<Set<string>>(new Set());
const messages = computed(() => currentChat.value?.messages || []);
const initialIndex = computed(() => (messages.value.length > LIMIT ? Math.ceil(messages.value.length / LIMIT) : 0));
const reactions = ref(['👍', '👎', '😊', '😂', '❤️']);
const verticalScroll = ref(1);

watch(
  () => currentChat.value?.total,
  async () => {
    await nextTick();
    setTimeout(() => scroll.value?.setScrollPercentage('vertical', 1));
  }
);

async function onLoad(index: number, done: (stop?: boolean | undefined) => void) {
  if (currentChat.value && currentChat.value.total > messages.value.length) {
    loading.value = true;
    await chatStore.getChatMessages(currentChatId.value!, LIMIT);
    loading.value = false;
    return done();
  }
  done(true);
}

function getAuthor(msg: IMessage) {
  return isSended(msg.author) ? user.value : currentChat.value?.users.find((user) => user._id === msg.author);
}

function onOpenImage(source: string) {
  modal.value = true;
  src.value = source;
}

function isSended(author: string) {
  return author === user.value?._id;
}

function onShowContext(id: string) {
  selectedMessages.value.add(id);
}

function onHideContext(id: string) {
  selectedMessages.value.delete(id);
}

function onDelete() {
  if (currentChatId.value) {
    const data = { chatId: currentChatId.value, msgIds: Array.from(selectedMessages.value) };
    chatStore.socket.emit('chat:messages-delete', data);
  }
}

function setReaction(msgId: string, reaction: string) {
  chatStore.socket.emit('chat:message-reactions', { msgId, reaction });
}

function onScroll(info: Q.ScrollEvent) {
  verticalScroll.value = info.verticalSize < info.verticalContainerSize ? 1 : info.verticalPercentage;
}
</script>

<style lang="scss" module>
.msg {
  max-width: 200px;
  width: 200px;
}

.menu_item {
  border-radius: 10px;
}

.selected-dark {
  background-color: $grey-10;
}

.selected-light {
  background-color: $grey-12;
}

.message-sended-dark {
  background-color: $deep-purple-8;
}

.message-sended-light {
  background-color: $grey-10;
}
</style>

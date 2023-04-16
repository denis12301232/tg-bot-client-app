<template>
  <div v-if="!messages.length" class="row justify-center items-center text-indigo chat_void">Здесь пусто...</div>
  <QScrollArea v-else class="fit">
    <QInfiniteScroll reverse :key="String(currentChatId)" :offset="10" :initial-index="initialIndex" @load="onLoad">
      <template #loading>
        <div v-if="currentChat?.total || 0 > messages.length" class="row justify-center q-my-md">
          <QSpinner color="primary" name="dots" size="40px" />
        </div>
      </template>
      <QChatMessage
        class="q-px-md"
        v-for="msg in messages"
        :sent="msg.author === user._id"
        :key="msg._id"
        :bg-color="msg.author === user._id ? 'blue-8' : 'green-5'"
        text-color="white"
      >
        <template #name v-if="type === 'group'">
          <div class="text-bold text-deep-orange">{{ msg.author === user._id ? 'Я' : getAuthor(msg)?.name }}</div>
        </template>
        <template #avatar v-if="type === 'group'">
          <UserAvatar
            :name="getAuthor(msg)?.name"
            :avatar="getAuthor(msg)?.avatar"
            :class="[
              'q-message-avatar',
              msg.author === user._id ? 'q-message-avatar--sent' : 'q-message-avatar--received',
            ]"
            size="30px"
          />
        </template>
        <template #stamp>
          <div class="row justify-between items-center q-mt-sm cursor-pointer">
            <div class="q-pr-md">{{ Time.showFilteredDate(new Date(msg.createdAt)) }}</div>
            <QIcon v-if="msg.author === user._id" :name="msg.read.length > 1 ? 'done_all' : 'done'" />
          </div>
        </template>
        <template #default>
          <div :class="{ [$style.msg]: msg.attachments.length }">
            <span v-if="msg.text" style="font-size: 1.2em">{{ msg.text }}</span>
            <ChatMessageVoice
              v-if="msg.attachments[0]?.type === 'audio'"
              :src="`${ENV.SERVER_URL}/audio/${msg.attachments.at(0)?.name}`"
            />
            <ChatMessageImage
              v-else-if="msg.attachments[0]?.type === 'image'"
              :images="msg.attachments.map((msg) => `${ENV.SERVER_URL}/media/${msg?.name}`)"
              @open="onOpenImage"
            />
          </div>
        </template>
      </QChatMessage>
    </QInfiniteScroll>
  </QScrollArea>
</template>

<script setup lang="ts">
import type { IMessage, ChatModal } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import ChatMessageVoice from '~/chat/ChatMessageVoice.vue';
import ChatMessageImage from '~/chat/ChatMessageImage.vue';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useChatStore } from '@/stores';
import { Time, ENV } from '@/util';

defineProps<{
  type: 'dialog' | 'group';
}>();
const emit = defineEmits<{
  (event: 'open-modal', component: ChatModal): void;
  (event: 'open-image', src: string): void;
}>();

const chatStore = useChatStore();
const { user } = storeToRefs(useStore());
const { currentChatId, currentChat } = storeToRefs(chatStore);
const loading = ref(false);
const messages = computed(() => currentChat.value?.messages || []);
const initialIndex = computed(() => (messages.value.length > limit ? Math.ceil(messages.value.length / limit) : 0));
const limit = 10;

async function onLoad(index: number, done: (stop?: boolean | undefined) => void) {
  if (currentChat.value && currentChat.value.total > messages.value.length) {
    loading.value = true;
    await chatStore.onOpenChat(currentChatId.value!, index, limit);
    loading.value = false;
    return done();
  }
  done(true);
}

function getAuthor(msg: IMessage) {
  return msg.author === user.value._id ? user.value : currentChat.value?.users.find((user) => user._id === msg.author)!;
}

function onOpenImage(src: string) {
  emit('open-modal', 'modal:open-image');
  emit('open-image', src);
}
</script>

<style lang="scss" module>
.msg {
  max-width: 200px;
  width: 200px;
}
</style>

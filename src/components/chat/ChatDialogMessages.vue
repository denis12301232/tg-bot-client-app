<template>
  <QDialog v-model="modal" maximized>
    <Chat.ModalImage :src="src" />
  </QDialog>
  <div v-if="!messages.length" class="row justify-center items-center text-indigo text-bold text-h6">
    {{ t('chat.messages.none') }}
  </div>
  <QScrollArea v-else ref="scroll" class="fit q-pt-sm" :thumb-style="{ width: '7px' }">
    <QInfiniteScroll reverse :key="String(currentChatId)" :offset="10" :initial-index="initialIndex" @load="onLoad">
      <template #loading>
        <div v-if="currentChat?.total || 0 > messages.length" class="row justify-center q-my-md">
          <QSpinner color="primary" name="dots" size="40px" />
        </div>
      </template>
      <QChatMessage
        class="q-px-md"
        v-for="msg in messages"
        :sent="msg.author === user?._id"
        :key="msg._id"
        :bg-color="msg.author === user?._id ? 'indigo-6' : 'blue-grey'"
        text-color="white"
      >
        <template #name v-if="type === 'group'">
          <div class="text-bold text-deep-orange">
            {{ msg.author === user?._id ? t('chat.messages.me') : getAuthor(msg)?.name }}
          </div>
        </template>
        <template #avatar v-if="type === 'group'">
          <UserAvatar
            :name="getAuthor(msg)?.name"
            :avatar="getAuthor(msg)?.avatar"
            :class="[
              'q-message-avatar',
              msg.author === user?._id ? 'q-message-avatar--sent' : 'q-message-avatar--received',
            ]"
            size="30px"
          />
        </template>
        <template #stamp>
          <div class="row justify-between items-center q-mt-sm cursor-pointer">
            <div class="q-pr-md">{{ Time.showFilteredDate(new Date(msg.createdAt)) }}</div>
            <QIcon
              v-if="msg.author === user?._id"
              :name="msg.read.length > 1 ? 'eva-done-all-outline' : 'eva-checkmark-outline'"
            />
          </div>
        </template>
        <template #default>
          <div :class="{ [$style.msg]: msg.attachments?.length }">
            <span v-if="msg.text" style="font-size: 1.2em">{{ msg.text }}</span>
            <Chat.MessageVoice
              v-if="msg.attachments?.at(0)?.ext === 'webm'"
              :filename="`${msg.attachments.at(0)?.name}.${msg.attachments.at(0)?.ext}`"
            />
            <Chat.MessageImage
              v-else-if="msg.attachments?.at(0)?.mime.includes('image/')"
              :filenames="msg.attachments.map((attachment) => `${attachment?.name}.${attachment?.ext}`)"
              @open="onOpenImage"
            />
          </div>
        </template>
      </QChatMessage>
    </QInfiniteScroll>
  </QScrollArea>
</template>

<script setup lang="ts">
import type { IMessage } from '@/types';
import type { QScrollArea } from 'quasar';
import UserAvatar from '~/UserAvatar.vue';
import Chat from '~/chat';
import { ref, computed, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useChatStore } from '@/stores';
import { Time } from '@/util';
import { useI18n } from 'vue-i18n';

defineProps<{
  type: 'dialog' | 'group';
}>();

const { t } = useI18n();
const chatStore = useChatStore();
const { user } = storeToRefs(useStore());
const { currentChatId, currentChat } = storeToRefs(chatStore);
const modal = ref(false);
const src = ref('');
const scroll = ref<QScrollArea | null>(null);
const loading = ref(false);
const messages = computed(() => currentChat.value?.messages || []);
const initialIndex = computed(() => (messages.value.length > limit ? Math.ceil(messages.value.length / limit) : 0));
const limit = 10;

watch(
  () => currentChat.value?.total,
  () => {
    nextTick().then(() => setTimeout(() => scroll.value?.setScrollPercentage('vertical', 1), 0));
  }
);

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
  return msg.author === user.value?._id
    ? user.value
    : currentChat.value?.users.find((user) => user._id === msg.author)!;
}

function onOpenImage(source: string) {
  modal.value = true;
  src.value = source;
}
</script>

<style lang="scss" module>
.msg {
  max-width: 200px;
  width: 200px;
}
</style>

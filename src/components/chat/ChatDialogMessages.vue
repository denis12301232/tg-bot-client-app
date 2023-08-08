<template>
  <QDialog v-model="modal" maximized>
    <Chat.ModalImage :src="src" />
  </QDialog>
  <div v-if="!messages.length" class="row justify-center items-center text-indigo text-bold text-h6">
    {{ t('chat.messages.none') }}
  </div>
  <QScrollArea v-else ref="scroll" class="fit q-pt-sm" :thumb-style="{ width: '7px' }">
    <QInfiniteScroll reverse :key="`${currentChatId}`" :offset="10" :initial-index="initialIndex" @load="onLoad">
      <template #loading>
        <div v-if="currentChat?.total || 0 > messages.length" class="row justify-center q-my-md">
          <QSpinner color="primary" name="dots" size="40px" />
        </div>
      </template>
      <div v-for="msg in messages" :class="{ [$style.selected]: selectedMessages.has(msg._id) }" :key="msg._id">
        <QMenu touch-position context-menu @before-show="onShowContext(msg._id)" @before-hide="onHideContext(msg._id)">
          <QList class="q-pa-sm" dense style="min-width: 100px">
            <QItem :class="$style.menu_item" clickable v-close-popup>
              <QItemSection avatar>
                <QIcon color="indigo" name="eva-copy" />
              </QItemSection>
              <QItemSection>Copy</QItemSection>
            </QItem>
            <QItem :class="$style.menu_item" clickable v-close-popup>
              <QItemSection avatar>
                <QIcon color="negative" name="eva-trash" />
              </QItemSection>
              <QItemSection>Delete</QItemSection>
            </QItem>
          </QList>
        </QMenu>
        <QChatMessage
          class="q-px-md"
          :sent="isSended(msg.author)"
          :bg-color="isSended(msg.author) ? 'indigo-6' : 'blue-grey'"
          text-color="white"
        >
          <template #name v-if="type === 'group'">
            <div class="text-bold text-deep-orange">
              {{ isSended(msg.author) ? t('chat.messages.me') : getAuthor(msg)?.name }}
            </div>
          </template>
          <template #avatar v-if="type === 'group'">
            <div :class="msg.author === user?._id ? 'q-pl-sm' : 'q-pr-sm'">
              <UserAvatar :name="getAuthor(msg)?.name" :avatar="getAuthor(msg)?.avatar" size="50px" />
            </div>
          </template>
          <template #stamp>
            <div class="row justify-between items-center q-mt-sm cursor-pointer">
              <div class="q-pr-md">{{ Time.showFilteredDate(new Date(msg.createdAt)) }}</div>
              <QIcon
                v-if="isSended(msg.author)"
                :name="msg.read.length > 1 ? 'eva-done-all-outline' : 'eva-checkmark-outline'"
              />
            </div>
          </template>
          <template #default>
            <div :class="{ [$style.msg]: msg.attachments?.length }">
              <span v-if="msg.text" style="font-size: 1.2em">{{ msg.text }}</span>
              <Chat.MessageVoice
                v-if="msg.attachments?.at(0)?.mime.includes('webm')"
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
      </div>
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
const selectedMessages = ref<Set<string>>(new Set());
const messages = computed(() => currentChat.value?.messages || []);
const initialIndex = computed(() => (messages.value.length > limit ? Math.ceil(messages.value.length / limit) : 0));
const limit = 10;

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
    await chatStore.onOpenChat(currentChatId.value!, index, limit);
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
  console.log('open', id);
}

function onHideContext(id: string) {
  selectedMessages.value.delete(id);
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

.selected {
  background-color: $grey-10;
}
</style>

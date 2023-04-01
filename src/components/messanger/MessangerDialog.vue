<template>
  <div :class="['dialog', currentTheme === 'dark' ? 'dialog_dark' : 'dialog_light']">
    <QItem class="q-mb-sm dialog_name">
      <QItemSection avatar>
        <QBtn icon="arrow_back" color="grey-7" dense round flat @click="currentChatId = null" />
      </QItemSection>
      <QItemSection avatar>
        <UserAvatar :name="currentChat?.companion.name" :avatar="currentChat?.companion.avatar" />
      </QItemSection>
      <QItemSection>
        <QItemLabel class="text-h6 text-cut">{{ currentChat?.companion.name }}</QItemLabel>
        <QItemLabel class="text-cut" caption>
          <div v-if="!Object.values(currentChat?.typing || {}).at(0)">{{ currentChat?.companion.status }}</div>
          <div v-else>
            <QSpinnerDots size="1rem" />
            {{ 'печатает' }}
          </div>
        </QItemLabel>
      </QItemSection>
      <QItemSection side>
        <div class="row">
          <QBtn dense flat round icon="phone" @click="openCallModal" />
          <QBtnDropdown dropdown-icon="more_vert" rounded dense flat>
            <QList bordered>
              <QItem v-ripple v-close-popup clickable @click="deleteChat">
                <QItemSection avatar class="q-pr-sm" style="min-width: 0">
                  <QIcon name="delete" color="red"></QIcon>
                </QItemSection>
                <QItemSection>Удалить чат</QItemSection>
              </QItem>
            </QList>
          </QBtnDropdown>
        </div>
      </QItemSection>
    </QItem>
    <div v-if="!messages.length" class="void">Здесь пусто...</div>
    <QScrollArea v-else class="dialog_content" delay="1200" ref="dialogRef" :thumb-style="{ width: '7px' }">
      <QInfiniteScroll @load="onLoad" reverse :offset="10" :initial-index="initialIndex">
        <template #loading>
          <div v-if="currentChat?.total || 0 > messages.length" class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
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
          <template #stamp>
            <div class="row justify-between items-center q-mt-sm cursor-pointer">
              <div class="q-pr-md">{{ Time.showFilteredDate(new Date(msg.createdAt)) }}</div>
              <QIcon
                v-if="msg.author === user._id"
                :name="msg.read.includes(currentChat?.companion._id || '') ? 'done_all' : 'done'"
              />
            </div>
          </template>
          <template #default>
            <div :class="{ msg: msg.attachments.length }">
              <span style="font-size: 1.2em">{{ msg.text }}</span>
              <MessangerVoiceMessage
                v-if="msg.attachments[0]?.type === 'audio'"
                :src="`${Constants.SERVER_URL}/audio/${msg.attachments[0]?.name}`"
              />
              <MessangerImageMessage
                v-else-if="msg.attachments[0]?.type === 'image'"
                :images="msg.attachments.map((msg) => `${Constants.SERVER_URL}/media/${msg?.name}`)"
                @open="onOpenImage"
              />
            </div>
          </template>
        </QChatMessage>
      </QInfiniteScroll>
    </QScrollArea>
    <MessangerInput v-if="currentChatId" class="q-ma-sm" />
  </div>
</template>

<script setup lang="ts">
import type { QScrollArea } from 'quasar';
import { MessangerInput, MessangerVoiceMessage, MessangerImageMessage } from '~/messanger';
import UserAvatar from '~/UserAvatar.vue';
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useChatStore } from '@/stores';
import { MessangerService } from '@/api/services';
import { Time, Constants } from '@/util';

const emit = defineEmits<{
  (event: 'open-modal', name: 'open-image'): void;
  (event: 'open-image', link: string): void;
}>();

const limit = 10;
const { user, currentTheme, modalCall } = storeToRefs(useStore());
const chatStore = useChatStore();
const { currentChat, currentChatId, chats } = storeToRefs(chatStore);
const dialogRef = ref<QScrollArea | null>(null);
const loading = ref(false);
const messages = computed(() => currentChat.value?.messages || []);
const initialIndex = computed(() => (messages.value.length > limit ? Math.ceil(messages.value.length / limit) : 0));

watch(
  () => currentChat.value?.total,
  () => {
    const scroll = dialogRef.value?.getScroll();
    setTimeout(() => dialogRef.value?.setScrollPosition('vertical', scroll?.verticalSize || 0), 0);
  }
);

async function deleteChat() {
  await MessangerService.deleteChat(currentChatId.value!);
  chats.value.delete(currentChatId.value!);
  currentChatId.value = null;
}

function onOpenImage(link: string) {
  emit('open-modal', 'open-image');
  emit('open-image', link);
}

async function onLoad(index: number, done: (stop?: boolean | undefined) => void) {
  if (currentChat.value && currentChat.value.total > messages.value.length) {
    loading.value = true;
    await chatStore.onOpenChat(currentChatId.value!, index, limit);
    loading.value = false;
    return done();
  }
  done(true);
}

function openCallModal() {
  modalCall.value.visible = true;
  modalCall.value.props.call = 'outgoing';
  modalCall.value.props.chat_id = currentChatId.value!;
}
</script>

<style scoped lang="scss">
.dialog {
  flex-basis: 80%;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

  & .dialog_content {
    flex: 1 1 auto;
    padding: 0 10px;
  }
}

.void {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: $indigo;
  font-size: 1.3em;
}

.dialog_dark {
  & .dialog_name {
    background-color: $blue-grey-10;
  }
}

.dialog_light {
  & .dialog_name {
    background-color: $blue-grey-1;
  }
}

.msg {
  max-width: 200px;
  width: 200px;
  display: inline-block;
}
</style>

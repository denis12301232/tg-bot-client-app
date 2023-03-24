<template>
  <div :class="['group', currentTheme === 'dark' ? 'group_dark' : 'group_light']">
    <QItem class="q-mb-sm group_title">
      <QItemSection avatar>
        <QBtn icon="arrow_back" color="grey-7" dense round flat @click="currentChatId = ''" />
      </QItemSection>
      <QItemSection avatar>
        <UserAvatar
          class="cursor-pointer"
          :name="currentChat?.group.title"
          :avatar="currentChat?.group.avatar"
          @click="emit('open-modal', 'group-info')"
        />
      </QItemSection>
      <QItemSection>
        <QItemLabel class="text-h6 text-cut">{{ currentChat?.group.title }}</QItemLabel>
        <QItemLabel class="text-cut" caption>
          <div v-if="!Object.values(currentChat?.typing || {}).at(0)">{{ currentChat?.members_count }} участников</div>
          <div v-else>
            <QSpinnerDots size="1rem" />
            {{ Object.values(currentChat?.typing || {}).at(0) + ' печатает' }}
          </div>
        </QItemLabel>
      </QItemSection>
      <QItemSection class="group_buttons" side>
        <QBtn v-if="hasAdminRights" icon="person_add" dense round flat @click="emit('open-modal', 'add-user')" />
        <QBtnDropdown dropdown-icon="more_vert" rounded dense flat>
          <QList bordered>
            <QItem v-ripple v-close-popup clickable @click="emit('open-modal', 'group-info')">
              <QItemSection avatar class="q-pr-sm" style="min-width: 0">
                <QIcon color="primary" name="info" />
              </QItemSection>
              <QItemSection>Информация о группе</QItemSection>
            </QItem>
            <QItem v-if="hasAdminRights" v-ripple v-close-popup clickable @click="emit('open-modal', 'group-settings')">
              <QItemSection avatar class="q-pr-sm" style="min-width: 0">
                <QIcon color="primary" name="settings" />
              </QItemSection>
              <QItemSection>Настройки</QItemSection>
            </QItem>
            <QItem v-ripple v-close-popup clickable @click="leaveGroup">
              <QItemSection avatar class="q-pr-sm" style="min-width: 0">
                <QIcon name="logout" color="red" />
              </QItemSection>
              <QItemSection>Покинуть группу</QItemSection>
            </QItem>
          </QList>
        </QBtnDropdown>
      </QItemSection>
    </QItem>
    <div class="void" v-if="!messages.length">Здесь пусто...</div>
    <QScrollArea class="group_content" v-else ref="dialogRef" delay="1200" :thumb-style="{ width: '7px' }">
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
          <template #name>
            <div class="text-bold text-deep-orange">{{ msg.author === user._id ? 'Я' : getAuthor(msg)?.name }}</div>
          </template>
          <template #avatar>
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
import type { IMessage } from '@/types';
import { MessangerInput, MessangerVoiceMessage, MessangerImageMessage } from '~/messanger';
import UserAvatar from '~/UserAvatar.vue';
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useChatStore } from '@/stores';
import { MessangerService } from '@/api/services';
import { Time, Constants } from '@/util';

const emit = defineEmits<{
  (event: 'open-modal', name: 'open-image' | 'group-info' | 'add-user' | 'group-settings'): void;
  (event: 'open-image', link: string): void;
}>();

const limit = 10;
const { user, currentTheme } = storeToRefs(useStore());
const socketStore = useChatStore();
const { currentChatId, currentChat, chats } = storeToRefs(socketStore);
const dialogRef = ref<QScrollArea | null>(null);
const loading = ref(false);
const messages = computed(() => currentChat.value?.messages || []);
const initialIndex = computed(() => (messages.value.length > limit ? Math.ceil(messages.value.length / limit) : 0));
const hasAdminRights = computed(() => {
  return currentChat.value?.group.roles.admin.includes(user.value._id);
});

watch(() => currentChat.value?.total,
  () => {
    const scroll = dialogRef.value?.getScroll();
    setTimeout(() => {
      dialogRef.value?.setScrollPosition('vertical', scroll?.verticalSize || 0);
    }, 0);
  }
);

async function leaveGroup() {
  if (currentChatId.value) {
    await MessangerService.deleteChat(currentChatId.value);
    chats.value.delete(currentChatId.value)
    currentChatId.value = null;
  }
}

function getAuthor(msg: IMessage) {
  return msg.author === user.value._id ? user.value : currentChat.value?.users.find((user) => user._id === msg.author)!;
}

function onOpenImage(link: string) {
  emit('open-modal', 'open-image');
  emit('open-image', link);
}

async function onLoad(index: number, done: (stop?: boolean | undefined) => void) {
  if (currentChat.value && currentChat.value.total > messages.value.length) {
    loading.value = true;
    await socketStore.onOpenChat(currentChatId.value!, index, limit);
    loading.value = false;
    return done();
  }
  done(true);
}
</script>

<style scoped lang="scss">
.group {
  flex-basis: 80%;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

  .group_buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  & .group_content {
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

.group_dark {
  & .group_title {
    background-color: $blue-grey-10;
  }
}

.group_light {
  & .group_title {
    background-color: $blue-grey-1;
  }
}

.msg {
  max-width: 200px;
  width: 200px;
}
</style>

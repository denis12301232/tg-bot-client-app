<template>
  <QItem class="header" style="flex-wrap: wrap;">
    <QItemSection avatar>
      <QBtn dense flat round icon="arrow_back" @click="resetCurrentChat" />
    </QItemSection>
    <QItemSection avatar>
      <UserAvatar
        :name="type === 'group' ? currentChat?.group.title : companion?.name"
        :avatar="type === 'group' ? currentChat?.group.avatar : companion?.avatar"
      />
    </QItemSection>
    <QItemSection style="width: 50px">
      <QItemLabel class="text-h6 text-cut">
        {{ type === 'group' ? currentChat?.group.title : companion?.name }}
      </QItemLabel>
      <QItemLabel caption>
        <div v-if="!Object.values(typing || {}).at(0)" class="text-cut">
          {{ type === 'group' ? currentChat?.members_count + ' участников' : companion?.status }}
        </div>
        <div v-else class="text-cut">
          <QSpinnerDots size="1rem" />
          {{ Object.values(currentChat?.typing || {}).at(0) + ' печатает' }}
        </div>
      </QItemLabel>
    </QItemSection>
    <QItemSection side style="display: flex; flex-direction: row; align-items: center">
      <QBtn dense flat round icon="person_add" @click="emit('open-modal', 'modal:group-add-user')" />
      <QBtnDropdown dropdown-icon="more_vert" rounded dense flat>
        <QList separator>
          <QItem v-if="type === 'dialog'" v-ripple v-close-popup class="q-pa-sm" clickable @click="deleteChat">
            <QItemSection avatar class="q-pr-sm" style="min-width: 0">
              <QIcon name="delete" color="red" />
            </QItemSection>
            <QItemSection>Удалить чат</QItemSection>
          </QItem>
          <QItem
            v-if="type === 'group'"
            v-ripple
            v-close-popup
            clickable
            @click="emit('open-modal', 'modal:group-info')"
          >
            <QItemSection avatar class="q-pr-sm" style="min-width: 0">
              <QIcon color="primary" name="info" />
            </QItemSection>
            <QItemSection>Информация о группе</QItemSection>
          </QItem>
          <QItem
            v-if="type === 'group' && isGroupAdmin"
            v-ripple
            v-close-popup
            clickable
            @click="emit('open-modal', 'modal:group-settings')"
          >
            <QItemSection avatar class="q-pr-sm" style="min-width: 0">
              <QIcon color="primary" name="settings" />
            </QItemSection>
            <QItemSection>Настройки</QItemSection>
          </QItem>
          <QItem v-if="type === 'group'" v-ripple v-close-popup clickable @click="leaveGroup">
            <QItemSection avatar class="q-pr-sm" style="min-width: 0">
              <QIcon name="logout" color="red" />
            </QItemSection>
            <QItemSection>Покинуть группу</QItemSection>
          </QItem>
        </QList>
      </QBtnDropdown>
    </QItemSection>
  </QItem>
</template>

<script setup lang="ts">
import type { ChatModal } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useChatStore } from '@/stores';
import MessangerService from '@/api/services/MessangerService';

defineProps<{
  type: 'dialog' | 'group';
}>();
const emit = defineEmits<{
  (event: 'open-modal', component: ChatModal): void;
}>();

const { user } = storeToRefs(useStore());
const { chats, currentChatId, currentChat } = storeToRefs(useChatStore());
const companion = computed(() => currentChat.value?.companion);
const typing = computed(() => currentChat.value?.typing);
const isGroupAdmin = computed(() => currentChat.value?.group.roles.admin.includes(user.value._id));

function resetCurrentChat() {
  currentChatId.value = null;
}

async function deleteChat() {
  await MessangerService.deleteChat(currentChatId.value!);
  chats.value.delete(currentChatId.value!);
  currentChatId.value = null;
}

async function leaveGroup() {
  if (currentChatId.value) {
    await MessangerService.deleteChat(currentChatId.value);
    chats.value.delete(currentChatId.value);
    currentChatId.value = null;
  }
}
</script>

<style scoped lang="scss">
html.dark {
  .header {
    background-color: $blue-grey-10;
  }
}

html.light {
  & .header {
    background-color: $blue-grey-1;
  }
}
</style>

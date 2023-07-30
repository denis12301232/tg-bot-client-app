<template>
  <QItem class="header" style="flex-wrap: wrap">
    <QItemSection avatar>
      <QBtn dense flat round icon="eva-arrow-back" color="primary" @click="resetCurrentChat" />
    </QItemSection>
    <QItemSection avatar>
      <UserAvatar
        class="avatar"
        :name="type === 'group' ? currentChat?.group.title : companion?.name"
        :avatar="type === 'group' ? currentChat?.group.avatar : companion?.avatar"
        @click="type === 'group' && emit('open-modal', 'modal:group-info')"
      />
    </QItemSection>
    <QItemSection style="width: 50px">
      <QItemLabel class="text-h6 text-cut">
        {{ type === 'group' ? currentChat?.group.title : companion?.name }}
      </QItemLabel>
      <QItemLabel caption>
        <div v-if="!Object.values(typing || {}).at(0)" class="text-cut">
          {{ type === 'group' ? currentChat?.members_count + ` ${t('chat.msg.people')}` : companion?.status }}
        </div>
        <div v-else class="text-cut">
          <QSpinnerDots size="1rem" />
          {{ Object.values(currentChat?.typing || {}).at(0) + ' печатает' }}
        </div>
      </QItemLabel>
    </QItemSection>
    <QItemSection side style="display: flex; flex-direction: row; align-items: center">
      <QBtn
        v-if="isGroupAdmin"
        dense
        flat
        round
        color="green"
        icon="eva-person-add-outline"
        @click="emit('open-modal', 'modal:group-add-user')"
      >
        <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('chat.hints.add') }}</QTooltip>
      </QBtn>
      <QBtnDropdown dropdown-icon="eva-more-vertical-outline" color="indigo" rounded dense flat>
        <QList separator>
          <QItem v-if="type === 'dialog'" v-ripple v-close-popup class="q-pa-sm" clickable @click="deleteChat">
            <QItemSection avatar class="q-pr-sm" style="min-width: 0">
              <QIcon name="eva-trash" color="red" />
            </QItemSection>
            <QItemSection>{{ t('chat.menu.leaveChat') }}</QItemSection>
          </QItem>
          <QItem
            v-if="type === 'group'"
            v-ripple
            v-close-popup
            clickable
            @click="emit('open-modal', 'modal:group-info')"
          >
            <QItemSection avatar class="q-pr-sm" style="min-width: 0">
              <QIcon color="primary" name="eva-info-outline" />
            </QItemSection>
            <QItemSection>{{ t('chat.menu.info') }}</QItemSection>
          </QItem>
          <QItem
            v-if="type === 'group' && isGroupAdmin"
            v-ripple
            v-close-popup
            clickable
            @click="emit('open-modal', 'modal:group-settings')"
          >
            <QItemSection avatar class="q-pr-sm" style="min-width: 0">
              <QIcon color="primary" name="eva-settings-outline" />
            </QItemSection>
            <QItemSection>{{ t('chat.menu.settings') }}</QItemSection>
          </QItem>
          <QItem v-if="type === 'group'" v-ripple v-close-popup clickable @click="leaveGroup">
            <QItemSection avatar class="q-pr-sm" style="min-width: 0">
              <QIcon name="eva-log-out-outline" color="primary" />
            </QItemSection>
            <QItemSection>{{ t('chat.menu.leave') }}</QItemSection>
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
import { ChatService } from '@/api/services';
import { useI18nT } from '@/hooks';

defineProps<{
  type: 'dialog' | 'group';
}>();
const emit = defineEmits<{
  'open-modal': [name: ChatModal];
}>();

const { t } = useI18nT();
const { user } = storeToRefs(useStore());
const { chats, currentChatId, currentChat } = storeToRefs(useChatStore());
const companion = computed(() => currentChat.value?.companion);
const typing = computed(() => currentChat.value?.typing);
const isGroupAdmin = computed(() => currentChat.value?.group?.roles?.admin?.includes(user.value?._id || ''));

function resetCurrentChat() {
  currentChatId.value = null;
}

async function deleteChat() {
  await ChatService.deleteChat(currentChatId.value!);
  chats.value.delete(currentChatId.value!);
  currentChatId.value = null;
}

async function leaveGroup() {
  if (currentChatId.value) {
    await ChatService.deleteChat(currentChatId.value);
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

.avatar {
  &:hover {
    cursor: pointer;
    transform: scale(1.01);
  }
}
</style>

<template>
  <div class="row justify-between items-center q-pa-sm">
    <div class="row items-center">
      <div class="q-mr-sm">
        <QBtn dense flat round icon="eva-arrow-back" color="primary" @click="$router.push('/chats')" />
      </div>
      <UserAvatar
        class="avatar q-mr-sm"
        :name="type === 'group' ? currentChat?.group.title : companion?.name"
        :avatar="type === 'group' ? currentChat?.group.avatar : companion?.avatar"
        @click.stop="
          type === 'group'
            ? emit('modal', 'modal:group-info')
            : router.push({ name: 'userId', params: { id: companion?._id } })
        "
      />
      <div>
        <div class="text-h6">
          {{ type === 'group' ? currentChat?.group.title : companion?.name }}
        </div>
        <div v-if="!Object.values(typing || {}).at(0)" class="text-caption">
          {{ type === 'group' ? t('chat.messages.people', currentChat?.members_count || 0) : companion?.status }}
        </div>
        <div v-else class="text-caption">
          <QSpinnerDots size="1rem" />
          {{ Object.values(currentChat?.typing || {}).at(0) + ` ${t('chat.messages.typing')}` }}
        </div>
      </div>
    </div>
    <div>
      <QBtn
        v-if="isGroupAdmin"
        dense
        flat
        round
        color="green"
        icon="eva-person-add-outline"
        @click="emit('modal', 'modal:group-add-user')"
      >
        <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('chat.hints.add') }}</QTooltip>
      </QBtn>
      <QBtnDropdown dropdown-icon="eva-more-vertical-outline" color="indigo" rounded dense flat>
        <QList separator>
          <QItem v-if="type === 'dialog'" v-ripple v-close-popup class="q-pa-sm" clickable @click="deleteChat">
            <QItemSection avatar class="q-pr-sm" style="min-width: 0">
              <QIcon name="eva-trash" color="red" />
            </QItemSection>
            <QItemSection>{{ t('chat.messages.deleteChat') }}</QItemSection>
          </QItem>
          <QItem v-if="type === 'group'" v-ripple v-close-popup clickable @click="emit('modal', 'modal:group-info')">
            <QItemSection avatar class="q-pr-sm" style="min-width: 0">
              <QIcon color="primary" name="eva-info-outline" />
            </QItemSection>
            <QItemSection>{{ t('chat.menu.group.info') }}</QItemSection>
          </QItem>
          <QItem
            v-if="type === 'group' && isGroupAdmin"
            v-ripple
            v-close-popup
            clickable
            @click="emit('modal', 'modal:group-settings')"
          >
            <QItemSection avatar class="q-pr-sm" style="min-width: 0">
              <QIcon color="primary" name="eva-settings-outline" />
            </QItemSection>
            <QItemSection>{{ t('chat.menu.group.tools') }}</QItemSection>
          </QItem>
          <QItem v-if="type === 'group'" v-ripple v-close-popup clickable @click="leaveGroup">
            <QItemSection avatar class="q-pr-sm" style="min-width: 0">
              <QIcon name="eva-log-out-outline" color="primary" />
            </QItemSection>
            <QItemSection>{{ t('chat.menu.group.leave') }}</QItemSection>
          </QItem>
        </QList>
      </QBtnDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Extra, Props } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useSocketStore } from '@/stores';
import { ChatService } from '@/api/services';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

defineProps<Props.Chat.DialogHeader>();
const emit = defineEmits<{ modal: [name: Extra.Chat.ModalName] }>();
const { t } = useI18n();
const router = useRouter();
const { user } = storeToRefs(useStore());
const { chats, currentChatId, currentChat } = storeToRefs(useSocketStore());
const companion = computed(() => currentChat.value?.companion);
const typing = computed(() => currentChat.value?.typing);
const isGroupAdmin = computed(() => currentChat.value?.group?.roles?.admin?.includes(user.value?._id || ''));

function deleteChat() {
  if (currentChatId.value) {
    ChatService.destroy(currentChatId.value)
      .then(() => chats.value.delete(currentChatId.value!))
      .then(() => router.push('/chat'));
  }
}

function leaveGroup() {
  if (currentChatId.value) {
    ChatService.destroy(currentChatId.value)
      .then(() => chats.value.delete(currentChatId.value!))
      .then(() => router.push('/chat'));
  }
}
</script>

<style scoped lang="scss">
.avatar {
  &:hover {
    cursor: pointer;
    transform: scale(1.01);
  }
}
</style>

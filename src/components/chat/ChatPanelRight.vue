<template>
  <div v-if="!currentChatId" class="header"></div>
  <div v-if="!currentChatId" class="full-height column justify-center items-center text-indigo text-bold text-h6">
    {{ t('chat.write.select') }}
  </div>
  <div v-else :class="[$style.container]">
    <Chat.DialogHeader :type="type" @open-modal="onOpenModal" />
    <Chat.DialogMessages :type="type" />
    <Chat.Input />
  </div>
</template>

<script setup lang="ts">
import type { ChatModal, I18n, Langs } from '@/types';
import Chat from '~/chat';
import { computed } from 'vue';
import { useChatStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  (event: 'open-modal', component: ChatModal): void;
}>();

const { t } = useI18n<I18n, Langs>();
const { currentChat, currentChatId } = storeToRefs(useChatStore());
const type = computed(() => currentChat.value?.type || 'dialog');

function onOpenModal(c: ChatModal) {
  emit('open-modal', c);
}
</script>

<style lang="scss" module>
.container {
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>

<style scoped lang="scss">
html.dark {
  .header {
    background-color: $blue-grey-10;
    height: 61px;
  }
}

html.light {
  & .header {
    background-color: $blue-grey-1;
    height: 61px;
  }
}
</style>

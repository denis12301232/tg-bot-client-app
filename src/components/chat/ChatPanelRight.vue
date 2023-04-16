<template>
  <div v-if="!currentChatId" class="full-height row justify-center items-center text-indigo chat_void">
    Выберите, кому вы бы хотели написать
  </div>
  <div v-else :class="[$style.container]">
    <ChatDialogHeader :type="type" @open-modal="onOpenModal" />
    <ChatDialogMessages :type="type" @open-modal="onOpenModal" @open-image="onOpenImage" />
    <ChatInput />
  </div>
</template>

<script setup lang="ts">
import type { ChatModal } from '@/types';
import ChatInput from '~/chat/ChatInput.vue';
import ChatDialogHeader from '~/chat/ChatDialogHeader.vue';
import ChatDialogMessages from '~/chat/ChatDialogMessages.vue';
import { computed } from 'vue';
import { useChatStore } from '@/stores';
import { storeToRefs } from 'pinia';

const emit = defineEmits<{
  (event: 'open-modal', component: ChatModal): void;
  (event: 'open-image', src: string): void;
}>();
const { currentChat, currentChatId } = storeToRefs(useChatStore());
const type = computed(() => currentChat.value?.type || 'dialog');

function onOpenModal(c: ChatModal) {
  emit('open-modal', c);
}

function onOpenImage(src: string) {
  emit('open-image', src);
}
</script>

<style lang="scss" module>
.container {
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>

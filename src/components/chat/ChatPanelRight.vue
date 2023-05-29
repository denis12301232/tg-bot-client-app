<template>
  <div v-if="!currentChatId" class="full-height row justify-center items-center text-indigo text-bold text-h6">
    Выберите, кому вы бы хотели написать
  </div>
  <div v-else :class="[$style.container]">
    <Chat.DialogHeader :type="type" @open-modal="onOpenModal" />
    <Chat.DialogMessages :type="type" />
    <Chat.Input />
  </div>
</template>

<script setup lang="ts">
import type { ChatModal } from '@/types';
import Chat from '~/chat';
import { computed } from 'vue';
import { useChatStore } from '@/stores';
import { storeToRefs } from 'pinia';

const emit = defineEmits<{
  (event: 'open-modal', component: ChatModal): void;
}>();
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

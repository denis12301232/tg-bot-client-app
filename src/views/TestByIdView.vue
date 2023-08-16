<template>
  <ChatLayout>
    <template #left-top="{ setIs }">
      <ChatDialogHeader :type="type" @modal="setIs" />
    </template>
    <template #right-bottom="scope">
      <ChatListSearch v-if="scope.search" v-model="scope.search" />
      <ChatList v-else />
    </template>
    <template #left-bottom>
      <div :class="$style.chat">
        <Chat.DialogMessages :type="type" />
        <Chat.Input />
      </div>
    </template>
  </ChatLayout>
</template>

<script setup lang="ts">
import ChatList from '@/components/chat/ChatList.vue';
import ChatListSearch from '@/components/chat/ChatListSearch.vue';
import ChatLayout from '@/layouts/ChatLayout.vue';
import ChatDialogHeader from '@/components/chat/ChatDialogHeader.vue';
import Chat from '@/components/chat';
import { computed, onBeforeUnmount, watch } from 'vue';
import { useChatStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const router = useRouter();
const { chats, currentChat, currentChatId } = storeToRefs(useChatStore());
const type = computed(() => currentChat.value?.type || 'dialog');

onBeforeUnmount(() => (currentChatId.value = null));

watch(
  () => props.id,
  () => {
    if (chats.value.has(props.id)) {
      currentChatId.value = props.id;
      //ChatService.updateRead(props.id);
    } else {
      router.push('/chat');
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" module>
.chat {
  min-height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
}
</style>

<template>
  <Layout>
    <template #right-top="{ setIs }">
      <DialogHeader :type="type" @modal="setIs" />
    </template>
    <template #left-bottom="scope">
      <ListSearch v-if="scope.search" v-model="scope.search" />
      <List v-else />
    </template>
    <template #right-bottom>
      <div :class="$style.chat">
        <Messages :type="type" />
        <Input />
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { Layout, List, ListSearch, DialogHeader, Messages, Input } from '@/components/chat';
import { computed, onBeforeUnmount, watch } from 'vue';
import { useChatStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ChatService } from '@/api/services';

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
      ChatService.updateRead(props.id);
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

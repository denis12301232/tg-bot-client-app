<template>
  <ChatLayout>
    <template #right-bottom="scope">
      <ChatListSearch v-if="scope.search" v-model="scope.search" />
      <ChatList v-else />
    </template>
    <template #left-bottom>
      <div class="row items-center justify-center fit">Select</div>
    </template>
  </ChatLayout>
</template>

<script setup lang="ts">
import ChatList from '@/components/chat/ChatList.vue';
import ChatListSearch from '@/components/chat/ChatListSearch.vue';
import ChatLayout from '@/layouts/ChatLayout.vue';
</script>

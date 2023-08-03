<template>
  <AlertList v-model="alerts" />
  <LoaderPage :loading="store.isPageLoading" />
  <component :is="$route.meta.layoutComponent" :="$route.meta.layoutProps">
    <QScrollArea
      class="fit"
      :thumb-style="{ width: '7px' }"
      :content-style="{ position: 'relative', overflow: 'hidden' }"
      :content-active-style="{ position: 'relative', overflow: 'hidden' }"
    >
      <RouterView />
    </QScrollArea>
  </component>
</template>

<script setup lang="ts">
import type { IMessage } from './types';
import AlertList from '~/alert/AlertList.vue';
import LoaderPage from '~/LoaderPage.vue';
import { onMounted, watch } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useTelegram } from '@/hooks';
import { ChatAlert } from './models';
import { useRoute } from 'vue-router';

const store = useStore();
const chatStore = useChatStore();
const { isAuth, alerts } = storeToRefs(store);
const { tg, isOpenedFromTg, theme, locale } = useTelegram();
const route = useRoute();

onMounted(() => {
  const el = document.getElementById('loader');
  el && (el.style.cssText = 'display: none');
  localStorage.getItem('token') && store.refresh();
  tg.ready();
  if (isOpenedFromTg) {
    store.theme = theme;
    store.lang = locale;
  }
});

watch(isAuth, () => {
  if (isAuth.value) {
    chatStore.connect();
    chatStore.socket.on('chat:message', showNewMessage);
  } else {
    chatStore.socket.close();
    chatStore.socket.removeListener('chat:message', showNewMessage);
  }
});

function showNewMessage(msg: IMessage) {
  const chat = chatStore.chats.get(msg.chat_id);
  if (chat) {
    const user = msg.author !== store.user?._id ? chat.users.find((user) => user._id === msg.author) : null;
    if (user && route.name !== 'chat') {
      const alert = new ChatAlert(msg, user, chat);
      store.alerts.push(alert);
    }
  }
}
</script>

<style module lang="scss">
.alert {
  top: 55px;
  right: 5px;
}
</style>

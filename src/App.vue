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
import { AlertList } from './components/alert';
import LoaderPage from '~/LoaderPage.vue';
import { onMounted, watch } from 'vue';
import { useStore, useChatStore, useAlertStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useTelegram } from '@/hooks';
import { ChatAlert } from './models';
import { useRoute } from 'vue-router';

const store = useStore();
const chatStore = useChatStore();
const alertStore = useAlertStore();
const { isAuth } = storeToRefs(store);
const { alerts } = storeToRefs(alertStore);
const { tg, isOpenedFromTg, theme, locale } = useTelegram();
const route = useRoute();

onMounted(() => {
  const el = document.getElementById('loader');
  el && (el.style.cssText = 'display: none');
  localStorage.getItem('token') && store.refresh();
  tg.ready();
  if (isOpenedFromTg) {
    store.$patch({ theme: theme, lang: locale });
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
  const chat = chatStore.chats.get(msg.chatId);
  if (chat) {
    const user = msg.author !== store.user?._id ? chat.users.find((user) => user._id === msg.author) : null;
    if (user && route.name !== 'chat') {
      alerts.value.push(new ChatAlert(msg, user, chat));
      alertStore.addNotice(user.name, msg.text);
      alertStore.sendPushNotification(user.name, { body: msg.text, image: new URL('/icon.jpg', import.meta.url).href });
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

<template>
  <BannerOffline />
  <AlertList v-model="alerts" />
  <NoticeList v-model="alertStore.notices" />
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
import type { IMessage, ITask, INotice } from './types';
import { AlertList } from './components/alert';
import NoticeList from '~/notice/NoticeList.vue';
import LoaderPage from '~/LoaderPage.vue';
import BannerOffline from '~/BannerOffline.vue';
import { onMounted, watch } from 'vue';
import { useStore, useSocketStore, useAlertStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useTelegram } from '@/hooks';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useStore();
const socketStore = useSocketStore();
const alertStore = useAlertStore();
const { isAuth } = storeToRefs(store);
const { alerts } = storeToRefs(alertStore);
const { tg, isOpenedFromTg, theme, locale } = useTelegram();
const route = useRoute();

onMounted(() => {
  const el = document.querySelector<HTMLElement>('#loader');
  el && (el.style.cssText = 'display: none');
  localStorage.getItem('token') && store.refresh();
  tg.ready();
  if (isOpenedFromTg) {
    store.$patch({ theme: theme, lang: locale });
  }
});

watch(isAuth, () => {
  if (isAuth.value) {
    socketStore.connect();
    socketStore.socket.on('chat:message', showNewMessage);
    socketStore.socket.on('task:create', showNewTask);
    socketStore.socket.on('notice:new', onNewNotice);
  } else {
    socketStore.socket.close();
    socketStore.socket.removeListener('chat:message', showNewMessage);
    socketStore.socket.removeAllListeners('task:create');
    socketStore.socket.removeListener('notice:new', onNewNotice);
  }
});

function showNewMessage(msg: IMessage) {
  const chat = socketStore.chats.get(msg.chatId);
  if (chat) {
    const user = msg.author !== store.user?._id ? chat.users.find((user) => user._id === msg.author) : null;
    if (user && route.name !== 'chat') {
      alertStore.addNotice(chat.group ? `${user.name} in ${chat.group.title}` : user.name, msg.text);
      alertStore.sendPushNotification(user.name, { body: msg.text, image: new URL('/icon.jpg', import.meta.url).href });
    }
  }
}

function showNewTask(task: ITask) {
  alertStore.addNotice(t('home.menu.notice.newTask'), task.title);
  alertStore.sendPushNotification(t('home.menu.notice.newTask'), { body: task.title });
}

function onNewNotice(n: INotice) {
  alertStore.notices.set(n._id, n);
}
</script>

<style module lang="scss">
.alert {
  top: 55px;
  right: 5px;
}
</style>

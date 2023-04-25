<template>
  <component :is="$route.meta.layoutComponent" :="$route.meta.layoutProps">
    <QScrollArea class="full-height" :thumb-style="{ width: '7px' }" >
      <RouterView />
    </QScrollArea>
  </component>
  <ModalAlert
    :class="$style.alert"
    :type="store.alert.type"
    :message="store.alert.message"
    :visible="store.alert.visible"
    @show="store.alert.visible = !store.alert.visible"
  />
  <LoaderPage :loading="store.isPageLoading" />
  <QDialog v-model="store.modalCall.visible" >
    <ModalCall :="store.modalCall.props"/>
  </QDialog>
</template>

<script setup lang="ts">
import ModalAlert from '~/ModalAlert.vue';
import LoaderPage from '~/LoaderPage.vue';
import ModalCall from '~/ModalCall.vue';
import { onMounted, watch } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { useTelegram } from '@/hooks';

const store = useStore();
const socketStore = useChatStore();
const { tg, isOpenedFromTg, theme } = useTelegram();

onMounted(() => {
  tg.ready();
  isOpenedFromTg && (store.theme = theme);
  localStorage.getItem('token') && store.refresh();
  window.addEventListener('online',  () => console.log('online'));
  window.addEventListener('offline', () => console.log('offline'));
});
watch(() => store.isAuth, () => {
  if (store.isAuth) {
    socketStore.connect();
    socketStore.socket.on('chat:call', (chatId) => {
      store.modalCall.props.chat_id = chatId;
      store.modalCall.visible = true;
      store.modalCall.props.call = 'incoming'
    });
    socketStore.socket.on('chat:call-cancel', () => {
      store.modalCall.visible = false;
    });
  } else {
    socketStore.socket.close();
  }
});
</script>

<style module lang="scss">
.alert {
  top: 55px;
  right: 5px;
}
</style>

<style lang="scss">
html.light {
  & .header {
    background-color: white;
    color: black;
  }
}

html.dark {
  & .header {
    background-color: #121212;
  }
}
</style>

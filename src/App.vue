<template>
  <component :is="$route.meta.layoutComponent" :="$route.meta.layoutProps">
    <QScrollArea class="full-height" :thumb-style="{ width: '7px' }" :content-style="{ height: '100%' }">
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
    <ModalCall :="store.modalCall.props" @close-popup="store.modalCall.visible = false" />
  </QDialog>
</template>

<script setup lang="ts">
import ModalAlert from '~/ModalAlert.vue';
import LoaderPage from '~/LoaderPage.vue';
import ModalCall from '~/ModalCall.vue';
import { onMounted, watch, onBeforeMount } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { useTelegram } from '@/hooks';

const store = useStore();
const socketStore = useChatStore();
const { tg, isOpenedFromTg, theme } = useTelegram();

onBeforeMount(() => {
  const el = document.getElementById('loader');
  el && (el.style.cssText = 'display: none');
});
onMounted(() => {
  tg.ready();
  isOpenedFromTg && (store.theme = theme);
  localStorage.getItem('token') && store.refresh();
  window.addEventListener('online',  () => 'online');
  window.addEventListener('offline', () => 'offline');
});
watch(() => store.isAuth, () => {
  if (store.isAuth) {
    socketStore.connect();
    socketStore.socket.on('rtc:call', async (peer_id, chat_id) => {
      store.modalCall.props.chat_id = chat_id;
      store.modalCall.visible = true;
      store.modalCall.props.call = 'incoming'
    });
    socketStore.socket.on('rtc:call-cancel', () => {
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

<template>
  <component :is="$route.meta.layoutComponent" :="$route.meta.layoutProps">
    <QScrollArea class="full-height" :thumb-style="{ width: '7px' }">
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
  <QDialog v-model="store.modal">
    <component :is="MessangerCall" :user_id="userId" :room-id="socketStore.currentChatId" />
  </QDialog>
</template>

<script setup lang="ts">
import ModalAlert from '~/ModalAlert.vue';
import LoaderPage from '~/LoaderPage.vue';
import { MessangerCall } from '~/messanger';
import { onMounted, watch, onBeforeMount, computed } from 'vue';
import { useStore, useChatStore, } from '@/stores';
import { useTelegram } from '@/hooks';

const store = useStore();
const socketStore = useChatStore();
const { tg, isOpenedFromTg, theme } = useTelegram();
const userId = computed(() => socketStore.currentChat?.companion._id);

onBeforeMount(() => {
  const el = document.getElementById('loader');
  el && (el.style.cssText = 'display: none');
});

onMounted(() => {
  tg.ready();
  if (isOpenedFromTg) {
    store.theme = theme;
  }
  if (localStorage.getItem('token')) {
    store.refresh();
  }
});
watch(() => store.isAuth, () => {
  if (store.isAuth){
    socketStore.connect();
    socketStore.connectPeer(store.user._id, { host: '/', port: 9000 });
  } else {
    socketStore.socket.close();
    socketStore.peer?.destroy();
    socketStore.peer?.disconnect();
  }
});

</script>

<style module lang="scss">
.alert {
  top: 55px;
  right: 5px;
}
</style>

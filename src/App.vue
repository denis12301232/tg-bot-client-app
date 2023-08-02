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
import AlertList from '~/alert/AlertList.vue';
import LoaderPage from '~/LoaderPage.vue';
import { onMounted, watch } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useTelegram } from '@/hooks';

const store = useStore();
const chatStore = useChatStore();
const { isAuth, alerts } = storeToRefs(store);
const { tg, isOpenedFromTg, theme, locale } = useTelegram();

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
  } else {
    chatStore.socket.close();
  }
});
</script>

<style module lang="scss">
.alert {
  top: 55px;
  right: 5px;
}
</style>

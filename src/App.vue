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
import AlertList from '~/AlertList.vue';
import LoaderPage from '~/LoaderPage.vue';
import { onMounted, watch } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { storeToRefs } from 'pinia';

const store = useStore();
const chatStore = useChatStore();
const { isAuth, alerts } = storeToRefs(store);

onMounted(() => {
  const el = document.getElementById('loader');
  el && (el.style.cssText = 'display: none');
  localStorage.getItem('token') && store.refresh();
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

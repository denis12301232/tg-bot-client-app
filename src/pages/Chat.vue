<template>
  <QDialog v-model="modal" :maximized="maximized.includes(component as string)">
    <Suspense>
      <component :is="content?.component" :="content?.props" />
      <template #fallback>
        <QSpinner color="primary" size="40px" />
      </template>
    </Suspense>
  </QDialog>
  <div class="window-height row no-wrap">
    <div :class="[$style.contacts, currentChatId ? $style.hide : $style.not_hide]">
      <ChatLeftPanel @open-modal="onOpenModal" />
    </div>
    <div :class="[$style.dialog, currentChatId ? $style.not_hide : $style.hide]">
      <ChatRightPanel @open-modal="onOpenModal" @open-image="onOpenImage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatModal } from '@/types';
import ChatLeftPanel from '~/chat/ChatPanelLeft.vue';
import ChatRightPanel from '~/chat/ChatPanelRight.vue';
import { ref, shallowRef, watch, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '@/stores';

const { currentChatId } = storeToRefs(useChatStore());
const imgSrc = ref('');
const modal = ref(false);
const component = ref<ChatModal | null>(null);
const content = shallowRef<{ component: ReturnType<typeof defineAsyncComponent>; props?: any } | null>(null);
const maximized = ['modal:group-info', 'modal:group-settings', 'modal:open-image'];

function onOpenModal(c: ChatModal) {
  component.value = c;
  modal.value = true;
}

function onCloseModal() {
  modal.value = false;
}

function onOpenImage(src: string) {
  imgSrc.value = src;
}

watch(component, async () => {
  switch (component.value) {
    case 'modal:group-create':
      content.value = {
        component: defineAsyncComponent(() => import('~/chat/ChatGroupCreate.vue')),
        props: { onCloseModal },
      };
      break;
    case 'modal:group-info':
      content.value = { component: defineAsyncComponent(() => import('~/chat/ChatGroupInfo.vue')) };
      break;
    case 'modal:group-settings':
      content.value = { component: defineAsyncComponent(() => import('~/chat/ChatGroupSettings.vue')) };
      break;
    case 'modal:group-add-user':
      content.value = { component: defineAsyncComponent(() => import('~/chat/ChatGroupAddUser.vue')) };
      break;
    case 'modal:open-image':
      content.value = {
        component: defineAsyncComponent(() => import('~/chat/ChatModalImage.vue')),
        props: { src: imgSrc.value },
      };
  }
});
</script>

<style lang="scss" module>
.contacts {
  min-width: 300px;
  max-width: 20%;
  width: 100%;
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.dialog {
  max-width: 80%;
  width: 100%;
}

@media (max-width: 768px) {
  .hide {
    display: none !important;
  }
  .not_hide {
    display: block;
    max-width: 100%;
  }
}
</style>

<style scoped lang="scss">
:deep(.chat_void) {
  font-size: 1.4em;
  font-weight: bold;
}
</style>

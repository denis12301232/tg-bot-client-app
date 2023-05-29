<template>
  <QDialog v-model="modal" :maximized="maximized.includes(name || '')">
    <component :is="content?.component" :="content?.props" />
  </QDialog>
  <div class="window-height row no-wrap">
    <div :class="[$style.contacts, currentChatId ? $style.hide : $style.not_hide]">
      <Chat.LeftPanel @open-modal="onOpenModal" />
    </div>
    <div :class="[$style.dialog, currentChatId ? $style.not_hide : $style.hide]">
      <Chat.RightPanel @open-modal="onOpenModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatModal } from '@/types';
import Chat from '~/chat';
import { ref, shallowRef, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '@/stores';

type ModalContent = { component: typeof Chat[keyof typeof Chat]; props?: { [name: string]: unknown } };

const { currentChatId } = storeToRefs(useChatStore());
const modal = ref(false);
const name = ref<ChatModal | null>(null);
const content = shallowRef<ModalContent | null>(null);
const maximized = ['modal:group-info', 'modal:group-settings', 'modal:open-image'];

watch(name, () => {
  switch (name.value) {
    case 'modal:group-add-user':
      content.value = { component: Chat.GroupAddUser };
      break;
    case 'modal:group-info':
      content.value = { component: Chat.GroupInfo };
      break;
    case 'modal:group-create':
      content.value = {
        component: Chat.GroupCreate,
        props: { onCloseModal },
      };
      break;
    case 'modal:group-settings':
      content.value = { component: Chat.GroupSettings };
      break;
  }
});

function onOpenModal(n: ChatModal) {
  name.value = n;
  modal.value = true;
}

function onCloseModal() {
  modal.value = false;
}

// import type { ChatModal } from '@/types';
// import ChatLeftPanel from '~/chat/ChatPanelLeft.vue';
// import ChatRightPanel from '~/chat/ChatPanelRight.vue';
// import { ref, shallowRef, watch, defineAsyncComponent } from 'vue';
// import { storeToRefs } from 'pinia';
// import { useChatStore } from '@/stores';

// const { currentChatId } = storeToRefs(useChatStore());
// const imgSrc = ref('');
// const modal = ref(false);
// const component = ref<ChatModal | null>(null);
// const content = shallowRef<{ component: ReturnType<typeof defineAsyncComponent>; props?: any } | null>(null);
// const maximized = ['modal:group-info', 'modal:group-settings', 'modal:open-image'];

// function onOpenModal(c: ChatModal) {
//   component.value = c;
//   modal.value = true;
// }

// function onCloseModal() {
//   modal.value = false;
// }

// function onOpenImage(src: string) {
//   imgSrc.value = src;
// }

// watch(component, async () => {
//   switch (component.value) {
//     case 'modal:group-create':
//       content.value = {
//         component: defineAsyncComponent(() => import('~/chat/ChatGroupCreate.vue')),
//         props: { onCloseModal },
//       };
//       break;
//     case 'modal:group-info':
//       content.value = { component: defineAsyncComponent(() => import('~/chat/ChatGroupInfo.vue')) };
//       break;
//     case 'modal:group-settings':
//       content.value = { component: defineAsyncComponent(() => import('~/chat/ChatGroupSettings.vue')) };
//       break;
//     case 'modal:group-add-user':
//       content.value = { component: defineAsyncComponent(() => import('~/chat/ChatGroupAddUser.vue')) };
//       break;
//     case 'modal:open-image':
//       content.value = {
//         component: defineAsyncComponent(() => import('~/chat/ChatModalImage.vue')),
//         props: { src: imgSrc.value },
//       };
//   }
// });
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

//
<style scoped lang="scss">
// :deep(.chat_void) {
//   font-size: 1.4em;
//   font-weight: bold;
// }
</style>

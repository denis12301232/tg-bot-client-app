<template>
  <QDialog v-model="modal" :maximized="maximized.includes(name || '')">
    <component v-if="content?.component" :is="content.component" :="content?.props" />
  </QDialog>
  <div class="window-height row no-wrap">
    <div :class="[$style.contacts, 'divider', 'left', currentChatId ? $style.hide : $style.not_hide]">
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
import { type Component, ref, shallowRef, watch, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '@/stores';

type ModalContent = { component: Component; props?: { [name: string]: unknown } };

const { currentChatId } = storeToRefs(useChatStore());
const modal = ref(false);
const name = ref<ChatModal | null>(null);
const content = shallowRef<ModalContent | null>(null);
const maximized = ['modal:group-info', 'modal:group-settings', 'modal:open-image'];

onBeforeUnmount(() => (currentChatId.value = null));

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
html.dark {
  .divider {
    border-right: 1px solid #636363;
  }

  .left {
    background-color: $blue-grey-10;
  }
}

html.light {
  .divider {
    border-right: 1px solid #ccc;
  }
  .left {
    background-color: $blue-grey-1;
  }
}
</style>

<template>
  <QDialog v-model="modal.open" :maximized="maximized">
    <component :is="modalComponent.component" :="modalComponent.props" />
  </QDialog>
  <QSplitter
    v-model="splitter"
    :class="$style.splitter"
    :before-class="[$style.splitter_before, currentChatId && $style.hide]"
    :after-class="['overflow-hidden', !currentChatId && $style.hide]"
    :separator-class="$style.splitter_separator"
    disable
  >
    <template #before>
      <Messanger.MessangerChatsList @open-modal="setComponent" />
    </template>
    <template #after>
      <div v-if="!currentChatId" :class="[$style.dialog_not_selected, currentChatId ? $style.hide : $style.not_hide]">
        Выберите, кому вы бы хотели написать
      </div>
      <component
        v-else
        :is="dialog"
        :class="currentChatId ? $style.not_hide : $style.hide"
        @open-modal="setComponent"
        @open-image="onOpenImage"
      />
    </template>
  </QSplitter>
</template>

<script setup lang="ts">
import type { ModalContent } from '@/types';
import * as Messanger from '~/messanger'
import { ref, computed, markRaw, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '@/stores';

const { currentChat, currentChatId } = storeToRefs(useChatStore());
const openedImage = ref('');
const splitter = ref(20);
const modal = reactive({ open: false, content: 'create_group' as ModalContent });
const maximized = computed(() => ['open-image', 'group-settings', 'group-info'].includes(modal.content));
const dialog = computed(() => {
  switch (currentChat.value?.type) {
    case 'group':
      return markRaw(Messanger.MessangerGroup);
    case 'dialog':
      return markRaw(Messanger.MessangerDialog);
  }
});
const modalComponent = computed(() => {
  switch (modal.content) {
    case 'create-group':
      return {
        component: markRaw(Messanger.MessangerFormCreateGroup),
        props: { onClose },
      };
    case 'group-info':
      return {
        component: markRaw(Messanger.MessangerGroupInfo),
        props: {
          chat_id: currentChatId.value,
          avatar: currentChat.value?.group?.avatar,
          name: currentChat.value?.group?.title,
          roles: currentChat.value?.group?.roles,
        },
      };
    case 'add-user':
      return {
        component: markRaw(Messanger.MessangerGroupAddUser),
        props: { chat_id: currentChatId.value },
      };
    case 'open-image':
      return {
        component: markRaw(Messanger.MessangerImage),
        props: { src: openedImage.value },
      };
    case 'group-settings':
      return {
        component: markRaw(Messanger.MessangerGroupSettings),
      };
  }
});

function setComponent(name: ModalContent) {
  modal.open = true;
  modal.content = name;
}

function onOpenImage(link: string) {
  openedImage.value = link;
}

function onClose() {
  modal.open = false;
}
</script>

<style module lang="scss">
.splitter {
  height: 100vh;
}

.splitter_before {
  min-width: 300px;
  overflow: hidden;
}

.dialog_not_selected {
  display: flex !important;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  font-weight: bold;
  font-size: 1.3em;
  color: $indigo;
  text-align: center;
  height: 100%;
}
.not_hide {
  display: block;
  height: 100%;
}

@media (max-width: 768px) {
  .splitter_separator,
  .hide {
    display: none !important;
  }
  .splitter_before {
    min-width: 100%;
  }
}
</style>

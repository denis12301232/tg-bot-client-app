<template>
  <div class="row window-height no-wrap">
    <div :class="[$style.left, $style['col-1'], { [$style.hide]: currentChatId, [$style.fullMax]: !currentChatId }]">
      <div :class="[$style.header, 'row', 'no-wrap', 'items-center', 'q-px-sm', 'header', 'q-pt-md', 'q-pb-sm']">
        <QBtn class="q-mr-sm" icon="eva-menu" flat dense round @click.stop="setVisible(true)" />
        <QInput v-model="search" class="full-width" debounce="500" dense rounded standout clearable label="Search">
          <template #prepend>
            <QIcon name="eva-search" />
          </template>
        </QInput>
      </div>
      <div>
        <QScrollArea
          style="height: calc(100vh - 55px)"
          :thumb-style="{ width: '7px' }"
          :content-style="{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: currentTheme === 'light' ? '#eceff1' : '#263238',
          }"
          :content-active-style="{ position: 'relative', overflow: 'hidden' }"
        >
          <slot name="left-bottom" :search="search" />
        </QScrollArea>
      </div>
    </div>
    <div :class="[$style['col-2'], 'full-width', { [$style.hide]: !currentChatId }]">
      <div :class="[$style.header, 'header']">
        <slot name="right-top" :setIs="setIs" />
      </div>
      <div>
        <slot name="right-bottom" />
      </div>
    </div>
  </div>
  <LeftMenu :visible="visible" @modal="setIs" />
  <QDialog v-model="modal" :maximized="maximized.includes(is)">
    <GroupCreate v-if="is === 'modal:group-create'" @close-modal="setModal" />
    <GroupInfo v-else-if="is === 'modal:group-info'" />
    <GroupSettings v-else-if="is === 'modal:group-settings'" />
    <GroupAddUser v-else-if="is === 'modal:group-add-user'" />
  </QDialog>
</template>

<script setup lang="ts">
import type { Extra } from '@/types';
import { LeftMenu, GroupCreate, GroupInfo, GroupAddUser, GroupSettings } from '@/components/chat';
import { ref } from 'vue';
import { useSocketStore, useStore } from '@/stores';
import { storeToRefs } from 'pinia';

const { currentTheme } = storeToRefs(useStore());
const { currentChatId } = storeToRefs(useSocketStore());
const search = ref('');
const visible = ref(false);
const modal = ref(false);
const is = ref<Extra.Chat.ModalName | null>(null);
const maximized: Array<string | null> = ['modal:group-info', 'modal:group-settings'];

function setVisible(value: boolean) {
  visible.value = value;
}

function setModal() {
  modal.value = !modal.value;
}

function setIs(name: Extra.Chat.ModalName) {
  is.value = name;
  setModal();
  setVisible(false);
}
</script>

<style lang="scss" module>
.col-1 {
  min-height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
}
.col-2 {
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}

.left {
  width: 100%;
  min-width: 300px;
  max-width: 400px;
}

@media (max-width: 768px) {
  .hide {
    display: none;
  }

  .fullMax {
    max-width: 100% !important;
  }
}
</style>

<style lang="scss" scoped>
html.dark {
  .header {
    background-color: $blue-grey-10;
  }

  .divider {
    border-right: 1px solid #636363;
  }
}

html.light {
  & .header {
    background-color: $blue-grey-1;
  }

  .divider {
    border-right: 1px solid #ccc;
  }
}
</style>

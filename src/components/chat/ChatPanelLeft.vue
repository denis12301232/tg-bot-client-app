<template>
  <Transition name="menu">
    <div v-if="menu" class="menu">
      <QCard class="full-height" square>
        <QCardSection class="text-center text-h5">{{ t('chat.menu.left.title') }}</QCardSection>
        <QSeparator />
        <QList class="q-px-sm q-pt-sm">
          <QItem v-ripple clickable tag="a" to="/">
            <QItemSection avatar>
              <QIcon name="eva-home-outline" color="primary" />
            </QItemSection>
            <QItemSection class="text-uppercase">{{ t('chat.menu.left.home') }}</QItemSection>
          </QItem>
          <QItem v-ripple clickable tag="a" to="/account">
            <QItemSection avatar>
              <QIcon name="eva-person-outline" color="primary" />
            </QItemSection>
            <QItemSection class="text-uppercase">{{ t('chat.menu.left.account') }}</QItemSection>
          </QItem>
          <QItem v-ripple v-close-popup clickable @click="emit('openModal', 'modal:group-create')">
            <QItemSection avatar>
              <QIcon name="eva-plus-square-outline" color="primary" />
            </QItemSection>
            <QItemSection class="text-uppercase">{{ t('chat.menu.left.group') }}</QItemSection>
          </QItem>
        </QList>
      </QCard>
    </div>
  </Transition>
  <div class="header row items-center">
    <QInput
      v-model="search"
      class="full-width"
      debounce="300"
      :label="t('chat.search.placeholder')"
      :loading="loading"
      clearable
      hide-bottom-space
      borderless
      square
    >
      <template #prepend>
        <QBtn v-model="menu" round dense flat icon="eva-menu" @click.stop="openMenu" />
      </template>
    </QInput>
  </div>
  <QScrollArea
    class="fit "
    :thumb-style="{ width: '7px' }"
    :content-style="{ position: 'relative', overflow: 'hidden' }"
    :content-active-style="{ position: 'relative', overflow: 'hidden' }"
  >
    <Chat.ListSearch v-show="search" :users="users" @update:search="onUpdateSearch" />
    <Chat.List v-show="!search" />
  </QScrollArea>
</template>

<script setup lang="ts">
import type { IUser, ChatModal } from '@/types';
import Chat from '~/chat';
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import { useFetch } from '@/hooks';
import { ChatService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  openModal: [name: ChatModal];
}>();

const { t } = useI18n();
const menu = ref(false);
const search = ref('');
const {
  request: searchUsers,
  data: users,
  loading,
} = useFetch<IUser[], typeof ChatService.findUsers>(ChatService.findUsers);

onMounted(() => window.addEventListener('click', closeMenu));
onUnmounted(() => window.removeEventListener('click', closeMenu));
watchEffect(() => search.value && searchUsers(search.value));

function openMenu() {
  menu.value = !menu.value;
}

function closeMenu() {
  menu.value = false;
}

function onUpdateSearch(value: string) {
  search.value = value;
}
</script>

<style scoped lang="scss">
.menu {
  max-width: 307px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1000;
}

html.dark {
  .header {
    background-color: $blue-grey-10;
    height: 61px;
  }
}

html.light {
  & .header {
    background-color: $blue-grey-1;
    height: 61px;
  }

  .divider {
    border-right: 1px solid #ccc;
  }
}

.menu-enter-active {
  transition: all 0.3s ease-out;
}

.menu-leave-active {
  transition: all 0.3s ease-out;
}

.menu-enter-from,
.menu-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.divider {
  border-right: 1px solid #636363;
}
</style>

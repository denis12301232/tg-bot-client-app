<template>
  <Transition name="menu">
    <div v-if="menu" class="menu">
      <QCard class="full-height">
        <QCardSection class="text-center text-h5">Меню</QCardSection>
        <QSeparator />
        <QList>
          <QItem v-ripple class="list_item" clickable tag="a" to="/" active-class="active">
            <QItemSection avatar>
              <QIcon name="home" color="primary" />
            </QItemSection>
            <QItemSection>На главную</QItemSection>
          </QItem>
          <QItem v-ripple class="list_item" clickable tag="a" to="/account" active-class="active">
            <QItemSection avatar>
              <QIcon name="account_circle" color="primary" />
            </QItemSection>
            <QItemSection>Аккаунт</QItemSection>
          </QItem>
          <QItem
            v-ripple
            v-close-popup
            class="list_item"
            clickable
            active-class="active"
            @click="emit('openModal', 'modal:group-create')"
          >
            <QItemSection avatar>
              <QIcon name="note_add" color="primary" />
            </QItemSection>
            <QItemSection>Создать группу</QItemSection>
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
      label="Поиск"
      :loading="loading"
      clearable
      hide-bottom-space
      borderless
      square
    >
      <template #prepend>
        <QBtn v-model="menu" round dense flat icon="menu" @click.stop="openMenu" />
      </template>
    </QInput>
  </div>
  <QScrollArea class="fit divider" :thumb-style="{ width: '7px' }">
    <ChatUserSearchList v-if="search" :users="users" @update:search="onUpdateSearch" />
    <ChatsList v-else />
  </QScrollArea>
</template>

<script setup lang="ts">
import type { IUser, ChatModal } from '@/types';
import ChatsList from '~/chat/ChatsList.vue';
import ChatUserSearchList from '~/chat/ChatUserSearchList.vue';
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import { useFetch } from '@/hooks';
import { MessangerService } from '@/api/services';

const emit = defineEmits<{
  (event: 'openModal', component: ChatModal): void;
}>();
const menu = ref(false);
const search = ref('');
const { f: onSearch, data: users, loading } = useFetch<IUser[]>({ fn: MessangerService.findUsers });

onMounted(() => window.addEventListener('click', closeMenu));
onUnmounted(() => window.removeEventListener('click', closeMenu));
watchEffect(() => search.value && onSearch(search.value));

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

.divider {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
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
</style>

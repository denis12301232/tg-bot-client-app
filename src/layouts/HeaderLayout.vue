<template>
  <QLayout view="hhh lpR fFf">
    <QHeader class="header" v-if="!isOpenedFromTg" reveal elevated>
      <QToolbar>
        <QBtn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <QToolbarTitle class="text-indigo text-h5">Kharkov Volonteer</QToolbarTitle>
        <QBtn
          :icon="store.currentTheme === 'dark' ? 'light_mode' : 'dark_mode'"
          style="margin-right: 5px"
          dense
          flat
          round
          color="yellow-7"
          @click="store.setTheme"
        />
        <QBtn v-if="!store.isAuth" color="primary" label="Вход" @click="openLogin" />
        <QBtn v-else icon="account_circle" dense flat round @click="toggleRightDrawer" />
      </QToolbar>
    </QHeader>
    <QDrawer v-model="leftDrawerOpen" side="left" overlay bordered>
      <QList class="list">
        <QItem class="list_item" v-ripple clickable tag="a" to="/" active-class="active">
          <QItemSection avatar>
            <QIcon name="note_add" color="primary" />
          </QItemSection>
          <QItemSection>Внести данные</QItemSection>
        </QItem>
        <QItem class="list_item" v-if="store.isAdmin" v-ripple clickable tag="a" to="/list" active-class="active">
          <QItemSection avatar>
            <QIcon name="format_list_numbered" color="primary" />
          </QItemSection>
          <QItemSection>Полный список</QItemSection>
        </QItem>
        <QItem class="list_item" v-if="store.isAdmin" v-ripple clickable tag="a" to="/info" active-class="active">
          <QItemSection avatar>
            <QIcon name="question_mark" color="primary" />
          </QItemSection>
          <QItemSection>Информация по человеку</QItemSection>
        </QItem>
        <QItem class="list_item" v-ripple clickable tag="a" to="/gallery" active-class="active">
          <QItemSection avatar>
            <QIcon name="collections" color="primary" />
          </QItemSection>
          <QItemSection>Галлерея</QItemSection>
        </QItem>
        <QItem class="list_item" v-if="store.isAuth" v-ripple clickable tag="a" to="/messanger" active-class="active">
          <QItemSection avatar>
            <QIcon name="chat" color="primary" />
          </QItemSection>
          <QItemSection>Мессенджер</QItemSection>
        </QItem>
        <QItem class="list_item" v-if="store.isAuth" v-ripple clickable tag="a" to="/task" active-class="active">
          <QItemSection avatar>
            <QIcon name="fact_check" color="primary" />
          </QItemSection>
          <QItemSection>Задачи</QItemSection>
        </QItem>
        <QItem class="list_item" v-if="store.isAuth" v-ripple clickable tag="a" to="/meet" active-class="active">
          <QItemSection avatar>
            <QIcon name="groups" color="primary" />
          </QItemSection>
          <QItemSection>Встречи</QItemSection>
        </QItem>
        <QItem class="list_item" v-if="store.isAdmin" v-ripple clickable tag="a" to="/stats" active-class="active">
          <QItemSection avatar>
            <QIcon name="percent" color="primary" />
          </QItemSection>
          <QItemSection>Статистика</QItemSection>
        </QItem>
      </QList>
    </QDrawer>
    <QDrawer v-if="store.isAuth" v-model="rightDrawerOpen" side="right" overlay bordered>
      <QCard class="user_info" square flat>
        <QCardSection>
          <QItem class="q-pa-none">
            <QItemSection top avatar>
              <UserAvatar :name="store.user.name" :avatar="store.user.avatar" />
            </QItemSection>
            <QItemSection>
              <QItemLabel>{{ store.user.name }}</QItemLabel>
              <QItemLabel caption>{{ store.user.status }}</QItemLabel>
            </QItemSection>
          </QItem>
        </QCardSection>
      </QCard>
      <QList class="list">
        <QItem class="list_item" v-ripple clickable tag="a" to="/account" active-class="active">
          <QItemSection avatar>
            <QIcon name="manage_accounts" color="primary" />
          </QItemSection>
          <QItemSection>Аккаунт</QItemSection>
        </QItem>
        <QItem class="list_item" v-if="store.isAdmin" v-ripple clickable tag="a" to="/tools" active-class="active">
          <QItemSection avatar>
            <QIcon name="settings" color="primary" />
          </QItemSection>
          <QItemSection>Настройки</QItemSection>
        </QItem>
        <QItem
          class="list_item"
          v-ripple
          clickable
          active-class="active"
          @click="[store.logout(), toggleRightDrawer()]"
        >
          <QItemSection avatar>
            <QIcon name="logout" color="primary" />
          </QItemSection>
          <QItemSection>Выйти</QItemSection>
        </QItem>
      </QList>
    </QDrawer>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import UserAvatar from '~/UserAvatar.vue';
import { ref, provide } from 'vue';
import { useStore } from '@/stores';
import { useTelegram } from '@/hooks';

const store = useStore();
const { isOpenedFromTg } = useTelegram();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const loginModal = ref(false);

provide('loginModal', loginModal);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

function openLogin() {
  loginModal.value = true;
}
</script>

<style lang="scss" scoped>
.list {
  padding: 5px;
  margin-top: 5px;

  & .list_item {
    font-size: 1.2em;

    &:hover {
      color: $primary !important;
    }

    &:visited {
      color: inherit;
    }
  }
}

.user_info {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px !important;

  & .user_name {
    margin: 5px 0 0 5px;
    font-size: 1.2em;
    line-height: 1.2em;
  }

  & .user_status {
    font-style: italic;
    margin-left: 5px;
    color: rgb(129, 129, 134);
  }
}

.active {
  color: $primary !important;
  background-color: rgba(44, 44, 143, 0.241);
}
</style>

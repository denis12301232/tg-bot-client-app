<template>
  <QLayout view="hHh LpR fFf">
    <QHeader reveal elevated class="header" height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-menu" @click="toggleLeftDrawer" />
        <QToolbarTitle>
          <QAvatar>
            <img :src="icon" />
          </QAvatar>
          Kharkov Volonteer
        </QToolbarTitle>
        <QBtn
          :icon="store.currentTheme === 'dark' ? 'eva-sun-outline' : 'eva-moon-outline'"
          dense
          flat
          round
          color="yellow"
          @click="store.setTheme()"
        />
        <QBtn v-if="!store.isAuth" label="Вход" color="red-10" @click="$router.push('/login')" />
        <QBtn v-else dense flat round icon="eva-person" @click="toggleRightDrawer" />
      </QToolbar>
      <QTabs align="left" active-color="red-10">
        <QRouteTab to="/" label="Заполнить форму" />
        <QRouteTab v-if="store.isAdmin" to="/list" label="Список" />
        <QRouteTab v-if="store.isAdmin" to="/info" label="Поиск" />
      </QTabs>
    </QHeader>
    <QDrawer v-model="leftDrawerOpen" side="left" bordered>
      <QList class="q-pa-sm text-uppercase">
        <QItem v-ripple clickable tag="a" to="/gallery">
          <QItemSection avatar>
            <QIcon color="red-10" name="eva-image" />
          </QItemSection>
          <QItemSection>Галерея</QItemSection>
        </QItem>
        <QItem v-if="store.isAuth" v-ripple clickable tag="a" to="/chat">
          <QItemSection avatar>
            <QIcon color="red-10" name="eva-message-circle" />
          </QItemSection>
          <QItemSection>Чат</QItemSection>
        </QItem>
        <QItem v-if="store.isAuth" v-ripple clickable tag="a" to="tasks">
          <QItemSection avatar>
            <QIcon color="red-10" name="eva-checkmark-circle" />
          </QItemSection>
          <QItemSection>Задачи</QItemSection>
        </QItem>
        <QItem v-if="store.isAuth" v-ripple clickable tag="a" to="/meets">
          <QItemSection avatar>
            <QIcon color="red-10" name="eva-people-outline" />
          </QItemSection>
          <QItemSection>Встречи</QItemSection>
        </QItem>
        <QItem v-if="store.isAdmin" v-ripple clickable tag="a" to="/stats">
          <QItemSection avatar>
            <QIcon color="red-10" name="eva-percent-outline" />
          </QItemSection>
          <QItemSection>Статистика</QItemSection>
        </QItem>
      </QList>
    </QDrawer>
    <QDrawer v-model="rightDrawerOpen" side="right" bordered>
      <QCard class="user_info" square flat>
        <QCardSection>
          <QItem class="q-pa-none">
            <QItemSection top avatar>
              <UserAvatar :name="store.user?.name" :avatar="store.user?.avatar" size="50px" />
            </QItemSection>
            <QItemSection>
              <QItemLabel>{{ store.user?.name }}</QItemLabel>
              <QItemLabel caption>{{ store.user?.status }}</QItemLabel>
            </QItemSection>
          </QItem>
        </QCardSection>
      </QCard>
      <QSeparator />
      <QList class="q-pa-sm text-uppercase">
        <QItem v-ripple clickable tag="a" to="/account">
          <QItemSection avatar>
            <QIcon color="red-10" name="eva-person" />
          </QItemSection>
          <QItemSection>Аккаунт</QItemSection>
        </QItem>
        <QItem v-if="store.isAdmin" v-ripple clickable tag="a" to="/tools">
          <QItemSection avatar>
            <QIcon color="red-10" name="eva-settings-outline" />
          </QItemSection>
          <QItemSection>Настройки</QItemSection>
        </QItem>
        <QItem v-ripple clickable @click="[store.logout(), toggleRightDrawer()]">
          <QItemSection avatar>
            <QIcon color="red-10" name="eva-log-out" />
          </QItemSection>
          <QItemSection>Выход</QItemSection>
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
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '@/stores';

const icon = new URL('../../public/favicon.ico', import.meta.url).href;
const store = useStore();
const route = useRoute();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const modal = ref(false);

watch([() => route.name], () => {
  if (route.name === 'login' || route.name === 'registration') {
    modal.value = true;
  }
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
</script>

<style lang="scss" module></style>

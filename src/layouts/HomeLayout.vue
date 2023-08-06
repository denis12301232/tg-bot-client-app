<template>
  <QLayout view="hHh LpR fFf">
    <QHeader v-if="!isOpenedFromTg" reveal elevated class="header" height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-menu" @click="toggleLeftDrawer" />
        <QToolbarTitle>
          <QAvatar>
            <img :src="icon" />
          </QAvatar>
          {{ ENV.TITLE }}
        </QToolbarTitle>
        <SetLang />
        <QBtn
          :icon="store.currentTheme === 'dark' ? 'eva-sun-outline' : 'eva-moon-outline'"
          dense
          flat
          round
          color="yellow"
          @click="store.setTheme()"
        />
        <QBtn v-if="!store.isAuth" dense flat round icon="eva-log-in-outline" @click="$router.push('/login')" />
        <QBtn v-else dense flat round icon="eva-person" @click="toggleRightDrawer" />
      </QToolbar>
      <QTabs :class="$style.tabs" align="left" active-color="primary">
        <QRouteTab to="/" :label="t('home.tabs.form')" />
        <QRouteTab v-if="store.isAdmin" to="/list" :label="t('home.tabs.list')" />
        <QRouteTab v-if="store.isAdmin" to="/info" :label="t('home.tabs.search')" />
      </QTabs>
    </QHeader>
    <QDrawer v-model="leftDrawerOpen" side="left" bordered>
      <QCard square flat>
        <QCardSection>
          <h6 class="text-center">{{ t('home.menu.left.title') }}</h6>
        </QCardSection>
      </QCard>
      <QSeparator></QSeparator>
      <QList class="q-pa-sm text-uppercase">
        <template :class="$style.list">
          <QItem v-ripple clickable tag="a" to="/">
            <QItemSection avatar>
              <QIcon color="primary" name="eva-home-outline" />
            </QItemSection>
            <QItemSection>{{ t('home.tabs.form') }}</QItemSection>
          </QItem>
          <QItem v-if="store.isAdmin" v-ripple clickable tag="a" to="/list">
            <QItemSection avatar>
              <QIcon color="primary" name="eva-list-outline" />
            </QItemSection>
            <QItemSection>{{ t('home.tabs.list') }}</QItemSection>
          </QItem>
          <QItem v-if="store.isAdmin" v-ripple clickable tag="a" to="/info">
            <QItemSection avatar>
              <QIcon color="primary" name="eva-search-outline" />
            </QItemSection>
            <QItemSection>{{ t('home.tabs.search') }}</QItemSection>
          </QItem>
        </template>
        <QItem v-ripple clickable tag="a" to="/gallery">
          <QItemSection avatar>
            <QIcon color="primary" name="eva-image-outline" />
          </QItemSection>
          <QItemSection>{{ t('home.menu.left.gallery') }}</QItemSection>
        </QItem>
        <QItem v-if="store.isAuth" v-ripple clickable tag="a" to="/chat">
          <QItemSection avatar>
            <QIcon color="primary" name="eva-message-circle-outline">
              <QBadge v-show="unread" color="positive" floating rounded>{{ unread }}</QBadge>
            </QIcon>
          </QItemSection>
          <QItemSection>{{ t('home.menu.left.chat') }}</QItemSection>
        </QItem>
        <QItem v-if="store.isAuth" v-ripple clickable tag="a" to="tasks">
          <QItemSection avatar>
            <QIcon color="primary" name="eva-checkmark-circle-outline" />
          </QItemSection>
          <QItemSection>{{ t('home.menu.left.tasks') }}</QItemSection>
        </QItem>
        <QItem v-if="store.isAuth" v-ripple clickable tag="a" to="/meets">
          <QItemSection avatar>
            <QIcon color="primary" name="eva-people-outline" />
          </QItemSection>
          <QItemSection>{{ t('home.menu.left.meets') }}</QItemSection>
        </QItem>
        <QItem v-if="store.isAdmin" v-ripple clickable tag="a" to="/stats">
          <QItemSection avatar>
            <QIcon color="primary" name="eva-percent-outline" />
          </QItemSection>
          <QItemSection>{{ t('home.menu.left.stats') }}</QItemSection>
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
            <QIcon color="primary" name="eva-person-outline" />
          </QItemSection>
          <QItemSection>{{ t('home.menu.right.account') }}</QItemSection>
        </QItem>
        <QItem v-if="store.isAdmin" v-ripple clickable tag="a" to="/tools">
          <QItemSection avatar>
            <QIcon color="primary" name="eva-settings-outline" />
          </QItemSection>
          <QItemSection>{{ t('home.menu.right.tools') }}</QItemSection>
        </QItem>
        <QItem v-ripple clickable @click="[store.logout(), toggleRightDrawer(), $router.push('/')]">
          <QItemSection avatar>
            <QIcon color="primary" name="eva-log-out-outline" />
          </QItemSection>
          <QItemSection>{{ t('home.menu.right.logout') }}</QItemSection>
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
import SetLang from '~/SetLang.vue';
import { ref } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { useTelegram } from '@/hooks';
import { ENV } from '@/util';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const icon = new URL('/icon.jpg', import.meta.url).href;
const { t } = useI18n();
const { isOpenedFromTg } = useTelegram();
const store = useStore();
const { unread } = storeToRefs(useChatStore());
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
</script>

<style lang="scss" module>
.list {
  display: none;
}
@media (max-width: 600px) {
  .tabs {
    display: none;
  }

  .list {
    display: block;
  }
}
</style>

<template>
  <QLayout view="hHh LpR fFf">
    <QHeader v-if="!isOpenedFromTg" reveal elevated class="header" height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-menu" @click="toggleDrawer('left')" />
        <QToolbarTitle>
          <QAvatar>
            <img src="icon.jpg" />
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
        <QBtn
          v-if="store.isAuth"
          :icon="muted ? 'eva-bell-off' : 'eva-bell'"
          color="deep-orange"
          dense
          flat
          round
          @click="[toggleDrawer('right'), setIs('notices')]"
        >
          <QBadge v-if="notices.length" color="positive" floating rounded>{{ notices.length }}</QBadge>
        </QBtn>
        <QBtn v-if="!store.isAuth" dense flat round icon="eva-log-in-outline" @click="$router.push('/login')" />
        <QBtn v-else dense flat round icon="eva-person" @click="[toggleDrawer('right'), setIs('menu')]" />
      </QToolbar>
      <QTabs :class="$style.tabs" align="left" active-color="primary">
        <QRouteTab to="/" :label="t('home.tabs.form')" />
        <QRouteTab v-if="store.isAdmin" to="/list" :label="t('home.tabs.list')" />
        <QRouteTab v-if="store.isAdmin" to="/info" :label="t('home.tabs.search')" />
      </QTabs>
    </QHeader>
    <QDrawer v-model="drawers.left" side="left" bordered>
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
    <QDrawer v-model="drawers.right" side="right" bordered>
      <template v-if="is === 'menu'">
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
          <QItem v-ripple clickable @click="[store.logout(), toggleDrawer('right'), $router.push('/')]">
            <QItemSection avatar>
              <QIcon color="primary" name="eva-log-out-outline" />
            </QItemSection>
            <QItemSection>{{ t('home.menu.right.logout') }}</QItemSection>
          </QItem>
        </QList>
      </template>

      <NoticesList v-else :notices="notices" />
    </QDrawer>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import UserAvatar from '~/UserAvatar.vue';
import SetLang from '~/SetLang.vue';
import NoticesList from '~/NoticesList.vue';
import { reactive, ref } from 'vue';
import { useStore, useChatStore, useAlertStore } from '@/stores';
import { useTelegram } from '@/hooks';
import { ENV } from '@/util';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { isOpenedFromTg } = useTelegram();
const store = useStore();
const { unread } = storeToRefs(useChatStore());
const { notices, muted } = storeToRefs(useAlertStore());
const drawers = reactive({ right: false, left: false });
const is = ref<'menu' | 'notices'>('menu');

function toggleDrawer(drawer: keyof typeof drawers) {
  drawers[drawer] = !drawers[drawer];
}

function setIs(name: typeof is.value) {
  is.value = name;
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

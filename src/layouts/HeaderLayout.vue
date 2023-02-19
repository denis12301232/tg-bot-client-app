<template lang="pug">
QLayout(:class="store.currentTheme === 'dark' ? 'dark' : 'light'" view="hhh lpR fFf")
   QHeader(v-if="!openFromTg" class="header" reveal elevated)
      QToolbar
         QBtn(dense flat round icon="menu" @click="toggleLeftDrawer")
         QToolbarTitle Kharkov Volonteer
         QBtn(
            :icon="store.currentTheme === 'dark' ? 'light_mode':  'dark_mode'"
            style="margin-right: 5px;"
            dense
            flat
            round
            @click="store.setTheme" 
            )
         QBtn(v-if="!store.isAuth" color="primary" @click="emit('openLogin')") Вход 
         QBtn(v-else icon="account_circle" dense flat round @click="toggleRightDrawer")
   QDrawer(v-model="leftDrawerOpen" side="left" overlay bordered)
      QList(class="list")
         QItem(class="list_item" v-ripple clickable tag="a" to="/" active-class="active")
            QItemSection(avatar)
               QIcon(name="note_add")
            QItemSection Внести данные
         QItem(v-if="store.isAdmin" class="list_item" v-ripple clickable tag="a" to="/list" active-class="active")
            QItemSection(avatar)
               QIcon(name="format_list_numbered")
            QItemSection Полный список
         QItem(v-if="store.isAdmin" class="list_item" v-ripple clickable tag="a" to="/info" active-class="active")
            QItemSection(avatar)
               QIcon(name="question_mark")
            QItemSection Информация по человеку   
         QItem(class="list_item" v-ripple clickable tag="a" to="/gallery" active-class="active")
            QItemSection(avatar)
               QIcon(name="collections")
            QItemSection Галлерея
         QItem(v-if="store.isAuth" class="list_item" v-ripple clickable tag="a" to="/messanger" active-class="active")
            QItemSection(avatar)
               QIcon(name="chat")
            QItemSection Мессенджер
         QItem(v-if="store.isAuth" class="list_item" v-ripple clickable tag="a" to="/task" active-class="active")
            QItemSection(avatar)
               QIcon(name="fact_check")
            QItemSection Задачи  
   QDrawer(v-if="store.isAuth" v-model="rightDrawerOpen" side="right" overlay bordered)
      QCard(class="user_info" square flat)
         QCardSection
            QItem(style="padding: 0")
               QItemSection(top avatar)
                  UserAvatar(:name="store.user.name" :avatar="store.user.avatar")
               QItemSection
                  QItemLabel {{ store.user.name }}
                  QItemLabel(caption) {{ store.user.status }}
      QList(class="list")
         QItem(class="list_item" v-ripple clickable tag="a" to="/account" active-class="active")
            QItemSection(avatar)
               QIcon(name="manage_accounts")
            QItemSection Аккаунт
         QItem(v-if="store.isAdmin" class="list_item" v-ripple clickable tag="a" to="/tools" active-class="active")
            QItemSection(avatar)
               QIcon(name="settings")
            QItemSection Настройки
         QItem(class="list_item" v-ripple clickable @click="[store.logout(), toggleRightDrawer()]" active-class="active")
            QItemSection(avatar)
               QIcon(name="logout")
            QItemSection Выйти
   QPageContainer
      slot
      slot(name="form")
</template>

<script setup lang="ts">
import UserAvatar from '~/UserAvatar.vue'
import { ref } from 'vue'
import { useStore } from '@/stores'


withDefaults(defineProps<{
   openFromTg?: boolean;
}>(), { openFromTg: false });
const emit = defineEmits<{
   (event: 'openLogin'): void;
}>();

const store = useStore();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

function toggleLeftDrawer() {
   leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleRightDrawer() {
   rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>

<style lang="scss" scoped>
.light {
   & .header {
      background-color: white;
      color: black;
   }
}

.dark {
   & .header {
      background-color: #121212;
   }
}

.list {
   padding: 5px;
   margin-top: 5px;

   & .list_item {
      font-size: 1.2em;

      &:hover {
         color: $secondary !important;
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
   color: $secondary !important;
}
</style>
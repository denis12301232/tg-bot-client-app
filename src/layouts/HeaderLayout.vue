<template lang="pug">
q-layout(:class="store.currentTheme === 'dark' ? 'dark' : 'light'" view="hhh lpR fFf")
   q-header(class="header" reveal elevated)
      q-toolbar
         q-btn(dense flat round icon="menu" @click="toggleLeftDrawer")
         q-toolbar-title Kharkov Volonteer
         q-btn(round @click="store.setTheme" dense flat :icon="store.currentTheme === 'dark' ? 'light_mode':  'dark_mode'")
         q-btn(v-if="!store.isAuth" @click="emit('openLogin')") Вход 
         q-btn(v-else dense flat round icon="account_circle" @click="toggleRightDrawer")
   q-drawer(v-model="leftDrawerOpen" side="left" overlay bordered)
      QList(class="list")
         q-item(class="list_item" clickable v-ripple tag="a" to="/" active-class="active")
            q-item-section(avatar)
               QIcon(name="note_add")
            q-item-section Внести данные
         q-item(class="list_item" clickable v-ripple tag="a" to="/list" active-class="active")
            q-item-section(avatar)
               QIcon(name="format_list_numbered")
            q-item-section Полный список
         q-item(class="list_item" clickable v-ripple tag="a" to="/info" active-class="active")
            q-item-section(avatar)
               QIcon(name="question_mark")
            q-item-section Информация по человеку   
   q-drawer(v-if="store.isAuth" v-model="rightDrawerOpen" side="right" overlay bordered)
      QCard(class="user_info")
         q-card-section
            QAvatar(size="45px" color="secondary") {{ store.user.avatar ? '': store.user.name.slice(0, 1) }}
               img(v-if="store.user.avatar" :src="`${Constants.SERVER_URL}/avatars/${store.user.avatar}`")
            div(class="info_name") {{ store.user.name }}
      QList(class="list")
         q-item(class="list_item" clickable v-ripple tag="a" to="/account" active-class="active")
            q-item-section(avatar)
               QIcon(name="manage_accounts")
            q-item-section Аккаунт
         q-item(class="list_item" clickable v-ripple tag="a" to="/tools" active-class="active")
            q-item-section(avatar)
               QIcon(name="admin_panel_settings")
            q-item-section Настройки
         q-item(class="list_item" clickable v-ripple @click="[store.logout(), toggleRightDrawer()]" active-class="active")
            q-item-section(avatar)
               QIcon(name="logout")
            q-item-section Выйти
   q-page-container
      slot
      slot(name="form")
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/stores'
import { Constants } from '@/util'


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
   & .info_name {
      margin-top: 20px;
      font-size: 1.3em;
      font-weight: bold;
   }
}

.active {
   color: $secondary !important;
}
</style>
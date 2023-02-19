<template lang="pug">
QLayout(:class="store.currentTheme === 'dark' ? 'dark' : 'light'" view="hHh lpR fFf")
   QHeader(class="header" bordered)
      QToolbar
         QBtn(icon="menu" dense flat round @click="toggleLeftDrawer")
         QToolbarTitle Мессенджер
   QDrawer(v-model="leftDrawerOpen" side="left" overlay bordered)
      QList(class="list")
         QCard(class="user_info" square flat)
            QCardSection
               QItem(style="padding: 0")
                  QItemSection(top avatar)
                     UserAvatar(:name="store.user.name" :avatar="store.user.avatar")
                  QItemSection
                     QItemLabel {{ store.user.name }}
                     QItemLabel(caption) {{ store.user.status }}
         QItem(class="list_item" v-ripple clickable tag="a" to="/" active-class="active")
            QItemSection(avatar)
               QIcon(name="home")
            QItemSection На главную
         QItem(class="list_item" v-ripple clickable tag="a" to="/account" active-class="active")
            QItemSection(avatar)
               QIcon(name="account_circle")
            QItemSection Аккаунт
         QItem(
            class="list_item"
            v-ripple 
            clickable 
            active-class="active" 
            @click="[emit('openCreateGroup'), toggleLeftDrawer()]"
            )
            QItemSection(avatar)
               QIcon(name="note_add")
            QItemSection Создать группу
   QPageContainer(style="height: 100vh;")
      slot
</template>

<script setup lang="ts">
import UserAvatar from '~/UserAvatar.vue'
import { ref } from 'vue'
import { useStore } from '@/stores'


const emit = defineEmits<{
   (event: 'openCreateGroup'): void;
}>();
const store = useStore();
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
   leftDrawerOpen.value = !leftDrawerOpen.value
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
   & .user_info {
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px !important;
      padding: 0;
      margin-bottom: 5px;

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

   & .list_item {
      margin: 0 5px;
      font-size: 1.2em;

      &:hover {
         color: $secondary !important;
      }

      &:visited {
         color: inherit;
      }
   }
}
</style>
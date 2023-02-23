<template lang="pug">
div(:class="['group', currentTheme === 'dark' ? 'group_dark' : 'group_light']")
   QItem(class="group_title")
      QItemSection(avatar)
         QBtn(icon="arrow_back" color="grey-7" dense round flat @click="currentChatId = ''")
      QItemSection(avatar)
         UserAvatar(:name="currentChat.group.title" :avatar="currentChat.group.avatar" color="indigo")
      QItemSection
         QItemLabel(class="text-h6") {{ currentChat.group?.title }}
         QItemLabel(caption) {{ currentChat.members_count }} участников 
      QItemSection(class="group_buttons" side)
         QBtn(v-if="hasAdminRights" icon="person_add" dense round flat @click="emit('openModal', 'add_user')")
         QBtn(icon="more_vert" round dense flat)
            QMenu
               QList(bordered)
                  QItem(v-ripple v-close-popup clickable @click="emit('openModal','group_info')")
                     QItemSection(avatar style="padding-right: 10px; min-width: 0;")
                        QIcon(name="info")
                     QItemSection Информация о группе
                  QItem(v-if="hasAdminRights" v-ripple v-close-popup clickable @click="emit('openModal', 'users_rights')")
                     QItemSection(avatar style="padding-right: 10px; min-width: 0;")
                        QIcon(name="people_alt")
                     QItemSection Настроить роли
                  QItem(v-ripple v-close-popup clickable @click="leaveGroup")
                     QItemSection(avatar style="padding-right: 10px; min-width: 0;")
                        QIcon(name="logout" color="red")
                     QItemSection Покинуть группу
   div(v-if="!messages.length" class="void") Здесь пусто...
   QScrollArea(v-else class="group_content" delay="1200" ref="dialogRef" :thumb-style="{width: '7px'}")
      QInfiniteScroll(@load="onLoad" reverse :offset="50" :initial-index="initialIndex")
         template(#loading)
            div(class="row justify-center q-my-md")
               QSpinnerDots(color="primary" name="dots" size="40px")
         QChatMessage(
            v-for="msg in messages" 
            class="msg"
            :text="[msg.text]" 
            :sent="msg.author === user._id",
            :key="msg._id"
            :bg-color="msg.author === user._id ? 'indigo': 'seconary'"
            text-color="white"
            )
            template(#name)
               div(class="msg_name") {{ msg.author === user._id ? 'Я':  getAuthor(msg)?.name }}
            template(#avatar)
               UserAvatar(
                  :name="getAuthor(msg)?.name" 
                  :avatar="getAuthor(msg)?.avatar" 
                  :class="['q-message-avatar', msg.author === user._id ?  'q-message-avatar--sent': 'q-message-avatar--received']"
                  size="30px"
                  )
            template(#stamp)
               div(class="msg_stamp")
                  div(class="msg_time") {{ Time.showFilteredDate(new Date(msg.createdAt)) }}
                  QIcon(v-if="msg.author === user._id" :name="msg.read.length > 1 ? 'mdi-check-all' : 'mdi-check'")
            template(#default v-if="msg.attachments.length")
               MessangerVoiceMessage(
                  v-if="msg.attachments[0]?.type === 'audio'" 
                  :src="`${Constants.SERVER_URL}/audio/${msg.attachments[0]?.name}`"
                  )
               MessangerImageMessage(
                  v-else-if="msg.attachments[0]?.type === 'image'" 
                  :images="msg.attachments.map(msg => `${Constants.SERVER_URL}/media/${msg?.name}`)"
                  @open="onOpenImage"
                  )
   MessangerInput(v-if="currentChatId" style="margin: 5px;")
</template>


<script setup lang="ts">
import type { QScrollArea } from 'quasar'
import type { IMessage } from '@/types/interfaces'
import MessangerInput from '~/messanger/MessangerInput.vue'
import MessangerVoiceMessage from '~/messanger/MessangerVoiceMessage.vue'
import MessangerImageMessage from '~/messanger/MessangerImageMessage.vue'
import UserAvatar from '~/UserAvatar.vue'
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore, useSocketStore } from '@/stores'
import { MessangerService } from '@/api/services'
import { Time, Constants } from '@/util'


const emit = defineEmits<{
   (event: 'openModal', name: 'open_image' | 'group_info' | 'add_user' | 'users_rights'): void;
   (event: 'openImage', link: string): void;
}>();

const limit = 10;
const { user, currentTheme } = storeToRefs(useStore());
const socketStore = useSocketStore();
const { currentChatId, currentChat, chatsList } = storeToRefs(socketStore);
const dialogRef = ref<QScrollArea | null>(null);
const loading = ref(false);
const messages = computed(() => currentChat.value.messages || []);
const initialIndex = computed(() => messages.value.length > limit
   ? Math.ceil(messages.value.length / limit)
   : 0);
const hasAdminRights = computed(() => {
   return currentChat.value.group?.roles.creator?.includes(user.value._id)
      || currentChat.value.group?.roles.admin?.includes(user.value._id);
});

watch(() => messages.value.length, (n, o) => {
   setTimeout(() => {
      if (o + 1 === n) {
         const scroll = dialogRef.value?.getScroll();
         dialogRef.value?.setScrollPosition('vertical', scroll?.verticalSize || 0);
      }
   }, 0);
}, { deep: true });


async function leaveGroup() {
   if (currentChatId.value) {
      await MessangerService.deleteChat(currentChatId.value);
      chatsList.value = chatsList.value.filter(chat => chat._id !== currentChatId.value);
      currentChatId.value = '';
   }
}

function getAuthor(msg: IMessage) {
   return msg.author === user.value._id
      ? user.value
      : currentChat.value.users.find(user => user._id === msg.author)!;
}

function onOpenImage(link: string) {
   emit('openModal', 'open_image');
   emit('openImage', link);
}

async function onLoad(index: number, done: (stop?: boolean | undefined) => void) {
   if (currentChat.value.total > messages.value.length) {
      loading.value = true;
      await socketStore.onOpenChat(currentChatId.value, index, limit);
      loading.value = false;
      return done();
   }
   done(true);
}
</script>


<style scoped lang="scss">
.group {
   flex-basis: 80%;
   display: flex;
   flex-direction: column;
   box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

   & .group_title {
      margin-bottom: 5px;

      & .group_buttons {
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: center;
      }
   }

   & .group_content {
      flex: 1 1 auto;
   }

   & .send {
      cursor: pointer;
      color: $primary;

      &:hover {
         color: $secondary;
      }
   }
}

.msg {
   padding: 0 15px;

   & .msg_name {
      font-weight: bold;
      color: $orange-10;
   }

   & .msg_stamp {
      display: flex;
      justify-content: space-between;
      align-items: center;

      & .msg_time {
         padding: 0 10px 0 0;
      }
   }
}

.void {
   flex: 1 1 auto;
   display: flex;
   justify-content: center;
   align-items: center;
   font-weight: bold;
   color: $indigo;
   font-size: 1.3em;
}


.group_dark {
   & .group_title {
      background-color: $blue-grey-9 ;
   }
}

.group_light {
   & .group_title {
      background-color: $blue-grey-1;
   }
}
</style>
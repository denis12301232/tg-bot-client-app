<template lang="pug">
div(:class="['dialog', currentTheme === 'dark' ? 'dialog_dark' : 'dialog_light']")
   QItem(class="dialog_name")
      QItemSection(avatar)
         QBtn(icon="arrow_back" dense round flat @click="currentChatId = ''")
      QItemSection
         QItemLabel(class="text-h6") {{ currentChat.companion.name }}
         QItemLabel(caption) {{ currentChat.companion.status }}
      QItemSection(side)
         QBtn(icon="more_vert" round dense flat)
            QMenu
               QList(bordered)
                  QItem(v-ripple v-close-popup clickable @click="deleteChat")
                     QItemSection(avatar style="padding-right: 10px; min-width: 0;")
                        QIcon(name="delete" color="red")
                     QItemSection Удалить чат
   div(v-if="!messages.length" class="void") Здесь пусто...
   QScrollArea(v-else class="dialog_content" delay="1200" ref="dialogRef")
      QChatMessage(
         v-for="msg in messages" 
         :text="[msg.text]" 
         :sent="msg.author === user._id"
         :key="msg._id",
         :bg-color="msg.author === user._id ? 'indigo': 'teal'"
         text-color="white"
         class="msg"
         )
         template(#stamp)
            div(class="msg_stamp")
               div(class="msg_time") {{ Time.showFilteredDate(new Date(msg.createdAt)) }}
               QIcon(
                  v-if="msg.author === user._id" 
                  :name="msg.read.includes(currentChat.companion._id) ? 'mdi-check-all' : 'mdi-check'"
                  )
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
import MessangerInput from '~/messanger/MessangerInput.vue'
import MessangerVoiceMessage from '~/messanger/MessangerVoiceMessage.vue'
import MessangerImageMessage from '~/messanger/MessangerImageMessage.vue'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore, useSocketStore } from '@/stores'
import { MessangerService } from '@/api/services'
import { Time, Constants } from '@/util'


const emit = defineEmits<{
   (event: 'openModal', name: 'open_image'): void;
   (event: 'openImage', link: string): void;
}>();

const { user, currentTheme } = storeToRefs(useStore());
const { currentChat, currentChatId, chatsList } = storeToRefs(useSocketStore());
const dialogRef = ref<QScrollArea | null>(null);
const messages = computed(() => currentChat.value.messages);

watch(messages, () => {
   setTimeout(() => {
      const scroll = dialogRef.value?.getScroll();
      dialogRef.value?.setScrollPosition('vertical', scroll?.verticalSize || 0);
   }, 0);
}, { deep: true, immediate: true });

async function deleteChat() {
   await MessangerService.deleteChat(currentChatId.value!);
   chatsList.value = chatsList.value.filter(chat => {
      return chat._id !== currentChatId.value;
   });
   currentChatId.value = '';
}

function onOpenImage(link: string) {
   emit('openModal', 'open_image');
   emit('openImage', link);
}
</script>


<style scoped lang="scss">
.dialog {
   flex-basis: 80%;
   display: flex;
   flex-direction: column;
   box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

   & .dialog_name {
      margin-bottom: 5px;
   }

   & .dialog_content {
      flex: 1 1 auto;
   }
}

.msg {
   padding: 0 15px;

   & .msg_name {
      font-weight: bold;
      color: $orange;
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


.dialog_dark {
   & .dialog_name {
      background-color: $blue-grey-9 ;
   }
}

.dialog_light {
   & .dialog_name {
      background-color: $blue-grey-1;
   }
}
</style>
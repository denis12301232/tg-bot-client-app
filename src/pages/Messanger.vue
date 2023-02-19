<template lang="pug">
ChatLayout(@open-create-group="setComponent('create_group')")
   div(class="container")
      QDialog(v-model="modal" :maximized="modalContent == 'open_image'")
         component(:is="modalComponent.component" :="modalComponent.props" @close="modal = false")
      MessangerChatsList(:class="currentChatId ? 'hide' : 'not_hide'")
      div(
         v-if="!currentChatId" 
         :class="['dialog_not_selected', currentChatId ? 'not_hide' : 'hide' ]"
         ) Выберите, кому вы бы хотели написать
      component(
         v-else :is="dialog" 
         :class="currentChatId ? 'not_hide' : 'hide'" 
         @openModal="setComponent" 
         @openImage="onOpenImage"
         )
</template>


<script setup lang="ts">
import ChatLayout from '@/layouts/ChatLayout.vue'
import MessangerChatsList from '~/messanger/MessangerChatsList.vue'
import MessangerDialog from '~/messanger/MessangerDialog.vue'
import MessangerGroup from '~/messanger/MessangerGroup.vue'
import MessangerFormCreateGroup from '~/messanger/MessangerFormCreateGroup.vue'
import MessangerGroupInfo from '~/messanger/MessangerGroupInfo.vue'
import MessangerGroupAddUser from '~/messanger/MessangerGroupAddUser.vue'
import MessangerGroupRoles from '~/messanger/MessangerGroupRoles.vue'
import MessangerImage from '~/messanger/MessangerImage.vue'
import { ref, computed, markRaw } from 'vue'
import { storeToRefs } from 'pinia'
import { useSocketStore } from '@/stores'

type ModalContent = 'create_group' | 'group_info' | 'add_user' | 'open_image' | 'users_rights';

const { currentChat, currentChatId } = storeToRefs(useSocketStore());
const modal = ref(false);
const modalContent = ref<ModalContent>('create_group');
const openedImage = ref('');
const dialog = computed(() => {
   switch (currentChat.value.type) {
      case 'group':
         return markRaw(MessangerGroup);
      case 'dialog':
         return markRaw(MessangerDialog);
   }
});
const modalComponent = computed(() => {
   switch (modalContent.value) {
      case 'create_group':
         return { 
            component: markRaw(MessangerFormCreateGroup) 
         };
      case 'group_info':
         return {
            component: markRaw(MessangerGroupInfo),
            props: {
               chat_id: currentChatId.value,
               avatar: currentChat.value.group?.avatar,
               name: currentChat.value.group?.title,
               roles: currentChat.value.group?.roles,
            }
         };
      case 'add_user':
         return {
            component: markRaw(MessangerGroupAddUser),
            props: { chat_id: currentChatId.value }
         };
      case 'open_image':
         return {
            component: markRaw(MessangerImage),
            props: { src: openedImage.value }
         };
      case 'users_rights':
         return {
            component: markRaw(MessangerGroupRoles),
            props: { chat: currentChat.value }
         };
   }
});

function setComponent(name: ModalContent) {
   modal.value = !modal.value;
   modalContent.value = name;
}

function onOpenImage(link: string) {
   openedImage.value = link;
}
</script>


<style scoped lang="scss">
.container {
   display: flex;
   height: 100%;

   & .dialog_not_selected {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-basis: 80%;
      height: 100%;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      font-weight: bold;
      font-size: 1.3em;
      color: $indigo;
   }
}

@media (max-width:768px) {
   .hide {
      display: none !important;
   }

   .not_hide {
      flex-basis: 100% !important;
      border: none !important;
   }
}
</style>
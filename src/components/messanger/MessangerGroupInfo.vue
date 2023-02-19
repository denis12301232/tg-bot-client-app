<template lang="pug">
QCard(class="info")
   QCardSection
      div(class="text-center text-h5") Информация о группе
   QCardSection(class="info_group")
      QItem
         QItemSection(avatar)
            UserAvatar(:avatar="avatar" :name="name")
         QItemSection
            QItemLabel(class="text-h6") {{ name }}
            QItemLabel(caption) {{ currentChat.members_count }} участников
   QCardSection
      QItem
         QItemSection(class="text-center text-h6 q-mb-sm") Список участников
      QInput(v-model="filter" label="Найти" class="q-mb-sm" outlined dense hide-bottom-space)
      QItem(v-if="loading")
         QInnerLoading(:showing="loading")
            QSpinnerGears(size="50px" color="primary")
      QList
         QItem(v-for="user in filteredUsers" :key="user._id")
            QItemSection(avatar)
               UserAvatar(:name="user.name", :avatar="user.avatar")
            QItemSection
               QItemLabel {{ user.name }}
               QItemLabel(caption) {{ user.login }}
            QItemSection(v-if="canRemove && user._id !== store.user._id" side)
               QBtn(dense flat round icon="delete" :loading="isRemoveUserLoading" @click="onRemoveUser(user._id)")
         QItem(v-if="!loading && !filteredUsers?.length")
            QItemSection(class="text-center not_found") Ничего не найдено
</template>


<script setup lang="ts">
import type { IUser } from '@/types/interfaces'
import UserAvatar from '~/UserAvatar.vue'
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore, useSocketStore } from '@/stores'
import { useFetch } from '@/hooks'
import { MessangerService } from '@/api/services'


const props = defineProps<{
   avatar: string;
   name: string;
   chat_id: string;
   roles: { [name: string]: string }
}>();

const store = useStore();
const { currentChat } = storeToRefs(useSocketStore())
const filter = ref('');
const { f: onGetUsersListInChat, loading, data: users } = useFetch<IUser[]>({
   fn: MessangerService.getUsersListInChat,
});
const { f: onRemoveUser, loading: isRemoveUserLoading } = useFetch({
   fn: (user_id: string) => {
      MessangerService.removeUserFromGroup(props.chat_id, user_id)
         .then(() => {
            users.value = users.value?.filter((user) => user._id !== user_id);
            currentChat.value.members_count--;
         });
   },
});
const filteredUsers = computed(() => {
   return users.value?.filter(user => user.name.includes(filter.value) || user.login.includes(filter.value));
});
const canRemove = computed(() => {
   if (props.roles.creator?.includes(store.user._id) || props.roles.admin?.includes(store.user._id)) {
      return true;
   }
   return false;
});

onMounted(() => onGetUsersListInChat(props.chat_id));
</script>


<style scoped lang="scss">
.info {
   min-width: 300px;
   max-width: 500px;
   width: 500px;

   & .info_group {
      display: flex;
      justify-content: center;
      padding: 0;
   }
}

.not_found {
   font-size: 1.2em;
}
</style>
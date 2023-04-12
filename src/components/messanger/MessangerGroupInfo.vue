<template>
  <QCard class="info">
    <QCardSection class="row justify-end">
      <QBtn v-close-popup icon="close" round dense flat color="negative" />
    </QCardSection>
    <QCardSection>
      <h5 class="text-center">Информация о группе</h5>
    </QCardSection>
    <QCardSection class="row justify-center q-pa-none">
      <QItem>
        <QItemSection avatar>
          <UserAvatar :avatar="avatar" :name="name" size="55px" />
        </QItemSection>
        <QItemSection>
          <QItemLabel class="text-h6">{{ name }}</QItemLabel>
          <QItemLabel caption>{{ currentChat?.members_count }} участников</QItemLabel>
        </QItemSection>
      </QItem>
    </QCardSection>
    <QCardSection class="column items-center">
      <div class="users">
        <h6 class="text-center">Список участников</h6>
        <QInput v-model="filter" class="q-mb-sm full-width" label="Найти" clearable />
        <div v-if="loading" class="row justify-center q-mt-md">
          <QSpinner size="50px" color="primary" />
        </div>
        <QVirtualScroll
          class="full-width"
          style="max-height: 500px"
          :items="filteredUsers"
          separator
          #="{ item }: { item: IUser }"
        >
          <QItem :key="item._id">
            <QItemSection avatar>
              <UserAvatar :name="item.name" :avatar="item.avatar" />
            </QItemSection>
            <QItemSection>
              <QItemLabel>{{ item.name }}</QItemLabel>
              <QItemLabel caption>{{ item.login }}</QItemLabel>
            </QItemSection>
            <QItemSection v-if="canRemove && item._id !== store.user._id" side>
              <QBtn dense flat round icon="delete" :loading="isRemoveUserLoading" @click="onRemoveUser(item._id)" />
            </QItemSection>
          </QItem>
        </QVirtualScroll>
        <QItem v-if="!loading && !filteredUsers?.length">
          <QItemSection class="text-center text-subtitle2 text-negative">Ничего не найдено</QItemSection>
        </QItem>
      </div>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import type { IUser } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useChatStore } from '@/stores';
import { useFetch } from '@/hooks';
import { MessangerService } from '@/api/services';

const props = defineProps<{
  avatar: string;
  name: string;
  chat_id: string;
  roles: { [name: string]: string };
}>();

const store = useStore();
const { currentChat } = storeToRefs(useChatStore());
const filter = ref('');
const { f: onGetUsersListInChat, loading, data: users } = useFetch<IUser[]>({
  fn: MessangerService.getUsersListInChat,
});
const { f: onRemoveUser, loading: isRemoveUserLoading } = useFetch({
  fn: (user_id: string) => {
    MessangerService.removeUserFromGroup(props.chat_id, user_id).then(() => {
      users.value = users.value?.filter(user => user._id !== user_id);
      currentChat.value && currentChat.value.members_count--;
    });
  },
});
const filteredUsers = computed(() => {
  return filter.value
    ? users.value?.filter(user => user.name.includes(filter.value) || user.login.includes(filter.value))
    : users.value;
});
const canRemove = computed(() => (props.roles.admin?.includes(store.user._id) ? true : false));

onMounted(() => onGetUsersListInChat(props.chat_id));
</script>

<style scoped lang="scss">
.users {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  width: 50%;
  min-width: 250px;
}

.not_found {
  font-size: 1.2em;
}
</style>

<template>
  <QCard class="add">
    <QCardSection>
      <div class="text-h5 text-center">Добавить в группу</div>
    </QCardSection>
    <QCardSection>
      <QInput v-model="search" debounce="300" label="Имя или логин" filled clearable :loading="isUsersLoading" />
    </QCardSection>
    <QCardSection v-show="search">
      <QList>
        <QItem v-for="user in users" v-ripple clickable @click="select(user)">
          <QItemSection top avatar>
            <UserAvatar :name="user.name" :avatar="user.avatar" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>{{ user.name }}</QItemLabel>
            <QItemLabel caption lines="2">{{ user.login }}</QItemLabel>
          </QItemSection>
          <QItemSection v-if="userToAdd?._id === user._id" class="row justify-center items-center" side top>
            <QIcon name="check_circle_outline" color="positive" />
          </QItemSection>
        </QItem>
      </QList>
      <div v-if="!users?.length && search" class="text-center text-subtitle1 text-negative">
        Не найдено ни одного человека...
      </div>
    </QCardSection>
    <QCardActions class="q-pb-md" align="center">
      <QBtn
        v-close-popup
        color="primary"
        :disable="!userToAdd"
        :loading="isAddUserLoading"
        label="Добавить"
        @click="onAddUser"
      />
    </QCardActions>
  </QCard>
</template>

<script setup lang="ts">
import type { IUser } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '@/stores';
import { useFetch } from '@/hooks';
import { MessangerService } from '@/api/services';

const { chats, currentChatId } = storeToRefs(useChatStore());
const search = ref('');
const userToAdd = ref<IUser | null>(null);
const { f: onFindUsers, data: users, loading: isUsersLoading } = useFetch<IUser[]>({
  fn: MessangerService.findUsers,
});

const { f: onAddUser, loading: isAddUserLoading } = useFetch({
  fn: addUserToGroup,
  successMsg: 'Пользователь добавлен в чат',
  errorMsg: 'Пользователь уже в чате',
  alert: true,
});

watch(search, (n, o) => {
  if (n) {
    onFindUsers(search.value);
    userToAdd.value = null;
  } else {
    users.value = [];
  }
});

function select(user: IUser) {
  userToAdd.value?._id === user._id ? (userToAdd.value = null) : (userToAdd.value = user);
}

async function addUserToGroup() {
  if (userToAdd.value) {
    await MessangerService.addUserToGroup(currentChatId.value!, userToAdd.value._id);
    const chat = chats.value.get(currentChatId.value!);
    if (chat) {
      !chat.users.find((user) => user._id === userToAdd.value?._id) ? chat.users.push(userToAdd.value) : '';
      chat.members_count++;
    }
  }
}
</script>

<style scoped lang="scss">
.add {
  min-width: 300px;
  max-width: 500px;
  width: 100%;
  padding: 10px;
}
</style>

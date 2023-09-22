<template>
  <QCard class="add">
    <QCardSection>
      <div class="text-h5 text-center">{{ t('chat.addUser.title') }}</div>
    </QCardSection>
    <QCardSection>
      <QInput
        v-model="search"
        debounce="300"
        :label="t('chat.addUser.form.fields.name.placeholder')"
        filled
        clearable
        :error="!users?.length && !!search"
        :error-message="t('chat.search.errors.none')"
        :loading="isUsersLoading"
      />
    </QCardSection>
    <QCardSection v-show="search && users?.length">
      <QList>
        <QItem v-for="user in users" v-ripple :key="user._id" clickable @click="select(user)">
          <QItemSection top avatar>
            <UserAvatar :name="user.name" :avatar="user.avatar" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>{{ user.name }}</QItemLabel>
            <QItemLabel caption lines="2">{{ user.login }}</QItemLabel>
          </QItemSection>
          <QItemSection v-if="userToAdd?._id === user._id" class="row justify-center items-center" side top>
            <QIcon name="eva-checkmark-circle-outline" color="positive" />
          </QItemSection>
        </QItem>
      </QList>
    </QCardSection>
    <QCardActions class="q-pb-md" align="center">
      <QBtn
        v-close-popup
        color="primary"
        :disable="!userToAdd?._id"
        :loading="loading"
        :label="t('chat.addUser.form.buttons.add')"
        @click="updateGroupMembers(currentChatId!, { action: 'add', userId: userToAdd!._id })"
      />
    </QCardActions>
  </QCard>
</template>

<script setup lang="ts">
import type { IUser } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAlertStore, useSocketStore } from '@/stores';
import { useQuery } from '@/hooks';
import { ChatService, UserService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const alertStore = useAlertStore();
const { chats, currentChatId } = storeToRefs(useSocketStore());
const search = ref('');
const userToAdd = ref<IUser | null>(null);
const { query: findUsers, data: users, loading: isUsersLoading } = useQuery(UserService.index);
const { query: updateGroupMembers, loading } = useQuery(ChatService.updateGroupMembers, { onSuccess, onError });

watch(search, (n) => {
  if (n) {
    findUsers({ filter: n });
    userToAdd.value = null;
  } else {
    users.value = [];
  }
});

function select(user: IUser) {
  userToAdd.value?._id === user._id ? (userToAdd.value = null) : (userToAdd.value = user);
}

function onSuccess() {
  const chat = chats.value.get(currentChatId.value!);
  if (chat) {
    !chat.users.find((user) => user._id === userToAdd.value?._id) ? chat.users.push(userToAdd.value!) : '';
    chat.members_count++;
  }
  alertStore.addAlert('success', t('chat.addUser.messages.added'));
}

function onError() {
  alertStore.addAlert('error', t('chat.addUser.messages.error'));
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

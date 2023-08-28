<template>
  <QCard class="info">
    <QCardSection class="row justify-end">
      <QBtn v-close-popup icon="eva-close" round dense flat color="negative" />
    </QCardSection>
    <QCardSection>
      <h5 class="text-center">{{ t('chat.aboutGroup.title') }}</h5>
    </QCardSection>
    <QCardSection class="row justify-center q-pa-none">
      <QItem style="max-width: 500px; min-width: 150px">
        <QItemSection avatar>
          <UserAvatar :avatar="avatar" :name="name" size="55px" />
        </QItemSection>
        <QItemSection>
          <QItemLabel class="text-h6 text-cut">{{ name }}</QItemLabel>
          <QItemLabel caption>
            {{ t('chat.messages.people', currentChat?.members_count || 0) }}
          </QItemLabel>
        </QItemSection>
      </QItem>
    </QCardSection>
    <QCardSection class="row justify-center q-pb-none">
      <div style="max-width: 500px; min-width: 150px">
        <h6 class="q-mt-sm text-center">{{ t('chat.aboutGroup.labels.about') }}</h6>
        <div class="text-body1 q-mt-sm text-italic text-justify text-weight-thin">{{ currentChat?.group.about }}</div>
      </div>
    </QCardSection>
    <QCardSection class="column items-center">
      <div class="users">
        <h6 class="text-center">{{ t('chat.aboutGroup.labels.people') }}</h6>
        <QInput
          v-model="filter"
          class="q-mb-sm full-width"
          :label="t('chat.aboutGroup.search.placeholder')"
          clearable
        />
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
              <QItemLabel caption> <QIcon name="eva-at-outline" />{{ item.login }} </QItemLabel>
            </QItemSection>
            <QItemSection v-if="canRemove && item._id !== user?._id" side>
              <QBtn
                dense
                flat
                round
                icon="eva-trash"
                color="negative"
                :loading="isRemoveUserLoading"
                @click="select(item._id)"
              />
            </QItemSection>
          </QItem>
        </QVirtualScroll>
        <QItem v-if="!loading && !filteredUsers?.length">
          <QItemSection class="text-center text-subtitle2 text-negative">
            {{ t('chat.aboutGroup.search.errors.none') }}
          </QItemSection>
        </QItem>
      </div>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import type { IUser } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useSocketStore } from '@/stores';
import { useFetch } from '@/hooks';
import { ChatService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { user } = storeToRefs(useStore());
const { currentChat, currentChatId } = storeToRefs(useSocketStore());
const filter = ref('');
const selected = ref('');
const avatar = computed(() => currentChat.value?.group?.avatar);
const name = computed(() => currentChat.value?.group?.title);
const {
  request: getUsersList,
  loading,
  data: users,
} = useFetch<IUser[], typeof ChatService.getUsersListInChat>(ChatService.getUsersListInChat);
const { request: removeUser, loading: isRemoveUserLoading } = useFetch(ChatService.removeUserFromGroup, {
  afterSuccess: () => {
    users.value = users.value?.filter((user) => user._id !== selected.value);
    currentChat.value && currentChat.value.members_count--;
    selected.value = '';
  },
});
const filteredUsers = computed(() => {
  return filter.value
    ? users.value?.filter((user) => user.name.includes(filter.value) || user.login.includes(filter.value))
    : users.value;
});
const canRemove = computed(() =>
  currentChat.value?.group.roles.admin?.includes(user.value?._id || '') ? true : false
);

onMounted(() => getUsersList(currentChatId.value!));

watch(selected, () => {
  if (selected.value) {
    removeUser(currentChatId.value!, selected.value);
  }
});

function select(id: string) {
  selected.value = id;
}
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

<template>
  <form class="column items-center" type="submit" @submit.prevent="request(formData)">
    <SetAvatar
      v-model="avatar"
      size="200px"
      :src="store.user?.avatar && `${ENV.SERVER_URL}/avatars/${store.user.avatar}`"
    />
    <QBtn class="q-mt-sm" :disable="!avatar || loading" type="submit" :loading="loading">Изменить</QBtn>
  </form>
</template>

<script setup lang="ts">
import SetAvatar from '~/SetAvatar.vue';
import { ref, watch } from 'vue';
import { useStore } from '@/stores';
import { useFetch } from '@/hooks';
import { ToolsService } from '@/api/services';
import { ENV } from '@/util';

type T = { avatar: string };
type S = typeof ToolsService.setAvatar;

const store = useStore();
const avatar = ref<File | null>(null);
const { request, loading, error } = useFetch<T, S>(ToolsService.setAvatar, {
  afterResponse: ({ data }) => store.user?.avatar && (store.user.avatar = data.value.avatar),
});
const formData = new FormData();

watch(avatar, () => {
  if (avatar.value) {
    formData.append('avatar', avatar.value);
  } else {
    formData.delete('avatar');
  }
});
</script>

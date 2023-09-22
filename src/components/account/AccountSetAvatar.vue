<template>
  <form class="column items-center" type="submit" @submit.prevent="query(formData)">
    <SetAvatar v-model="avatar" size="200px" :src="store.user?.avatar" />
    <QBtn class="q-mt-sm" color="primary" :disable="!avatar || loading" type="submit" :loading="loading">
      {{ label }}
    </QBtn>
    <div class="row justify-center text-negative text-bold caption">
      {{ error?.message }}
    </div>
  </form>
</template>

<script setup lang="ts">
import SetAvatar from '~/SetAvatar.vue';
import { ref, watch } from 'vue';
import { useAlertStore, useStore } from '@/stores';
import { useQuery } from '@/hooks';
import { UserService } from '@/api/services';

interface Props {
  label: string;
  successMsg: string;
}

const props = defineProps<Props>();
const store = useStore();
const alertStore = useAlertStore();
const avatar = ref<File | null>(null);
const { query, loading, error } = useQuery(UserService.updateAvatar, { onSuccess });
const formData = new FormData();

watch(avatar, () => {
  if (avatar.value) {
    formData.append('avatar', avatar.value);
  } else {
    formData.delete('avatar');
  }
});

function onSuccess(v: { avatar: string }) {
  store.user?.avatar && (store.user.avatar = v.avatar);
  alertStore.addAlert('success', props.successMsg);
}
</script>

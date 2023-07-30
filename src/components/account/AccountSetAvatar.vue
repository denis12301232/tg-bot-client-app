<template>
  <form class="column items-center" type="submit" @submit.prevent="request(formData)">
    <SetAvatar v-model="avatar" size="200px" :src="store.user?.avatar && `${ENV.IMAGE_URL}/${store.user.avatar}`" />
    <QBtn class="q-mt-sm" color="primary" :disable="!avatar || loading" type="submit" :loading="loading">
      {{ label }}
    </QBtn>
    <div class="row justify-center text-negative text-bold caption">
      {{ typeof error === 'object' ? error.message : error }}
    </div>
  </form>
</template>

<script setup lang="ts">
import SetAvatar from '~/SetAvatar.vue';
import { ref, watch } from 'vue';
import { useStore } from '@/stores';
import { useFetch } from '@/hooks';
import { ToolsService } from '@/api/services';
import { ENV } from '@/util';

const props = defineProps<{
  label: string;
  successMsg: string;
}>();

const store = useStore();
const avatar = ref<File | null>(null);
const { request, loading, error } = useFetch<{ avatar: string }, typeof ToolsService.setAvatar>(
  ToolsService.setAvatar,
  {
    afterSuccess: ({ data }) => {
      store.user?.avatar && (store.user.avatar = data.value.avatar);
    },
    alert: true,
    successMsg: props.successMsg,
  }
);
const formData = new FormData();

watch(avatar, () => {
  if (avatar.value) {
    formData.append('avatar', avatar.value);
  } else {
    formData.delete('avatar');
  }
});
</script>

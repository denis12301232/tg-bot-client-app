<template>
  <form class="form" @submit.prevent="onUpdateAvatar">
    <ChangeAvatar
      v-model="avatar"
      size="200px"
      :src="store.user.avatar && `${Constants.SERVER_URL}/avatars/${store.user.avatar}`"
    />
    <QBtn
      class="q-mt-lg"
      type="submit"
      color="primary"
      :loading="isAvatarLoading"
      :disable="disable"
      label="Изменить"
    />
  </form>
</template>

<script setup lang="ts">
import ChangeAvatar from '~/ChangeAvatar.vue';
import { ref, watchEffect } from 'vue';
import { useStore } from '@/stores';
import { useFetch, useWatchPause } from '@/hooks';
import { ToolsService } from '@/api/services';
import { Constants } from '@/util';

const store = useStore();
const avatar = ref<File | null>(null);
const disable = ref(true);
const formData = new FormData();
const { f: onUpdateAvatar, loading: isAvatarLoading } = useFetch({
  fn: setAvatar,
  successMsg: 'Изменено',
  alert: true,
});
const { stop, resume } = useWatchPause(avatar, () => {
  disable.value = false;
  stop();
});

watchEffect(() => {
  if (avatar.value) {
    formData.append('avatar', avatar.value);
  }
});

async function setAvatar() {
  const response = await ToolsService.setAvatar(formData);
  avatar.value = null;
  store.user.avatar = response.data.avatar;
  formData.delete('avatar');
  disable.value = true;
  resume();
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 250px;
  & i {
    cursor: pointer;
    color: $primary;

    &:hover {
      color: $secondary;
    }
  }
}
</style>

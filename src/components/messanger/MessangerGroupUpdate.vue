<template>
  <div :class="$style.change_avatar">
    <ChangeAvatar
      v-model="settings.avatar"
      :src="group.avatar && `${Constants.SERVER_URL}/avatars/${group.avatar}`"
      size="200px"
    />
    <QInput v-model="settings.title" class="q-mt-md full-width" clearable label="Название" />
    <QInput v-model="settings.about" class="q-mt-md full-width" type="textarea" label="О группе" autogrow />
    <QBtn
      :loading="loading"
      :disable="!valid || loading"
      class="q-mt-md"
      color="primary"
      label="Готово"
      @click="onUpdateGroup"
    />
  </div>
</template>

<script setup lang="ts">
import ChangeAvatar from '~/ChangeAvatar.vue';
import { ref, reactive, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '@/stores';
import { useFetch } from '@/hooks';
import { MessangerService } from '@/api/services';
import { Constants } from '@/util';

const { currentChat } = storeToRefs(useChatStore());
const settings = reactive({
  avatar: null as File | null,
  title: '',
  about: '',
});

const formData = ref<FormData>(new FormData());
const group = computed(() => currentChat.value!.group);
const valid = computed(() => Boolean(settings.title || settings.avatar || settings.about));
const { f: onUpdateGroup, loading } = useFetch({
  fn: updateGroup,
  successMsg: 'Изменено',
  alert: true,
});

watchEffect(() => {
  if (settings.avatar) {
    formData.value = new FormData();
    formData.value.append('avatar', settings.avatar);
  }
});

async function updateGroup() {
  const response = await MessangerService.updateGroup({
    formData: formData.value,
    params: { group_id: group.value._id, title: settings.title, about: settings.about },
  });
  currentChat.value!.group = { ...currentChat.value!.group, ...response.data };
  settings.avatar = null;
  settings.title = '';
}
</script>

<style lang="scss" module>
.change_avatar {
  max-width: 500px;
  width: 50%;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

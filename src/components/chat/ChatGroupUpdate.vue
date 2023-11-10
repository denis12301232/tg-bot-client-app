<template>
  <div :class="$style.change_avatar">
    <SetAvatar v-model="settings.avatar" :src="group?.avatar" size="200px" />
    <QInput
      v-model="settings.title"
      class="q-mt-md full-width"
      clearable
      :label="t('chat.groupSettings.form.fields.title.placeholder')"
      standout="text-white bg-indigo"
    />
    <QInput
      v-model="settings.about"
      class="q-mt-md full-width"
      type="textarea"
      :label="t('chat.groupSettings.form.fields.about.placeholder')"
      autogrow
      standout="text-white bg-indigo"
    />
    <QBtn
      :loading="loading"
      :disable="!valid || loading"
      class="q-mt-md"
      color="primary"
      @click="updateGroup(group?._id || '', { formData, params })"
    >
      {{ t('chat.groupSettings.form.buttons.submit') }}
    </QBtn>
  </div>
</template>

<script setup lang="ts">
import SetAvatar from '~/SetAvatar.vue';
import { reactive, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useAlertStore, useSocketStore } from '@/stores';
import { useQuery } from '@/hooks';
import { ChatService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { currentChat } = storeToRefs(useSocketStore());
const alertStore = useAlertStore();
const settings = reactive({
  avatar: null as File | null,
  title: currentChat.value?.group.title || '',
  about: currentChat.value?.group.about || '',
});
const formData = new FormData();
const group = computed(() => currentChat.value?.group);
const valid = computed(() => Boolean(settings.title || settings.avatar || settings.about));
const params = computed(() => ({
  title: settings.title ? settings.title : undefined,
  about: settings.about ? settings.about : undefined,
}));
const { query: updateGroup, loading } = useQuery(ChatService.updateGroup, { onSuccess, onError });

watchEffect((onCleanup) => {
  if (settings.avatar) {
    formData.append('avatar', settings.avatar);
  }
  onCleanup(() => formData.delete('avatar'));
});

function onSuccess(group: Awaited<ReturnType<typeof ChatService.updateGroup>>) {
  if (currentChat.value?.group) {
    currentChat.value.group = group;
  }
  settings.avatar = null;
  alertStore.addAlert('success', t('chat.groupSettings.messages.updated'));
}

function onError() {
  alertStore.addAlert('error', t('chat.groupSettings.messages.failed'));
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

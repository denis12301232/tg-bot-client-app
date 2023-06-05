<template>
  <div :class="$style.change_avatar">
    <SetAvatar
      v-model="settings.avatar"
      :src="group?.avatar && `${ENV.SERVER_URL}/avatars/${group.avatar}`"
      size="200px"
    />
    <QInput
      v-model="settings.title"
      class="q-mt-md full-width"
      clearable
      :label="t('chat.groupSettings.placeholders.title')"
      standout="text-white bg-indigo"
    />
    <QInput
      v-model="settings.about"
      class="q-mt-md full-width"
      type="textarea"
      :label="t('chat.groupSettings.placeholders.about')"
      autogrow
      standout="text-white bg-indigo"
    />
    <QBtn
      :loading="loading"
      :disable="!valid || loading"
      class="q-mt-md"
      color="primary"
      @click="updateGroup({ 
        formData: formData,
        params: { group_id: group!._id, title: settings.title, about: settings.about
        }})"
    >
      {{ t('chat.groupSettings.buttons.submit') }}
    </QBtn>
  </div>
</template>

<script setup lang="ts">
import type { ChatResponse, I18n, Langs } from '@/types';
import SetAvatar from '~/SetAvatar.vue';
import { ref, reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useChatStore } from '@/stores';
import { useFetch } from '@/hooks';
import { ChatService } from '@/api/services';
import { ENV } from '@/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n<I18n, Langs>();
const store = useStore();
const { currentChat } = storeToRefs(useChatStore());
const settings = reactive({
  avatar: null as File | null,
  title: currentChat.value?.group.title || '',
  about: currentChat.value?.group.about || '',
});

const formData = ref<FormData>(new FormData());
const group = computed(() => currentChat.value?.group);
const valid = computed(() => Boolean(settings.title || settings.avatar || settings.about));
const { request: updateGroup, loading } = useFetch<ChatResponse['group'], typeof ChatService.updateGroup>(
  ChatService.updateGroup,
  {
    afterSuccess: ({ data }) => {
      currentChat.value!.group = { ...currentChat.value!.group, ...data.value };
      settings.avatar = null;
      settings.title = '';
      store.addAlert('success', 'Изменено');
    },
  }
);

watch([() => settings.avatar], () => {
  if (settings.avatar) {
    formData.value = new FormData();
    formData.value.append('avatar', settings.avatar);
  }
});
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

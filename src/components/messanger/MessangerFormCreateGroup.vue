<template>
  <QCard class="content">
    <QCardSection>
      <div class="text-h5 text-center q-pb-lg">Создать группу</div>
    </QCardSection>
    <QCardSection>
      <QStepper v-model="step" color="primary" animated flat>
        <QStep class="overflow-hidden" :name="1" title="Название и описание" icon="settings" :done="step > 1">
          <QInput v-model="newGroup.title" filled label="Название" counter maxlength="30" />
          <QInput
            v-model="newGroup.about"
            class="q-mt-sm"
            filled
            label="Описание"
            type="textarea"
            autogrow
            counter
            maxlength="100"
          />
          <QStepperNavigation>
            <QBtn @click="step = 2" color="primary" label="Продолжить" :disable="!newGroup.title" />
          </QStepperNavigation>
        </QStep>
        <QStep
          class="overflow-hidden"
          :name="2"
          title="Аватар"
          caption="Не обязательно"
          icon="photo_camera"
          :done="step > 2"
        >
          <div class="row justify-center">
            <ChangeAvatar v-model="newGroup.avatar" size="120px" />
          </div>
          <QStepperNavigation>
            <QBtn color="primary" label="Создать" :loading="loading" @click="onCreateGroup" />
            <QBtn flat @click="step = 1" color="primary" label="Назад" class="q-ml-sm" />
          </QStepperNavigation>
        </QStep>
      </QStepper>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import type { ChatResponse } from '@/types';
import ChangeAvatar from '~/ChangeAvatar.vue';
import { ref, watch, reactive } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { MessangerService } from '@/api/services';
import { useFetch } from '@/hooks';

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const newGroup = reactive({
  title: '',
  about: '',
  avatar: null as null | File,
});

const store = useStore();
const socketStore = useChatStore();
const step = ref(1);
const { f: onCreateGroup, loading, data: group } = useFetch<ChatResponse>({
  fn: createGroup,
});

watch(group, () => {
  group.value && socketStore.chats.set(group.value._id, group.value);
  emit('close');
});

async function createGroup() {
  const formData = new FormData();
  if (newGroup.avatar) formData.append('avatar', newGroup.avatar);
  const response = await MessangerService.createGroup(
    newGroup.title,
    newGroup.about,
    [store.user._id],
    formData
  );
  return response;
}
</script>

<style scoped lang="scss">
.content {
  min-width: 300px;
  width: 100%;
  max-width: 700px;
  padding: 10px;
}
</style>

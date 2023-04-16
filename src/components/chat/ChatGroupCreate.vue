<template>
  <QCard :class="$style.content">
    <QCardSection class="text-h5 text-center">Создать группу</QCardSection>
    <QCardSection>
      <QStepper v-model="step" color="primary" animated flat>
        <QStep class="overflow-hidden" :name="1" title="Название и описание" icon="settings" :done="step > 1">
          <QInput v-model="group.title" filled label="Название" counter maxlength="30" />
          <QInput
            v-model="group.about"
            class="q-mt-sm"
            filled
            label="Описание"
            type="textarea"
            autogrow
            counter
            maxlength="100"
          />
          <QStepperNavigation>
            <QBtn color="primary" label="Продолжить" :disable="!group.title" @click="setStep(2)" />
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
            <ChangeAvatar v-model="group.avatar" size="120px" />
          </div>
          <QStepperNavigation>
            <QBtn color="primary" label="Создать" :loading="loading" @click="onCreateGroup" />
            <QBtn flat color="primary" label="Назад" class="q-ml-sm" @click="setStep(1)" />
          </QStepperNavigation>
        </QStep>
      </QStepper>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import type { ChatResponse } from '@/types';
import ChangeAvatar from '~/ChangeAvatar.vue';
import { ref, reactive, watch } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { useFetch } from '@/hooks';
import { MessangerService } from '@/api/services';


const props = defineProps<{
  onCloseModal: () => void;
}>()
const store = useStore();
const chatStore = useChatStore();
const step = ref(1);
const group = reactive({ title: '', about: '', avatar: null });
const { f: onCreateGroup, loading, data: chat } = useFetch<ChatResponse>({ fn: createGroup });

watch(chat, () => {
  chat.value && chatStore.chats.set(chat.value._id, chat.value);
  props.onCloseModal();
});

function setStep(value: number) {
  step.value = value;
}

async function createGroup() {
  const formData = new FormData();
  group.avatar && formData.append('avatar', group.avatar);
  return MessangerService.createGroup(group.title, group.about, [store.user._id], formData);
}
</script>

<style lang="scss" module>
.content {
  min-width: 300px;
  width: 100%;
  max-width: 700px;
  padding: 10px;
}
</style>

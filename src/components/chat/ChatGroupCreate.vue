<template>
  <QCard :class="$style.content">
    <QResizeObserver @resize="onResize" />
    <QCardSection class="text-h5 text-center">{{ t('chat.createGroup.title') }}</QCardSection>
    <QCardSection class="q-pa-none">
      <QStepper v-model="step" color="primary" animated flat :vertical="vertical">
        <QStep
          class="overflow-hidden"
          :name="1"
          :title="t('chat.createGroup.first.form.title')"
          icon="eva-settings"
          :done="step > 1"
        >
          <QInput
            v-model="group.title"
            standout
            :label="t('chat.createGroup.first.form.fields.title.placeholder')"
            counter
            maxlength="30"
          />
          <QInput
            v-model="group.about"
            class="q-mt-sm"
            standout
            :label="t('chat.createGroup.first.form.fields.about.placeholder')"
            type="textarea"
            autogrow
            counter
            maxlength="100"
          />
          <QStepperNavigation>
            <QBtn
              color="primary"
              :label="t('chat.createGroup.first.form.buttons.next')"
              :disable="!group.title"
              @click="setStep(2)"
            />
          </QStepperNavigation>
        </QStep>
        <QStep
          class="overflow-hidden"
          :name="2"
          :title="t('chat.createGroup.second.form.title')"
          :caption="t('chat.createGroup.second.form.subtitle')"
          icon="eva-image-outline"
          :done="step > 2"
        >
          <div class="row justify-center q-pt-md">
            <SetAvatar v-model="group.avatar" size="120px" />
          </div>
          <QStepperNavigation>
            <QBtn color="primary" :label="t('chat.createGroup.second.form.buttons.create')" @click="createGroup" />
            <QBtn
              flat
              color="primary"
              :label="t('chat.createGroup.second.form.buttons.back')"
              class="q-ml-sm"
              @click="setStep(1)"
            />
          </QStepperNavigation>
        </QStep>
      </QStepper>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import type {Responses } from '@/types';
import SetAvatar from '~/SetAvatar.vue';
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  onCloseModal: () => void;
}>();

const { t } = useI18n();
const store = useStore();
const chatStore = useChatStore();
const step = ref(1);
const vertical = ref(false);
const group = reactive({ title: '', about: '', avatar: null as null | File });

onMounted(() => chatStore.socket.on('chat:create-group', onChatCreateGroup));
onUnmounted(() => chatStore.socket.removeListener('chat:create-group', onChatCreateGroup));

function setStep(value: number) {
  step.value = value;
}

async function createGroup() {
  chatStore.socket.emit('chat:create-group', {
    users: [store.user?._id || ''],
    about: group.about,
    title: group.title,
    avatar: group.avatar,
  });
}

function onChatCreateGroup(chat: Responses.Chat) {
  chatStore.chats.set(chat._id, chat);
  props.onCloseModal();
}

function onResize({ width }: { height: number; width: number }) {
  width < 410 ? (vertical.value = true) : (vertical.value = false);
}
</script>

<style lang="scss" module>
.content {
  min-width: 300px;
  width: 100%;
  max-width: 700px;
  padding: 5px;
}
</style>

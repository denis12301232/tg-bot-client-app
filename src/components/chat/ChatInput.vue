<template>
  <QInput
    v-model="message"
    ref="inputRef"
    class="input"
    :loading="loading"
    filled
    label-slot
    :readonly="isRecording || !!voiceMessage || loading"
    square
    :on-focus="() => setFocus(true)"
    :on-blur="() => setFocus(false)"
    :="$attrs"
    @keyup.enter="saveMessage"
  >
    <template #label>
      <div v-if="voiceMessage">{{ t('chat.send.voice') }}</div>
      <div v-else-if="!isRecording">{{ t('chat.send.placeholder') }}</div>
      <div class="recording" v-else>{{ t('chat.send.recording') }}</div>
    </template>
    <template #prepend>
      <EmojiPicker :color="currentTheme === 'dark' ? 'white' : ''" @pick="onPickEmoji" @hide="inputRef?.$el.focus()" />
    </template>
    <template #append>
      <QBtn
        v-if="!message"
        dense
        round
        flat
        :color="currentTheme === 'dark' ? 'white' : ''"
        icon="eva-image-outline"
        @click="fileInput?.click()"
      />
      <QBtn
        v-if="voiceMessage"
        dense
        round
        flat
        icon="eva-stop-circle-outline"
        color="red"
        @click="voiceMessage = null"
      />
      <QBtn
        v-if="!message && !voiceMessage"
        dense
        round
        flat
        :color="currentTheme === 'dark' ? 'white' : ''"
        :icon="!isRecording ? 'eva-mic' : 'eva-mic-off'"
        @click="!isRecording ? startRecording() : stopRecording()"
      />
      <QBtn
        v-if="message || voiceMessage"
        dense
        round
        flat
        :color="currentTheme === 'dark' ? 'white' : ''"
        icon="eva-paper-plane-outline"
        style="transform: rotate(41deg)"
        @click="saveMessage"
      />
    </template>
  </QInput>
  <input v-show="false" ref="fileInput" type="file" multiple accept="image/*" @change="onMedia" />
</template>

<script setup lang="ts">
import type { QInput } from 'quasar';
import EmojiPicker from '~/EmojiPicker.vue';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useSocketStore, useAlertStore } from '@/stores';
import { useVoice } from '@/hooks';
import { debounce } from '@/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useStore();
const { user, currentTheme } = storeToRefs(store);
const socketStore = useSocketStore();
const alertStore = useAlertStore();
const message = ref('');
const files = ref<File[] | null>(null);
const inputRef = ref<QInput | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const focused = ref(false);
const { voiceMessage, isRecording, error, startRecording, stopRecording } = useVoice();
const onTypingDebounce = debounce(onTyping, 1000);
const loading = ref(false);

watch(
  () => socketStore.currentChat?.messages.length,
  () => {
    loading.value = false;
  }
);

watch(
  () => socketStore.currentChatId,
  () => {
    message.value = '';
  }
);
watch(message, () => onTypingDebounce());
watch(error, () => error.value && alertStore.addAlert('error', 'No access to microphone'));
watch(voiceMessage, () => {
  if (voiceMessage.value) {
    files.value = [voiceMessage.value];
  }
});
watch(files, () => {
  if (files.value && !voiceMessage.value) {
    saveMessage();
  }
});
watch(isRecording, () => inputRef.value?.blur());

function saveMessage() {
  if (!files.value && !message.value) {
    return;
  }
  loading.value = true;
  socketStore.socket.emit('chat:message', {
    text: message.value!,
    chatId: socketStore.currentChatId!,
    attachments: files.value,
  });
  message.value = '';
  files.value = null;
  voiceMessage.value = null;
}

async function onMedia(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    files.value = Array.from(target.files);
  }
}

function onTyping() {
  socketStore.socket.emit('chat:typing', socketStore.currentChatId!, user.value!.name, user.value!._id);
}

function onPickEmoji(emoji: string) {
  message.value = message.value + emoji;
}

function setFocus(focus: boolean) {
  focused.value = focus;
}
</script>

<style scoped lang="scss">
.input {
  & div.q-field__label {
    width: 100% !important;
  }
  font-size: 1.2em;

  & .recording {
    display: flex;
    justify-content: center;
    transition: none !important;
  }

  & .send {
    cursor: pointer;
    color: $primary;

    &:hover {
      color: $secondary;
    }
  }
}
</style>

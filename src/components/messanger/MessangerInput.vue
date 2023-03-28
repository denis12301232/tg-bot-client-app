<template>
  <QInput
    v-model="message"
    ref="inputRef"
    class="input"
    filled
    label-slot
    :loading="isMsgLoading"
    :readonly="isRecording || !!voiceMessage"
    :="$attrs"
    @keyup.enter="onSaveMsg(formData ? 'audio' : 'text')"
  >
    <template #label>
      <div v-if="voiceMessage">Записано голосовое сообщение</div>
      <div v-else-if="!isRecording">Написать сообщение</div>
      <div class="recording" v-else>Идет запись...</div>
    </template>
    <template #prepend>
      <EmojiPicker @pick="onPickEmoji" @hide="inputRef?.$el.focus()" />
    </template>
    <template #append>
      <QBtn v-if="!message" dense round flat icon="photo_camera" @click="fileInput?.click()" />
      <QBtn
        v-if="voiceMessage"
        dense
        round
        flat
        icon="stop_circle"
        color="red"
        @click="formData, (voiceMessage = null)"
      />
      <QBtn
        v-if="!message && !voiceMessage"
        dense
        round
        flat
        :icon="!isRecording ? 'mic' : 'mic_off'"
        @click="!isRecording ? startRecording() : stopRecording()"
      />
      <QBtn
        v-if="message || formData"
        dense
        round
        flat
        icon="send"
        :disable="isMsgLoading"
        @click="onSaveMsg(formData ? 'audio' : 'text')"
      />
    </template>
  </QInput>
  <input v-show="false" ref="fileInput" type="file" multiple accept="image/*" @change="onMedia" />
</template>

<script setup lang="ts">
import type { QInput } from 'quasar';
import type { IMessage } from '@/types';
import EmojiPicker from '~/EmojiPicker.vue';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useChatStore } from '@/stores';
import { useVoice, useFetch } from '@/hooks';
import { MessangerService } from '@/api/services';
import { Util } from '@/util';

const { user } = storeToRefs(useStore());
const chatStore = useChatStore();
const message = ref<string | null>(null);
const inputRef = ref<QInput | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const formData = ref<FormData | null>(null);
const { voiceMessage, isRecording, startRecording, stopRecording } = useVoice();
const { f: onSaveMsg, data: msg, loading: isMsgLoading } = useFetch<IMessage, typeof saveMsg>({ fn: saveMsg });
const onTypingDebounce = Util.debounceDecorator(onTyping, 1000);

watch(msg, (newMsg, oldMsg) => {
  if (newMsg && newMsg !== oldMsg) {
    formData.value = null;
    voiceMessage.value = null;
    message.value = null;
  }
});

watch(message, () => {
  onTypingDebounce();
});

watch(voiceMessage, () => {
  if (voiceMessage.value) {
    formData.value = new FormData();
    formData.value.append('audio', voiceMessage.value);
  }
});

watch(isRecording, () => {
  inputRef.value?.blur();
});

async function saveMsg(type: 'text' | 'audio' | 'image') {
  if (type === 'text') {
    if (message.value && chatStore.currentChatId) {
      return await MessangerService.saveMessage(chatStore.currentChatId, message.value);
    }
  } else {
    if (formData.value && chatStore.currentChatId) {
      return await MessangerService.saveMediaMessage(formData.value, chatStore.currentChatId, type);
    }
  }
}

async function onMedia(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files) {
    formData.value = new FormData();
    Array.from(files).forEach((file) => formData.value?.append('images', file));
    await onSaveMsg('image');
  }
}

function onTyping() {
  chatStore.socket.emit('typing', chatStore.currentChatId, user.value.name, user.value._id);
  //ws.value?.emit('typing', { chatId: currentChatId.value, name: user.value.name, _id: user.value._id });
}

function onPickEmoji(emoji: string) {
  message.value = message.value + emoji;
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

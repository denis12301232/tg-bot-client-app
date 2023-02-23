<template lang="pug">
QInput(
   v-model="message" 
   class="input"
   ref="inputRef"
   outlined 
   label-slot
   :loading="isTextMsgLoading || isMediaMsgLoading" 
   :readonly="isRecording"
   :="$attrs"
   @keyup.enter="formData ? onSaveMediaMessage() : onSaveMessage()"
   )
   template(#label)
      div(v-if="voiceMessage") Записано голосовое сообщение
      div(v-else-if="!isRecording") Написать сообщение
      div(v-else class="recording") Идет запись... 
   template(#append)
      QBtn(
         v-if="!message"
         dense
         round
         flat
         icon="photo_camera"
         @click="fileInput?.click()"
      )
      QBtn(
         v-if="voiceMessage"
         dense
         round
         flat
         icon="stop_circle"
         color="red"
         @click="formData, voiceMessage = null"
      )
      QBtn(
         v-if="!message && !voiceMessage"
         dense
         round
         flat
         :icon="!isRecording ? 'mic' : 'mic_off'" 
         @click="!isRecording ? startRecording() : stopRecording()"
      )
      QBtn(
         v-if="message || formData"
         dense
         round
         flat
         icon="send"
         :disable="isTextMsgLoading || isMediaMsgLoading"
         @click="formData ? onSaveMediaMessage('audio') : onSaveMessage()"
         )
input(v-show="false" type="file" ref="fileInput" accept="image/*" @change="onMedia")
</template>

<script setup lang="ts">
import type { QInput } from 'quasar'
import type { IMessage } from '@/types/interfaces'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSocketStore } from '@/stores'
import { useVoice, useFetch } from '@/hooks'
import { MessangerService } from '@/api/services'


const { currentChatId, currentChat } = storeToRefs(useSocketStore());
const message = ref('');
const inputRef = ref<QInput | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const formData = ref<FormData | null>(null);
const { voiceMessage, isRecording, startRecording, stopRecording } = useVoice();
const { f: onSaveMessage, data: textMsg, loading: isTextMsgLoading } = useFetch<IMessage>({
   fn: () => MessangerService.saveMessage(currentChatId.value, message.value),
});
const { f: onSaveMediaMessage, data: mediaMsg, loading: isMediaMsgLoading } = useFetch<IMessage>({
   fn: saveMediaMessage
});

async function onMedia(event: Event) {
   const target = event.target as HTMLInputElement;
   const files = target.files;

   if (files) {
      formData.value = new FormData();
      Array.from(files).forEach(file => formData.value?.append(file.name, file));
      await onSaveMediaMessage('image')
      target.value = '';
      formData.value = null;
   }
}

watch(voiceMessage, () => {
   if (voiceMessage.value) {
      formData.value = new FormData();
      formData.value.append('audio', voiceMessage.value);
   }
});

watch([textMsg, mediaMsg], ([newText, newMedia], [oldText, oldMedia]) => {
   if (newText && newText !== oldText) {
      currentChat.value.messages.push(newText);
      currentChat.value.updatedAt = newText.createdAt;
      message.value = '';
   }
   if (newMedia && newMedia !== oldMedia) {
      currentChat.value.messages.push(newMedia);
      currentChat.value.updatedAt = newMedia.createdAt;
   }
});

watch(isRecording, () => {
   inputRef.value?.blur();
});

async function saveMediaMessage(type: 'audio' | 'image') {
   if (formData.value) {
      const msg = await MessangerService.saveMediaMessage(formData.value, currentChatId.value, type);
      formData.value = null;
      voiceMessage.value = null;
      return msg;
   }
}
</script>

<style scoped lang="scss">
.input {

   & div.q-field__label {
      width: 100% !important;
   }

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
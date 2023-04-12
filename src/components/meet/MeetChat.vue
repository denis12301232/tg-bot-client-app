<template>
  <QCard>
    <QCardSection><h5 class="text-center">Чат</h5></QCardSection>
    <QCardSection :class="[$style.list, 'q-px-none']">
      <QScrollArea ref="scrollRef" :class="$style.list">
        <QChatMessage
          class="q-px-md"
          v-for="msg in messages"
          :sent="msg.user_id === store.user._id"
          :bg-color="msg.user_id === store.user._id ? 'blue-8' : 'green-5'"
          text-color="white"
          :text="[msg.msg]"
        >
          <template #name>
            <div class="text-bold text-deep-orange">{{ msg.user_id === store.user._id ? 'Я' : msg.user_id }}</div>
          </template>
        </QChatMessage>
      </QScrollArea>
    </QCardSection>
    <QCardActions class="q-pa-none q-pt-lg">
      <QInput
        v-model="msg"
        class="full-width"
        hide-bottom-space
        label="Сообщение участникам чата"
        filled
        @keyup.enter="sendMessage"
      >
        <template #append>
          <QBtn dense round flat icon="send" :disable="!msg" @click="sendMessage" />
        </template>
      </QInput>
    </QCardActions>
  </QCard>
</template>

<script setup lang="ts">
import type { CallInfo } from '@/types';
import type { QScrollArea } from 'quasar';
import { ref, watch } from 'vue';
import { useStore } from '@/stores';
import { WebRtcDto } from '@/api/dto';

const props = defineProps<{
  abonents: Map<string, CallInfo>;
  messages: { user_id: string; msg: string }[];
}>();
const emit = defineEmits<{
  (event: 'my-msg', msg: { user_id: string; msg: string }): void;
}>();

const store = useStore();
const msg = ref('');
const scrollRef = ref<QScrollArea | null>(null);

watch([() => props.messages.length], () => {
  const scroll = scrollRef.value?.getScroll();
  setTimeout(() => scrollRef.value?.setScrollPosition('vertical', scroll?.verticalSize || 0), 0);
});

function sendMessage() {
  if (!msg.value) return;
  const message = new WebRtcDto('meet:msg', { user_id: store.user._id, msg: msg.value }).toString();
  props.abonents.forEach((a) => a.channel?.send(message));
  emit('my-msg', { user_id: store.user._id, msg: msg.value });
  msg.value = '';
}
</script>

<style module lang="scss">
.list {
  max-height: 700px;
  min-height: 500px;
  height: 500px;
  min-width: 300px;
  max-width: 400px;
  width: 100%;
}
</style>

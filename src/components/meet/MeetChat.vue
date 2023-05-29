<template>
  <div :class="$style.content">
    <div>
      <h5 class="text-center q-py-md text-uppercase">Чат</h5>
      <QSeparator />
    </div>
    <div>
      <QScrollArea ref="scrollRef" class="fit" :thumb-style="{ width: '7px' }">
        <QChatMessage
          v-for="(msg, index) in messages"
          class="q-px-md"
          :key="index"
          :sent="msg.user_id === user._id"
          :bg-color="msg.user_id === user._id ? 'blue-8' : 'green-5'"
          text-color="white"
          :text="[msg.msg]"
        >
          <template #name>
            <div class="text-bold text-deep-orange">
              {{ msg.user_id === user._id ? 'Я' : abonents.get(msg.user_id)?.info?.name }}
            </div>
          </template>
        </QChatMessage>
      </QScrollArea>
    </div>
    <div>
      <QInput
        v-model="msg"
        class="full-width"
        hide-bottom-space
        label="Сообщение участникам встречи"
        standout
        @keyup.enter="sendMessage"
      >
        <template #append>
          <QBtn
            dense
            round
            flat
            icon="eva-paper-plane-outline"
            :disable="!msg"
            @click="sendMessage"
            style="transform: rotate(41deg)"
          />
        </template>
      </QInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAbonent, IUser } from '@/types';
import type { QScrollArea } from 'quasar';
import { computed, ref, watch } from 'vue';
import { useStore } from '@/stores';
import { WebRtcDto } from '@/api/dto';

const props = defineProps<{
  abonents: Map<string, IAbonent>;
  messages: { user_id: string; msg: string }[];
}>();
const emit = defineEmits<{
  (event: 'my-msg', msg: { user_id: string; msg: string }): void;
}>();

const store = useStore();
const msg = ref('');
const scrollRef = ref<QScrollArea | null>(null);
const user = computed(() => store.user || ({} as IUser));

watch([() => props.messages.length], () => {
  const scroll = scrollRef.value?.getScroll();
  setTimeout(() => scrollRef.value?.setScrollPosition('vertical', scroll?.verticalSize || 0), 0);
});

function sendMessage() {
  if (!msg.value) return;
  const message = new WebRtcDto('meet:msg', { user_id: user.value._id, msg: msg.value }).toString();
  props.abonents.forEach((a) => a.channel?.send(message));
  emit('my-msg', { user_id: user.value._id, msg: msg.value });
  msg.value = '';
}
</script>

<style module lang="scss">
.content {
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>

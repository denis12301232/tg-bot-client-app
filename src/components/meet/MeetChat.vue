<template>
  <div :class="$style.content">
    <div>
      <h5 class="text-center q-py-md text-uppercase">{{ t('meetId.chat.title') }}</h5>
      <QSeparator />
    </div>
    <div>
      <QScrollArea ref="scrollRef" class="fit" :thumb-style="{ width: '7px' }">
        <QChatMessage
          v-for="(msg, index) in messages"
          class="q-px-md"
          :key="index"
          :sent="msg.userId === user._id"
          :bg-color="msg.userId === user._id ? 'blue-8' : 'green-5'"
          text-color="white"
          :text="[msg.msg]"
        >
          <template #name>
            <div class="text-bold text-deep-orange">
              {{ msg.userId === user._id ? 'Я' : abonents.get(msg.userId)?.info?.name }}
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
        :label="t('meetId.chat.send.placeholder')"
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
import type { Props, IUser } from '@/types';
import type { QScrollArea } from 'quasar';
import { computed, ref, watch } from 'vue';
import { useStore } from '@/stores';
import { WebRtcDto } from '@/api/dto';
import { useI18n } from 'vue-i18n';

const props = defineProps<Props.Meet.Chat>();
const emit = defineEmits<{ 'my-msg': [msg: { userId: string; msg: string }] }>();
const { t } = useI18n();
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
  const message = new WebRtcDto('meet:msg', { userId: user.value._id, msg: msg.value }).toString();
  props.abonents.forEach((a) => a.channel?.send(message));
  emit('my-msg', { userId: user.value._id, msg: msg.value });
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

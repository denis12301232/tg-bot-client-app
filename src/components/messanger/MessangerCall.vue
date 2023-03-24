<template>
  <QCard>
    <QCardSection class="text-center text-h6"> Набрать </QCardSection>
    <QCardActions align="between">
      <QBtn
        dense
        round
        flat
        color="positive"
        icon="call"
        @click="user_id && !currentCall ? call(user_id) : chatStore.answer()"
      />
      <QSpinnerDots v-if="calling" size="2em" />
      <QBtn v-close-popup dense round flat color="negative" icon="call_end" @click="test" />
    </QCardActions>
    <QCardSection>
      <video :class="$style.video" ref="userVideo"></video>
      <QBtn dense flat round :icon="muted ? 'volume_up' : 'volume_off'" @click="minimizeUserVoice" />
      <QBtn @click="disableMicrophone">TEST</QBtn>
      <!-- <div class="video-grid">
        <video ref="myVideo" muted></video>
        <video ref="userVideo"></video>
      </div> -->
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import type { MediaConnection } from 'peerjs';
import { onMounted, ref, watchEffect, onBeforeUnmount } from 'vue';
import { useChatStore } from '@/stores';
import { storeToRefs } from 'pinia';

const props = defineProps<{
  user_id?: string;
}>();

const chatStore = useChatStore();

const { myVideo, userVideo, currentCall, myStream } = storeToRefs(chatStore);
const calling = ref(false);
const muted = ref(false);

watchEffect(() => {
  if (currentCall.value) {
    calling.value = false;
  }
});

function call(user_id: string) {
  calling.value = true;
  chatStore.callToUser(user_id);
}

function minimizeUserVoice() {
  muted.value = !muted.value;
  userVideo.value && (userVideo.value.muted = muted.value);
}

function test() {
  currentCall.value?.close();
}

async function disableMicrophone() {
  const audioTrack = myStream.value?.getAudioTracks().at(0);
  if (audioTrack) {
    audioTrack.enabled = !audioTrack.enabled;
  }
}
</script>

<style module lang="scss">
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
}

.video {
  width: 100%;
  object-fit: cover;
}
</style>

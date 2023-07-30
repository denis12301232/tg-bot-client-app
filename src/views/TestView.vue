<template>
  <QBtn @click="test">fff</QBtn>
  <a :href="url">gggg</a>
</template>

<script setup lang="ts">
import { ChatService } from '@/api/services';
import { ref } from 'vue';

const url = ref<string>();

async function test() {
  const blob = await ChatService.getFileFromS3('3d404d0a-221b-4cdb-95bb-eae35ddbac41.webm').blob();
  const file = new File([blob], 'test', { type: 'video/webm' });
  url.value = URL.createObjectURL(file);
}
</script>

<template>
  <div class="column items-center q-pa-sm">
    <form class="meet q-mt-lg column items-center" @submit.prevent="createNewMeet">
      <h5 class="text-center">Создать встречу</h5>
      <QInput v-model="meetTitle" class="q-my-md full-width" label="Название" standout />
      <QBtn :disable="!meetTitle" color="red-10" label="Создать" type="submit" />
    </form>
    <form class="meet q-mt-lg column items-center" @submit.prevent="joinMeet">
      <h5 class="text-center">Присоедениться</h5>
      <QInput v-model="meetId" class="q-my-md full-width" label="ID встречи" standout />
      <QBtn :disable="!meetId" color="red-10" label="Присоедениться" type="submit" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useChatStore } from '@/stores';

const router = useRouter();
const { socket } = useChatStore();
const meetTitle = ref('');
const meetId = ref('');

onMounted(() => {
  socket.on('meet:create', onMeetCreate);
});

onUnmounted(() => {
  socket.removeListener('meet:create', onMeetCreate);
});

function createNewMeet() {
  socket.emit('meet:create', meetTitle.value);
}

function joinMeet() {
  router.push({ path: `/meet/${meetId.value}` });
}

function onMeetCreate(meetId: string) {
  router.push({ path: `/meet/${meetId}` });
}
</script>

<style lang="scss" scoped>
.meet {
  max-width: 500px;
  width: 100%;
}
</style>

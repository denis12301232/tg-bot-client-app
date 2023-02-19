<template lang="pug">
QCard(class="content")
   QCardSection
      div(class="text-h5 text-center q-pb-lg") Создать группу
      QInput(v-model="title" outlined label="Название")
   QCardActions(align="center")
      QBtn(color="primary" :loading="loading" @click="onCreateGroup") Создать
</template>

<script setup lang="ts">
import type { ChatResponse } from '@/types/http'
import { ref, watch } from 'vue'
import { useStore, useSocketStore } from '@/stores'
import { MessangerService } from '@/api/services'
import { useFetch } from '@/hooks'


const emit = defineEmits<{
   (event: 'close'): void;
}>();
const store = useStore();
const socketStore = useSocketStore();
const title = ref('');
const { f: onCreateGroup, loading, data: group } = useFetch<ChatResponse>({
   fn: () => MessangerService.createGroup([store.user._id], title.value),
});

watch(group, () => {
   if (group.value)
      socketStore.chatsList.push(group.value); 
      emit('close');
});
</script>

<style scoped lang="scss">
.content {
   padding: 10px 10px;
   min-width: 300px;
}
</style>
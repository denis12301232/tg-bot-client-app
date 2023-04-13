<template>
  <MeetVideos />
</template>

<script setup lang="ts">
// import type { SocketTyped } from '@/types';
// import type { WebRtcDto } from '@/api/dto';
// import MeetLayout from '@/layouts/MeetLayout.vue';
// import MeetChat from '~/meet/MeetChat.vue';
import MeetVideos from '~/meet/MeetVideos.vue';
// import { ref, onMounted, onBeforeUnmount } from 'vue';
// import { useRoute } from 'vue-router';
// import { useChatStore } from '@/stores';
// import { useWebRtc } from '@/hooks';

// const route = useRoute();
// const { socket } = useChatStore();
// const { abonents, MY_VIDEO } = useWebRtc(socket as SocketTyped, { setChannelEvents });
// const messages = ref<{ user_id: string; msg: string }[]>([]);
// const meetId = String(route.params.id);
// const chat = ref(false);
// // const meetVideosRef = ref<InstanceType<typeof MeetVideos> | null>(null);

// onMounted(async () => {
//   const myInfo = abonents.value.set(MY_VIDEO, { peer: null, stream: null, channel: null }).get(MY_VIDEO)!;
//   myInfo.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//   socket.emit('meet:join', String(route.params.id));
// });
// onBeforeUnmount(() => socket.emit('meet:leave', meetId));

// function setChannelEvents(channel: RTCDataChannel) {
//   channel.onopen = onOpen;
//   channel.onmessage = onMessage;
// }

// function onOpen(this: RTCDataChannel) {
//   console.log('channel open', abonents.value);
// }

// function onMessage(this: RTCDataChannel, e: MessageEvent) {
//   const msg = JSON.parse(e.data) as WebRtcDto;
//   switch (msg.event) {
//     case 'meet:msg':
//       return messages.value.push(msg.data);
//     case 'toggle-track':
//       return onToggleTrack(msg.data);
//   }
// }

// function onToggleTrack({ track, value, peerId }: { track: 'audio' | 'video'; value: boolean; peerId: string }) {
//   // if(meetVideosRef.value?.videos.get(peerId)?.mute){
//   //   meetVideosRef.value.videos.get(peerId)!.mute[track] = value
//   // }
// }
</script>

<style lang="scss" scoped>
.videos {
  display: grid;
  grid-template-columns: repeat(auto-fit, 500px);
  gap: 5px;
  justify-content: center;
}

@media (max-width: 1368px) {
  .videos {
    grid-template-columns: repeat(auto-fit, 400px);
  }
}

@media (max-width: 1024px) {
  .videos {
    grid-template-columns: repeat(auto-fit, 350px);
  }
}

@media (max-width: 768px) {
  .videos {
    grid-template-columns: repeat(auto-fit, 300px);
  }
}
</style>

<template>
  <QLayout :class="store.currentTheme === 'dark' ? 'dark' : 'light'" view="hhh lpR fff">
    <QDrawer v-model="open.left" side="left" bordered>
      <!-- drawer content -->
    </QDrawer>
    <QDrawer v-model="open.right" side="right" bordered>
      <component :is="rightDrawer.component" :="rightDrawer.props" @my-msg="(msg: any) => messages.push(msg)" />
    </QDrawer>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
    <QFooter class="footer" reveal bordered>
      <QToolbar class="row justify-between">
        <div></div>
        <QBtnGroup flat rounded>
          <QBtn :icon="myVideo?.mute.audio ? 'mic' : 'mic_off'" @click="toggleTrackMuteAndRelay('audio')" />
          <QBtn :icon="myVideo?.mute.video ? 'videocam' : 'videocam_off'" @click="toggleTrackMuteAndRelay('video')" />
          <QBtn icon="chat_bubble" @click="[setComponent('chat'), toggleDrawer('right')]">
            <QBadge v-if="unreadMessages" color="red" floating rounded>{{ unreadMessages }}</QBadge>
          </QBtn>
          <QBtn icon="call_end" color="negative" flat @click="goBack" />
        </QBtnGroup>
        <div class="row">
          <QBtn dense flat round icon="groups" @click="[setComponent('user-list'), toggleDrawer('right')]" />
          <QBtn dense flat round icon="info" @click="[setComponent('info'), toggleDrawer('right')]" />
        </div>
      </QToolbar>
    </QFooter>
  </QLayout>
</template>

<script setup lang="ts">
import type CallVideo from '~/CallVideo.vue';
import MeetChat from '~/meet/MeetChat.vue';
import MeetInfo from '~/meet/MeetInfo.vue';
import MeetUserList from '~/meet/MeetUserList.vue';
import { ref, reactive, provide, computed, onMounted, onBeforeUnmount, shallowRef, watch } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { useNavigation, useWebRtc } from '@/hooks';
import { useRoute } from 'vue-router';
import { WebRtcDto } from '@/api/dto';

const route = useRoute();
const store = useStore();
const { socket } = useChatStore();
const { goBack } = useNavigation();
const { abonents, MY_VIDEO } = useWebRtc(socket as any, { setChannelEvents });
const open = reactive({ left: false, right: false });
const videos = ref<Map<string, InstanceType<typeof CallVideo> | null>>(new Map());
const myVideo = computed(() => videos.value.get(MY_VIDEO));
const meetId = route.params.id?.toString();
const messages = ref<{ user_id: string; msg: string }[]>([]);
const component = ref<'chat' | 'info' | 'user-list'>('chat');
const unreadMessages = ref(0);
const rightDrawer = computed(() => {
  switch (component.value) {
    case 'info':
      return { component: MeetInfo, props: { link: meetId } };
    case 'user-list':
      return { component: MeetUserList, props: { abonents: abonents.value } };
    default:
      return { component: MeetChat, props: { abonents: abonents.value, messages: messages.value } };
  }
});

watch(() => open.right, () =>{ 
  if(open.right && component.value === 'chat') {
    unreadMessages.value = 0;
  }
});

provide('videos', videos);
provide('abonents', abonents);
onMounted(async () => {
  const myInfo = abonents.value
    .set(MY_VIDEO, { peer: null, stream: null, channel: null, user: store.user })
    .get(MY_VIDEO)!;
  myInfo.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  socket.emit('meet:join', meetId);
});
onBeforeUnmount(() => socket.emit('meet:leave', meetId));

function toggleDrawer(side: 'left' | 'right') {
  open[side] = !open[side];
}

function setComponent(c: 'chat' | 'info' | 'user-list') {
  component.value = c;
}

function toggleTrackMuteAndRelay(track: 'video' | 'audio') {
  myVideo.value?.toggleTrackMute(track);
  const msg = new WebRtcDto('toggle-track', {
    track,
    peerId: store.user._id,
    value: myVideo.value?.mute[track],
  }).toString();
  abonents.value.forEach((a) => a.channel?.send(msg));
}

function setChannelEvents(channel: RTCDataChannel) {
  channel.onopen = onOpen;
  channel.onmessage = onMessage;
}

function onOpen(this: RTCDataChannel) {
  console.log('channel open', abonents.value);
}

function onMessage(this: RTCDataChannel, e: MessageEvent) {
  const msg = JSON.parse(e.data) as WebRtcDto;
  switch (msg.event) {
    case 'meet:msg':
      return onMeetMsg(msg.data);
    case 'toggle-track':
      return onToggleTrack(msg.data);
  }
}

function onMeetMsg(msg: any) {
  messages.value.push(msg);
  if (!open.right || (open.right && component.value !== 'chat')) {
    unreadMessages.value++;
  }
}

function onToggleTrack({ track, value, peerId }: { track: 'audio' | 'video'; value: boolean; peerId: string }) {
  if (videos.value.get(peerId)?.mute) {
    videos.value.get(peerId)!.mute[track] = value;
  }
}
</script>

<style lang="scss" scoped>
.light {
  & .footer {
    background-color: white;
    color: black;
  }
}

.dark {
  & .footer {
    background-color: #121212;
  }
}
</style>

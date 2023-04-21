<template>
  <QLayout :class="store.currentTheme === 'dark' ? 'dark' : 'light'" view="hhh lpR fff">
    <QDrawer v-model="open.left" side="left" bordered>
      <!-- drawer content -->
    </QDrawer>
    <QDrawer v-model="open.right" side="right" bordered>
      <component :is="rightDrawer?.component" :="rightDrawer?.props" @my-msg="(msg: any) => messages.push(msg)" />
    </QDrawer>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
    <QFooter class="footer" reveal bordered>
      <QToolbar class="row justify-between">
        <div></div>
        <QBtnGroup flat rounded>
          <QBtn
            :icon="videos.get(store.user._id)?.mute.audio ? 'mic' : 'mic_off'"
            @click="toggleTrackMuteAndRelay('audio')"
          />
          <QBtn
            :icon="videos.get(store.user._id)?.mute.video ? 'videocam' : 'videocam_off'"
            @click="toggleTrackMuteAndRelay('video')"
          />
          <QBtn icon="present_to_all" @click="shareMyScreen" />
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
import { ref, reactive, provide, computed, onMounted, onBeforeUnmount, shallowRef, watch, type DefineComponent } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { useNavigation, useWebRtc } from '@/hooks';
import { useRoute } from 'vue-router';
import { WebRtcDto } from '@/api/dto';


interface RightDrawer {
  component: typeof MeetInfo | typeof MeetUserList | typeof MeetChat;
  props: { [name: string]: any };
}

const route = useRoute();
const store = useStore();
const { socket } = useChatStore();
const { goBack } = useNavigation();
const { abonents, streams, streamIds, captureMyStream } = useWebRtc(socket as any, store.user._id,
{ setChannelEvents });
const open = reactive({ left: false, right: false });
const videos = ref<Map<string, InstanceType<typeof CallVideo> | null>>(new Map());
const messages = ref<{ user_id: string; msg: string }[]>([]);
const component = ref<'chat' | 'info' | 'user-list'>('chat');
const unreadMessages = ref(0);
const rightDrawer = shallowRef<RightDrawer | null>(null);
const meetId = route.params.id?.toString();

watch(component, () => {
  switch (component.value) {
    case 'info':
      return rightDrawer.value = { component: MeetInfo, props: { link: meetId } };
    case 'user-list':
      return rightDrawer.value = { component: MeetUserList, props: { abonents: abonents.value } };
    default:
      return rightDrawer.value = { component: MeetChat, props: { abonents: abonents.value, messages: messages.value } };
  }
}, { immediate: true });

watch([() => open.right], () => {
  if (open.right && component.value === 'chat') {
    unreadMessages.value = 0;
  }
});

provide('videos', videos);
provide('abonents', abonents);
provide('streams', streams);
onMounted(() => {
  captureMyStream('camera', { video: true, audio: true })
    .then((stream) => socket.emit('meet:join', meetId))
    .catch((e) => console.error(e));
});
onBeforeUnmount(() => {
  for (const type of ['camera', 'screen'] as ['camera', 'screen']) {
    const stream = streams[type].get(store.user._id);
    stream?.getTracks().forEach((track) => track.stop());
  }
  socket.emit('meet:leave', meetId);
});

function toggleDrawer(side: 'left' | 'right') {
  open[side] = !open[side];
}

function setComponent(comp: 'chat' | 'info' | 'user-list') {
  component.value = comp;
}

function toggleTrackMuteAndRelay(track: 'video' | 'audio') {
  videos.value.get(store.user._id)?.toggleTrackMute(track);
  const msg = new WebRtcDto('track:toggle', {
    track,
    peerId: store.user._id,
    value: videos.value.get(store.user._id)?.mute[track],
  }).toString();
  abonents.value.forEach((a) => a.channel?.send(msg));
}

function setChannelEvents(channel: RTCDataChannel) {
  channel.onmessage = onMessage;
}

function onMessage(this: RTCDataChannel, e: MessageEvent) {
  const msg = JSON.parse(e.data) as WebRtcDto;
  switch (msg.event) {
    case 'meet:msg':
      return onMeetMsg(msg.data);
    case 'track:toggle':
      return onTrackToggle(msg.data);
    case 'identify-stream':
      return onIdentifyStream(msg.data);
    case 'track:end':
      return onTrackEnd(msg.data);
    case 'track:toggle-init':
      return onTrackToggleInit(msg.data);
  }
}

function onTrackToggleInit(peerId: string) {
  for (const type of ['camera', 'screen'] as ['camera', 'screen']) {
    const stream = streams[type].get(store.user._id);
    stream?.getTracks().forEach((track) => {
      const msg = new WebRtcDto('track:toggle', {
        track: track.kind,
        peerId: store.user._id,
        value: track.enabled,
      }).toString();
      abonents.value.get(peerId)?.channel?.send(msg);
    });
  }
}

function onMeetMsg(msg: any) {
  messages.value.push(msg);
  if (!open.right || (open.right && component.value !== 'chat')) {
    unreadMessages.value++;
  }
}

function onTrackToggle({ track, value, peerId }: { track: 'audio' | 'video'; value: boolean; peerId: string }) {
  if (videos.value.get(peerId)?.mute) {
    videos.value.get(peerId)!.mute[track] = value;
  }
}

function onTrackEnd({ peerId, type }: { peerId: string; type: 'camera' | 'screen' }) {
  streams[type].delete(peerId);
}

async function shareMyScreen() {
  captureMyStream('screen', { video: true })
    .then((stream) => {
      const msg = new WebRtcDto('identify-stream', { type: 'screen', id: stream.id }).toString();
      abonents.value.forEach((a) => a.channel?.send(msg));
      abonents.value.forEach((a) => stream.getTracks().forEach((track) => a.peer?.addTrack(track, stream)));
    })
    .catch((e) => console.error(e));
}

function onIdentifyStream({ type, id }: { type: 'camera' | 'screen'; id: string }) {
  streamIds[type].add(id);
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

<template>
  <QLayout view="hhh lpR fff">
    <QDrawer v-model="open.left" side="left" bordered>
      <!-- drawer content -->
    </QDrawer>
    <QDrawer v-model="open.right" side="right" bordered>
      <component :is="rightDrawer?.component" :="rightDrawer?.props" @my-msg="(msg: any) => messages.push(msg)" />
    </QDrawer>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
    <QHeader class="footer" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="red-10" @click="goBack" />
        <QToolbarTitle>{{ t('meetId.layout.title') }}</QToolbarTitle>
      </QToolbar>
    </QHeader>
    <QFooter class="footer" reveal bordered>
      <QToolbar class="row justify-between overflow-auto">
        <div></div>
        <QBtnGroup flat>
          <QBtn
            :icon="videos.get(user._id)?.mute.audio ? 'eva-mic-off-outline' : 'eva-mic-outline'"
            @click="toggleTrackMuteAndRelay('audio')"
          >
            <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('meetId.hints.mic') }}</QTooltip>
          </QBtn>
          <QBtn
            :icon="videos.get(user._id)?.mute.video ? 'eva-video-off-outline' : 'eva-video-outline'"
            @click="toggleTrackMuteAndRelay('video')"
          >
            <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('meetId.hints.cam') }}</QTooltip>
          </QBtn>
          <QBtn class="share" icon="eva-cast" :disable="streams.screen.has(user._id)" @click="shareMyScreen">
            <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('meetId.hints.share') }}</QTooltip>
          </QBtn>
          <QBtn icon="eva-message-circle-outline" @click="[setComponent('chat'), toggleDrawer('right')]">
            <QBadge v-if="unreadMessages" color="red" floating rounded>{{ unreadMessages }}</QBadge>
            <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('meetId.hints.chat') }}</QTooltip>
          </QBtn>
          <QBtn icon="eva-phone-off-outline" color="negative" flat @click="goBack">
            <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('meetId.hints.leave') }}</QTooltip>
          </QBtn>
        </QBtnGroup>
        <div class="row no-wrap">
          <QBtn dense flat round icon="eva-people-outline" @click="[setComponent('user-list'), toggleDrawer('right')]">
            <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('meetId.hints.people') }}</QTooltip>
          </QBtn>
          <QBtn dense flat round icon="eva-info" @click="[setComponent('info'), toggleDrawer('right')]">
            <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('meetId.hints.info') }}</QTooltip>
          </QBtn>
        </div>
      </QToolbar>
    </QFooter>
  </QLayout>
</template>

<script setup lang="ts">
import type { I18n, Langs } from '@/types';
import type CustomVideo from '~/CustomVideo.vue';
import Meet from '~/meet';
import { ref, reactive, provide, onMounted, onBeforeUnmount, onUnmounted, shallowRef, watch, computed } from 'vue';
import { useStore, useChatStore } from '@/stores';
import { useNavigation, useWebRtc, useFetch } from '@/hooks';
import { useRoute } from 'vue-router';
import { WebRtcDto } from '@/api/dto';
import { MeetService } from '@/api/services';
import { IUser } from '@/types';
import { useI18n } from 'vue-i18n';

type T = { title: string };
type S = typeof MeetService.getMeetInfo;

interface RightDrawer {
  component: typeof Meet[keyof typeof Meet];
  props: { [name: string]: any };
}

const { t } = useI18n<I18n, Langs>();
const route = useRoute();
const store = useStore();
const { socket } = useChatStore();
const { goBack } = useNavigation();
const user = computed(() => store.user || ({} as IUser));
const { abonents, streams, streamIds, captureMyStream } = useWebRtc(socket, user.value._id, { setChannelEvents });
const { request: getMeetInfo, data: meetInfo, error } = useFetch<T, S>(MeetService.getMeetInfo);
const open = reactive({ left: false, right: false });
const videos = ref<Map<string, InstanceType<typeof CustomVideo> | null>>(new Map());
const messages = ref<{ user_id: string; msg: string }[]>([]);
const component = ref<'chat' | 'info' | 'user-list'>('chat');
const unreadMessages = ref(0);
const rightDrawer = shallowRef<RightDrawer | null>(null);
const meetId = route.params.id?.toString();

provide('rtc', { videos, abonents, streams });
watch(
  component,
  () => {
    switch (component.value) {
      case 'info':
        rightDrawer.value = { component: Meet.Info, props: { link: meetId, title: meetInfo.value?.title } };
        break;
      case 'user-list':
        rightDrawer.value = { component: Meet.UserList, props: { abonents: abonents.value } };
        break;
      default:
        rightDrawer.value = { component: Meet.Chat, props: { abonents: abonents.value, messages: messages.value } };
        break;
    }
  },
  { immediate: true }
);

watch([() => open.right], () => {
  if (open.right && component.value === 'chat') {
    unreadMessages.value = 0;
  }
});

watch(error, () => {
  goBack();
  store.setAlert(true, { message: 'Встреча не найдена!', type: 'error' });
});

onMounted(() => {
  socket.on('error:meet-join', onErrorMeetJoin);
  getMeetInfo(meetId).then(() => {
    captureMyStream('camera', { video: true, audio: true })
      .then(() => socket.emit('meet:join', meetId))
      .catch((e) => {
        goBack();
        store.setAlert(true, { message: 'Нет доступа к камере или микрофону!', type: 'warning' });
      });
  });
});
onBeforeUnmount(() => {
  for (const type of ['camera', 'screen'] as ['camera', 'screen']) {
    const stream = streams[type].get(user.value._id);
    stream?.getTracks().forEach((track) => track.stop());
  }
  socket.emit('meet:leave', meetId);
});
onUnmounted(() => socket.removeListener('error:meet-join', onErrorMeetJoin));

function onErrorMeetJoin(code: number, message: string) {
  error.value = message;
}

function toggleDrawer(side: 'left' | 'right') {
  open[side] = !open[side];
}

function setComponent(comp: 'chat' | 'info' | 'user-list') {
  component.value = comp;
}

function toggleTrackMuteAndRelay(track: 'video' | 'audio') {
  videos.value.get(user.value._id)?.muteTrack(track);
  const msg = new WebRtcDto('track:toggle', {
    track,
    peerId: user.value._id,
    value: videos.value.get(user.value._id)?.mute[track],
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
    const stream = streams[type].get(user.value._id);
    for (const track of stream?.getTracks() || []) {
      const msg = new WebRtcDto('track:toggle', {
        track: track.kind,
        peerId: user.value._id,
        value: !track.enabled,
      }).toString();
      abonents.value.get(peerId)?.channel?.send(msg);
    }
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
html.light {
  & .footer {
    background-color: white;
    color: black;
  }
}

html.dark {
  & .footer {
    background-color: #121212;
  }
}

@media (max-width: 768px) {
  .share {
    display: none;
  }
}
</style>

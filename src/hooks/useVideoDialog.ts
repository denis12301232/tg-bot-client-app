import { useStore } from '@/stores';
import type { Peer, MediaConnection } from 'peerjs'
import { type Ref, ref, watchEffect } from 'vue'


export default function useVideoDialog(peer: Ref<Peer | null>) {
   const store = useStore()
   const myVideo = ref<HTMLVideoElement | null>(null);
   const userVideo = ref<HTMLVideoElement | null>(null);
   const myStream = ref<MediaStream | null>(null);
   const currentCall = ref<MediaConnection | null>(null);

   const effect = watchEffect(() => {
      if (peer.value) {
         peer.value?.on('call', onCall);
         effect();
      }
   });

   async function onCall(call: MediaConnection) {
      console.log('ON CALL');

      store.modal = true;
      currentCall.value = call;
      currentCall.value.on('stream', (userVideoStream) => userVideo.value && addVideoStream(userVideo.value, userVideoStream));
      currentCall.value.on('close', onCallClose);
   }

   async function callToUser(id: string) {
      console.log('CALL TO USER', id);

      myStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (myVideo.value) {
         addVideoStream(myVideo.value, myStream.value);
      }
      connectToNewUser(id, myStream.value);
   }

   async function answer() {
      console.log('ANSWER');

      if (!myStream.value) {
         myStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      }
      myVideo.value && addVideoStream(myVideo.value, myStream.value);
      currentCall.value?.answer(myStream.value);
   }

   function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', () => video.play());
   }

   function connectToNewUser(user_id: string, stream: MediaStream) {
      console.log('I CALL');
      myVideo.value && addVideoStream(myVideo.value, stream);
      currentCall.value = peer.value?.call(user_id, stream) || null;
      currentCall.value?.on('stream', (userVideoStream) => {
         userVideo.value && addVideoStream(userVideo.value, userVideoStream);
      });
      currentCall.value?.on('close', onCallClose);
   }

   function onCallClose() {
      myStream.value?.getTracks().at(0)?.stop();
      userVideo.value?.pause();
      currentCall.value = null;
   }

   return { myVideo, userVideo, myStream, currentCall, callToUser, answer, connectToNewUser }
}
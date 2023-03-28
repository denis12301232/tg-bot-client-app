import { Peer, type PeerJSOption } from 'peerjs';
import { ref } from 'vue';


export default function useWebRTC() {
   const peer = ref<Peer | null>(null);
   const error = ref('');
   const config = ref({ id: '', options: {} as PeerJSOption });


   function connect(id: string, options: PeerJSOption) {
      config.value = { id, options };
      peer.value = new Peer(config.value.id, config.value.options)
      peer.value.on('close', onClose);
      peer.value.on('open', onOpen);
      peer.value.on('error', onError);
   }

   function onClose() {
      console.log('CLOSE');
      //peer.value = new Peer(config.value.id, config.value.options);
   }

   function onOpen(id: string) {
      console.log('Opened peer');
   }

   function onError(e: Error) {
      console.log(e);
   }

   return { peer, error, connect }
}
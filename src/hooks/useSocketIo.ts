import { ref } from 'vue'
import { io } from 'socket.io-client'


export default function useSocketIo() {
   const socket = ref(io(import.meta.env.VITE_SOCKET_URL, {
      auth: (cb) => cb({ token: localStorage.getItem('token') }),
      autoConnect: false,
      reconnectionAttempts: Infinity,
      timeout: 10000,
      transports: ['websocket'],
      forceNew: true
   }));
   const isConnected = ref(false);

   function onConnect() {
      isConnected.value = true;
   }

   function onDisconnect() {
      isConnected.value = false;
   }

   function connect() {
      socket.value.connect();
   }

   socket.value.on('connect', onConnect);
   socket.value.on('disconnect', onDisconnect);

   return { socket, isConnected, connect }
}
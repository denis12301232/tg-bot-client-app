import type { SocketTyped } from '@/types';
import { ref, markRaw } from 'vue';
import { io } from 'socket.io-client';


export default function useSocketIo(url: string) {
  const socket = markRaw<SocketTyped>(
    io(url, {
      auth: (cb) => cb({ token: localStorage.getItem('token') }),
      autoConnect: false,
      reconnectionAttempts: Infinity,
      timeout: 10000,
      transports: ['websocket'],
      forceNew: true,
      path: '/socket',
    })
  );
  const isConnected = ref(false);

  function onConnect() {
    isConnected.value = true;
  }

  function onDisconnect() {
    isConnected.value = false;
  }

  function connect() {
    socket.connect();
  }

  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);

  return { socket, isConnected, connect };
}

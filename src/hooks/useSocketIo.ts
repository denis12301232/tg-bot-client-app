import type { SocketTyped } from '@/types';
import { ref, markRaw } from 'vue';
import { io } from 'socket.io-client';

export default function useSocketIo(url: string) {
  const isConnected = ref(false);
  const socket = io(url, {
    auth: (cb) => cb({ token: localStorage.getItem('token') }),
    autoConnect: false,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ['websocket'],
    forceNew: true,
    path: '/socket',
  });

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

  return { socket: markRaw<SocketTyped>(socket), isConnected, connect };
}

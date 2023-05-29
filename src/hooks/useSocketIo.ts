import type { SocketTyped } from '@/types';
import { ref, markRaw } from 'vue';
import { io } from 'socket.io-client';
import { ENV } from '@/util';

export default function useSocketIo() {
  const socket = markRaw(
    io(ENV.SOCKET_URL, {
      auth: (cb) => cb({ token: localStorage.getItem('token') }),
      autoConnect: false,
      reconnectionAttempts: Infinity,
      timeout: 10000,
      transports: ['websocket'],
      forceNew: true,
      path: '/socket',
    }) as SocketTyped
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

export default class Env {
  static readonly API_V1 = import.meta.env.VITE_API_V1;
  static readonly SERVER_URL = import.meta.env.VITE_SERVER_URL;
  static readonly SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
  static readonly STUN_SERVERS = import.meta.env.VITE_STUN_SERVERS.split(' ');
  static readonly TITLE = import.meta.env.VITE_TITLE;
}

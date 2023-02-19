/// <reference types="vite/client" />

interface ImportMetaEnv {
   readonly VITE_API_V1: string;
   readonly VITE_SERVER_URL: string;
   readonly VITE_SOCKET_URL: string;
}

interface ImportMeta {
   readonly env: ImportMetaEnv;
}
import type { Socket } from 'socket.io-client'
import type { ChatResponse, IMessage } from '@/types'


export type SocketTyped = Socket<ServerToClientEvents, ClientToServerEvents>

interface ServerToClientEvents {
   'chat:message': (msg: IMessage) => void;
   'chat:typing': (chat_id: string, user_name: string, user_id: string) => void;
   'chat:read-message': (chat_id: string, user_id: string) => void;
   'chat:invite-to-group': (chat: ChatResponse) => void;
   'chat:kick-from-group': (chat_id: string) => void;
   'chat:user-status': (user_id: string, status: 'online' | 'offline') => void;
   'rtc:call': (peer_id: string, chat_id: string) => void;
   'rtc:add-peer': (peer_id: string, offer: boolean) => void;
   'rtc:session-description': (peer_id: string, sessionDescription: RTCSessionDescriptionInit) => void;
   'rtc:ice-candidate': (peer_id: string, iceCandidate: RTCIceCandidate) => void;
   'rtc:remove-peer': (peer_id: string) => void;
   'rtc:call-cancel': () => void;
   'meet:create': (meetId: string) => void;
}

interface ClientToServerEvents {
   'chat:typing': (chat_id: string, user_name: string, user_id: string) => void;
   'rtc:call': (chat_id: string) => void;
   'rtc:answer': (answer: boolean, chat_id: string) => void;
   'rtc:relay-ice': (peer_id: string, iceCandidate: RTCIceCandidate) => void;
   'rtc:relay-sdp': (peer_id: string, sessionDescription: RTCSessionDescriptionInit) => void;
   'rtc:remove-peer': (chat_id: string) => void;
   'rtc:call-cancel': (chat_id: string) => void;
   'meet:create': (title: string) => void;
   'meet:leave': (meetId: string) => void;
   'meet:join': (meetId: string) => void;
}
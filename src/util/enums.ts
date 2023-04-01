export enum ACTIONS {
   CHAT_MESSAGE = 'chat:message',
   CHAT_READ_MESSAGE = 'chat:read-message',
   CHAT_USER_STATUS = 'chat:user-status',
   CHAT_INVITE_TO_GROUP = 'chat:invite-to-group',
   CHAT_KICK_FROM_GROUP = 'chat:kick-from-group',
   CHAT_TYPING = 'chat:typing',
   PEER_JOIN = 'peer:join',
   PEER_LEAVE = 'peer:leave',
   PEER_ADD = 'peer:add',
   PEER_REMOVE = 'peer:remove',
   PEER_RELAY_SDP = 'peer:relay-sdp',
   PEER_RELAY_ICE = 'peer:relay-ice',
   PEER_ICE_CANDIDATE = 'peer:ice-candidate',
   PEER_CALL = 'peer:call',
   PEER_ANSWER = 'peer:answer'
}
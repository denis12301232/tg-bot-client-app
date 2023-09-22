import type { Responses, IMessage, IUser } from '@/types';
import { $api } from '@/api';

export default class ChatService {
  static index() {
    return $api.get('chats').json<Responses.Chat[]>();
  }

  static show(chatId: string) {
    return $api.get(`chats/${chatId}`).json<Responses.Chat>();
  }

  static destroy(chatId: string) {
    return $api.delete(`chats/${chatId}`).json();
  }

  static chatMessages(chatId: string, skip: number, limit: number = 10) {
    return $api.get(`chats/${chatId}/messages`, { searchParams: { skip, limit } }).json<IMessage[]>();
  }

  static chatMembers(chatId: string) {
    return $api.get(`chats/${chatId}/members`).json<IUser[]>();
  }

  static chatAttachment(filename: string) {
    return $api.get('chats/attachment', { searchParams: { filename } }).blob();
  }

  static updateRead(chatId: string) {
    return $api.patch(`chats/${chatId}/read`).json();
  }

  static updateGroup(
    groupId: string,
    { formData, params }: { formData?: FormData; params: { title?: string; about?: string } }
  ) {
    return $api
      .patch(`chats/group/${groupId}`, { body: formData, searchParams: params })
      .json<Responses.Chat['group']>();
  }

  static updateGroupMembers(chatId: string, json: { userId: string; action: 'add' | 'kick' }) {
    return $api.patch(`chats/${chatId}/group/members`, { json }).json<null>();
  }

  static updateGroupRoles(groupId: string, role: string, users: string[]) {
    return $api.patch(`chats/group/${groupId}`, { json: { role, users } }).json<null>();
  }
}

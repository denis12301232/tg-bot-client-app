import { $api } from '@/api';

export default class ChatService {
  static index() {
    return $api.get('chats');
  }

  static show(chatId: string) {
    return $api.get(`chats/${chatId}`);
  }

  static destroy(chatId: string) {
    return $api.delete(`chats/${chatId}`);
  }

  static chatMessages(chatId: string, skip: number, limit: number = 10) {
    return $api.get(`chats/${chatId}/messages`, { searchParams: { skip, limit } });
  }

  static chatMembers(chatId: string) {
    return $api.get(`chats/${chatId}/members`);
  }

  static chatAttachment(filename: string) {
    return $api.get('chats/attachment', { searchParams: { filename } });
  }

  static updateRead(chatId: string) {
    return $api.patch(`chats/${chatId}/read`);
  }

  static updateGroup(
    groupId: string,
    { formData, params }: { formData?: FormData; params: { title?: string; about?: string } }
  ) {
    return $api.patch(`chats/group/${groupId}`, { body: formData, searchParams: params });
  }

  static updateGroupMembers(chatId: string, json: { userId: string; action: 'add' | 'kick' }) {
    return $api.patch(`chats/${chatId}/group/members`, { json });
  }

  static updateGroupRoles(groupId: string, role: string, users: string[]) {
    return $api.patch(`chats/group/${groupId}`, { json: { role, users } });
  }
}

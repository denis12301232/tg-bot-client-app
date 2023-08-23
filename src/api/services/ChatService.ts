import { $api } from '@/api';

export default class ChatService {
  static getChatMessages(chatId: string, skip: number, limit: number = 10) {
    return $api.get('chat/messages', { searchParams: { chatId, skip, limit } });
  }

  static getUserChats() {
    return $api.get('chat/get_user_chats');
  }

  static getUserChatById(chatId: string) {
    return $api.get('chat/get_user_chat_by_id', { searchParams: { chatId } });
  }

  static updateRead(chatId: string) {
    return $api.patch('chat/update_read', { json: { chatId } });
  }
  static findUsers(loginOrName: string) {
    return $api.get('chat/find_users', { searchParams: { loginOrName } });
  }

  static deleteChat(chatId: string) {
    return $api.patch('chat/delete_chat', { json: { chatId } });
  }

  static addUserToGroup(chatId: string, user_id: string) {
    return $api.patch('chat/add_user_to_group', { json: { chatId, user_id } });
  }

  static removeUserFromGroup(chatId: string, user_id: string) {
    return $api.patch('chat/remove_user_from_group', { json: { chatId, user_id } });
  }

  static getUsersListInChat(chatId: string) {
    return $api.get('chat/get_users_list_in_chat', { searchParams: { chatId } });
  }

  static updateRolesInGroup(group_id: string, role: string, users: string[]) {
    return $api.patch('chat/update_roles_in_group', { json: { group_id, role, users } });
  }

  static updateGroup({
    formData,
    params,
  }: {
    formData?: FormData;
    params: { group_id: string; title?: string; about?: string };
  }) {
    return $api.patch('chat/update_group', { body: formData, searchParams: params });
  }

  static getFileFromS3(filename: string) {
    return $api.get('chat/get_file_from_s3', { searchParams: { filename } });
  }
}

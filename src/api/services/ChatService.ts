import { $api } from '@/api';

export default class ChatService {
  static openChat(chat_id: string, page: number, limit: number = 10) {
    return $api.get('chat/open_chat', {
      searchParams: { chat_id, page, limit },
    });
  }

  static getUserChats() {
    return $api.get('chat/get_user_chats');
  }

  static getUserChatById(chat_id: string) {
    return $api.get('chat/get_user_chat_by_id', { searchParams: { chat_id } });
  }

  static updateRead(chat_id: string) {
    return $api.patch('chat/update_read', { json: { chat_id } });
  }
  static findUsers(loginOrName: string) {
    return $api.get('chat/find_users', { searchParams: { loginOrName } });
  }

  static deleteChat(chat_id: string) {
    return $api.patch('chat/delete_chat', { json: { chat_id } });
  }

  static addUserToGroup(chat_id: string, user_id: string) {
    return $api.patch('chat/add_user_to_group', { json: { chat_id, user_id } });
  }

  static removeUserFromGroup(chat_id: string, user_id: string) {
    return $api.patch('chat/remove_user_from_group', { json: { chat_id, user_id } });
  }

  static getUsersListInChat(chat_id: string) {
    return $api.get('chat/get_users_list_in_chat', { searchParams: { chat_id } });
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

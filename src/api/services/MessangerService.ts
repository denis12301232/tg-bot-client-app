import type { IUser, IMessage, ChatResponse } from '@/types'
import $api from '@/api'


export default class MessangerService {
   static findUsers(loginOrName: string) {
      return $api.get<IUser[]>('/messanger/find_users', { params: { loginOrName } });
   }

   static createChat(users: string[]) {
      return $api.post<ChatResponse>('/messanger/create_chat', { users });
   }

   static createGroup(title: string, about: string, users: string[], formData?: FormData) {
      return $api.post<ChatResponse>('/messanger/create_group', formData, {
         headers: { 'Content-Type': 'multipart/form-data' }, params: { title, about, users }
      });
   }

   static addUserToGroup(chat_id: string, user_id: string) {
      return $api.patch('/messanger/add_user_to_group', { chat_id, user_id });
   }

   static removeUserFromGroup(chat_id: string, user_id: string) {
      return $api.patch('/messanger/remove_user_from_group', { chat_id, user_id });
   }

   static getUsersListInChat(chat_id: string) {
      return $api.get<IUser[]>('/messanger/get_users_list_in_chat', { params: { chat_id } });
   }

   static saveMessage(chat_id: string, text: string) {
      return $api.post<IMessage>('/messanger/save_message', { chat_id, text });
   }

   static getUserChats() {
      return $api.get<ChatResponse[]>('/messanger/get_user_chats');
   }

   static openChat(chat_id: string, page: number, limit: number = 10) {
      return $api.get<{ messages: IMessage[], chat_id: string }>('/messanger/open_chat', {
         params: { chat_id, page, limit }
      });
   }

   static deleteChat(chat_id: string) {
      return $api.patch('/messanger/delete_chat', { chat_id });
   }

   static updateRead(chat_id: string) {
      return $api.patch('/messanger/update_read', { chat_id });
   }

   static saveMediaMessage(formData: FormData, chat_id: string, type: 'audio' | 'image') {
      return $api.post<IMessage>('/messanger/save_media_message', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
         params: { chat_id, type }
      });
   }

   static updateRolesInGroup(group_id: string, role: string, users: string[]) {
      return $api.patch('/messanger/update_roles_in_group', { group_id, role, users });
   }

   static updateGroup({ formData, params }: { formData?: FormData, params: { group_id: string, title: string, about: string } }) {
      return $api.patch('/messanger/update_group', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
         params
      });
   }

   static getUserChatById(chat_id: string) {
      return $api.get<ChatResponse>('/messanger/get_user_chat_by_id', { params: { chat_id } })
   }
}
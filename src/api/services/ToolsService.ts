import type { IUser } from '@/types'
import $api from '@/api'


export default class ToolsService {
   static setNewName(name: string) {
      return $api.patch('/tools/name', { name });
   }

   static setNewEmail(email: string) {
      return $api.patch('/tools/email', { email });
   }

   static setNewPassword(newPassword: string, oldPassword: string) {
      return $api.patch('/tools/password', { newPassword, oldPassword });
   }

   static setGoogleServiceAccountSettings(settings: { serviceUser: string, servicePrivateKey: string, sheetId: string, folderId: string }) {
      return $api.post<{ message: string }>('/tools/google/service', settings);
   }

   static giveAdminRights(email: string) {
      return $api.post<{ message: string }>('/tools/giverights', { email });
   }

   static takeAdminRights(email: string) {
      return $api.post<{ message: string }>('/tools/takerights', { email });
   }

   static getUsers({ page, limit, filter }: { page: number, limit: number, filter: string }) {
      return $api.get<IUser[]>('/tools/users', { params: { limit, page, filter } });
   }

   static updateRoles(_id: string, roles: string[]) {
      return $api.post<{ message: string }>('/tools/setroles', { _id, roles });
   }

   static setAvatar(formData: FormData) {
      return $api.post<{ avatar: string }>('/tools/avatar', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });
   }
}
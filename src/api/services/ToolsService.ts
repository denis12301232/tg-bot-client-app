import type { IUser } from '@/types/interfaces'
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

   static getUsers() {
      return $api.get<IUser[]>('/tools/users');
   }

   static updateRoles(_id: string, roles: string[]) {
      return $api.post<{ message: string }>('/tools/setroles', { _id, roles });
   }

   static setAvatar(formData: FormData) {
      return $api.post('/tools/avatar', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });
   }
}
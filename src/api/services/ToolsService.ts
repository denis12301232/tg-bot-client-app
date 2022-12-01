import { IUser } from '@/interfaces/interfaces'
import { AxiosResponse } from 'axios'
import $api from '../index'

export default class ToolsService {
   static setNewName(name: string): Promise<void> {
      return $api.patch('/tools/name', { name });
   }

   static setNewEmail(email: string): Promise<void> {
      return $api.patch('/tools/email', { email });
   }

   static setNewPassword(newPassword: string, oldPassword: string): Promise<void> {
      return $api.patch('/tools/password', { newPassword, oldPassword });
   }

   static setGoogleServiceAccountSettings(serviceUser: string, servicePrivateKey: string, sheetId: string, folderId: string): Promise<AxiosResponse<{ message: string }>> {
      return $api.post<{ message: string }>('/tools/google/service', {
         serviceUser, servicePrivateKey, sheetId, folderId
      });
   }

   static giveAdminRights(email: string): Promise<AxiosResponse<{ message: string }>> {
      return $api.post<{ message: string }>('/tools/giverights', { email });
   }

   static takeAdminRights(email: string): Promise<AxiosResponse<{ message: string }>> {
      return $api.post<{ message: string }>('/tools/takerights', { email });
   }

   static getUsers(_id: string): Promise<AxiosResponse<IUser[]>> {
      return $api.get<IUser[]>('/tools/users', { params: { _id } });
   }

   static updateRoles(_id: string, roles: string[]): Promise<AxiosResponse<{ message: string }>> {
      return $api.post<{ message: string }>('/tools/setroles', { _id, roles });
   }
}
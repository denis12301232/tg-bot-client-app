import { AxiosResponse } from 'axios'
import $api from '../index'

export default class ToolsService {
   static async setNewName(name: string): Promise<void> {
      return $api.patch('/tools/name', { name });
   }

   static async setNewEmail(email: string): Promise<void> {
      return $api.patch('/tools/email', { email });
   }

   static async setNewPassword(newPassword: string, oldPassword: string): Promise<void> {
      return $api.patch('/tools/password', { newPassword, oldPassword });
   }

   static async setGoogleServiceAccountSettings(serviceUser: string, servicePrivateKey: string, sheetId: string): Promise<AxiosResponse<{ message: string }>> {
      return $api.post<{ message: string }>('/tools/google/service', {
         serviceUser, servicePrivateKey, sheetId
      });
   }

   static async giveAdminRights(email: string): Promise<AxiosResponse<{ message: string }>> {
      return $api.post<{ message: string }>('/tools/giverights', { email });
   }

   static async takeAdminRights(email: string): Promise<AxiosResponse<{ message: string }>> {
      return $api.post<{ message: string }>('/tools/takerights', { email });
   }
}
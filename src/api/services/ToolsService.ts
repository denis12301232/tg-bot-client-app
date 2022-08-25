import $api from "../index";

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
}
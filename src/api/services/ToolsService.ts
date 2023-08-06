import { $api } from '@/api';

export default class ToolsService {
  static setNewName(name: string) {
    return $api.patch('tools/name', { json: { name } });
  }

  static setNewEmail(email: string) {
    return $api.patch('tools/email', { json: { email } });
  }

  static setNewPassword(newPassword: string, oldPassword: string) {
    return $api.patch('tools/password', { json: { newPassword, oldPassword } });
  }

  static setAvatar(formData: FormData) {
    return $api.post('tools/avatar', { body: formData });
  }

  static setGoogleServiceAccountSettings(settings: {
    serviceUser: string;
    servicePrivateKey: string;
    sheetId: string;
    folderId: string;
  }) {
    return $api.post('tools/google/service', { json: settings });
  }

  static getUsers({ page, limit, filter }: { page: number; limit: number; filter: string }) {
    return $api.get('tools/users', { searchParams: { limit, page, filter } });
  }

  static updateRoles(_id: string, roles: string[]) {
    return $api.post('tools/setroles', { json: { _id, roles } });
  }

  static fetchLocale(locale: string) {
    return fetch(`/locales/${locale}.json`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something went wrong!');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

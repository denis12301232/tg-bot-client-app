import { $api } from '@/api';

export default class ToolsService {
  static updateName(name: string) {
    return $api.patch('tools/name', { json: { name } });
  }

  static updateEmail(email: string) {
    return $api.patch('tools/email', { json: { email } });
  }

  static updatePassword(newPassword: string, oldPassword: string) {
    return $api.patch('tools/password', { json: { newPassword, oldPassword } });
  }

  static updateAvatar(formData: FormData) {
    return $api.patch('tools/avatar', { body: formData });
  }

  static updateRoles(_id: string, roles: string[]) {
    return $api.patch('tools/roles', { json: { _id, roles } });
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

  static fetchLocale(locale: string) {
    return fetch(`/locales/${locale}.json`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something went wrong!');
      })
      .catch((e) => console.error(e));
  }
}

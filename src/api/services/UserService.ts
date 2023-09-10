import { $api } from '@/api';

export default class UserService {
  static getUser(id: string) {
    return $api.get(`users/${id}`);
  }

  static getUsers({ page = 1, limit = 1e5, filter }: { page?: number; limit?: number; filter: string }) {
    return $api.get('users', { searchParams: { limit, page, filter } });
  }

  static updateEmail(email: string) {
    return $api.patch('users/email', { json: { email } });
  }

  static updateName(name: string) {
    return $api.patch('users/email', { json: { name } });
  }

  static updateAvatar(formData: FormData) {
    return $api.patch('users/avatar', { body: formData });
  }

  static updatePassword(newPassword: string, oldPassword: string) {
    return $api.patch('users/password', { json: { newPassword, oldPassword } });
  }

  static updateRoles(_id: string, roles: string[]) {
    return $api.patch('users/roles', { json: { _id, roles } });
  }
}

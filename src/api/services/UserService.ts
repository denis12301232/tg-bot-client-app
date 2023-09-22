import type { IUser } from '@/types';
import { $api } from '@/api';

export default class UserService {
  static show(id: string) {
    return $api.get(`users/${id}`).json<IUser>();
  }

  static index({ page = 1, limit = 1e5, filter }: { page?: number; limit?: number; filter: string }) {
    return $api.get('users', { searchParams: { limit, page, filter } }).json<IUser[]>();
  }

  static indexQ({ page = 1, limit = 1e5, filter }: { page?: number; limit?: number; filter: string }) {
    return $api.get('users', { searchParams: { limit, page, filter } });
  }

  static updateEmail(email: string) {
    return $api.patch('users/email', { json: { email } }).json<null>();
  }

  static updateName(name: string) {
    return $api.patch('users/email', { json: { name } }).json<null>();
  }

  static updateAvatar(formData: FormData) {
    return $api.patch('users/avatar', { body: formData }).json<{ avatar: string }>();
  }

  static updatePassword(newPassword: string, oldPassword: string) {
    return $api.patch('users/password', { json: { newPassword, oldPassword } }).json<null>();
  }

  static updateRoles(_id: string, roles: string[]) {
    return $api.patch('users/roles', { json: { _id, roles } }).json<null>();
  }
}

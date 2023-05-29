import type { LoginResponse } from '@/types';
import { $api } from '@/api';

export default class AuthService {
  static login(loginOrEmail: string, password: string) {
    return $api.post('auth/login', { json: { loginOrEmail, password } });
  }

  static refresh() {
    return $api.get('auth/refresh').json<LoginResponse>();
  }

  static logout() {
    return $api.get('auth/logout').json<null>();
  }

  static registration(user: { login: string; email: string; password: string; name: string }) {
    return $api.post('auth/registration', { json: user });
  }

  static sendMail(email: string) {
    return $api.post('auth/restore/password', { json: { email } });
  }

  static restorePassword(password: string, link: string) {
    return $api.post('auth/restore/password/new', { json: { password, link } });
  }
}

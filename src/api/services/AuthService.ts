import type { LoginResponse } from '@/types';
import { $api, $auth } from '@/api';


export default class AuthService {
  static login(loginOrEmail: string, password: string) {
    return $auth.post('auth/login', { json: { loginOrEmail, password } });
  }

  static refresh() {
    return $auth.get('auth/refresh').json<LoginResponse>();
  }

  static logout() {
    return $auth.get('auth/logout').json<null>();
  }

  static registration(user: { login: string; email: string; password: string; name: string }) {
    return $auth.post('auth/registration', { json: user });
  }

  static sendMail(email: string) {
    return $api.post('auth/restore/password', { json: { email } });
  }

  static restorePassword(password: string, link: string) {
    return $api.post('auth/restore/password/new', { json: { password, link } });
  }
}

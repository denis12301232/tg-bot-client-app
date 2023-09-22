import type { Responses } from '@/types';
import { $auth } from '@/api';

export default class AuthService {
  static login(loginOrEmail: string, password: string) {
    return $auth.post('auth/login', { json: { loginOrEmail, password } }).json<Responses.Login>();
  }

  static refresh() {
    return $auth.get('auth/refresh').json<Responses.Login>();
  }

  static logout() {
    return $auth.get('auth/logout').json<null>();
  }

  static registration(user: { login: string; email: string; password: string; name: string }) {
    return $auth.post('auth/registration', { json: user }).json<Responses.Login>();
  }

  static restorePassword(email: string) {
    return $auth.post('auth/restore/password', { json: { email } }).json<null>();
  }

  static setPassword(password: string, link: string) {
    return $auth.post('auth/set/password', { json: { password, link } }).json<null>();
  }
}

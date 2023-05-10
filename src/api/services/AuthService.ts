import type { AuthResponse } from '@/types'
import $api from '@/api'
import axios from 'axios'
import { ENV } from '@/util'


export default class AuthService {
   static async login(loginOrEmail: string, password: string) {
      return $api.post<AuthResponse>(`/auth/login`, { loginOrEmail, password });
   }

   static async registration(user: { login: string, email: string, password: string, name: string }) {
      return $api.post<AuthResponse>(`/auth/registration`, user);
   }

   static async logout(): Promise<void> {
      return $api.get('/auth/logout');
   }

   static async refresh() {
      return axios.get<AuthResponse>(`${ENV.API_V1}/auth/refresh`, { withCredentials: true });
   }

   static async sendMail(email: string) {
      return axios.post<{ message: string }>(`${ENV.API_V1}/auth/restore/password`, { email }, { withCredentials: true });
   }

   static async restorePassword(password: string, link: string) {
      return axios.post<{ message: string }>(`${ENV.API_V1}/auth/restore/password/new`, { password, link }, { withCredentials: true });
   }
}
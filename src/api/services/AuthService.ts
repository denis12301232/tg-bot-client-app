import $api from "../index";
import { API_URL } from "@/libs/constants";
import axios, { AxiosResponse } from "axios";
import { AuthResponse } from "@/intefaces/http";

export default class AuthService {
   static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
      return $api.post<AuthResponse>('/auth/login', { email, password });
   }

   static async registration(email: string, password: string, name: string): Promise<AxiosResponse<AuthResponse>> {
      return $api.post<AuthResponse>('/auth/registration', { email, password, name });
   }

   static async logout(): Promise<void> {
      return $api.post('/auth/logout');
   }

   static async refresh(): Promise<AxiosResponse<AuthResponse>> {
      return axios.get<AuthResponse>(`${API_URL}/auth/refresh`, { withCredentials: true });
   }

}
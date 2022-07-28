import AuthService from "../services/AuthService";
import { useStore } from "@/store/main";
import { IUser } from "@/intefaces/interfaces";

export default class AuthController {
   static async registration(email: string, password: string, name: string) {
      try {
         const store = useStore();
         const response = await AuthService.registration(
            email,
            password,
            name
         );
         localStorage.setItem('token', response.data.accessToken);
         store.isAuth = true;
         store.user = response.data.user;
   
         return { message: "", errors: [] };
      } catch (e: any) {
         return { message: e?.response?.data?.message, errors: e?.response?.data?.errors };
      }
   }

   static async login(email: string, password: string) {
      try {
         const store = useStore();
         const response = await AuthService.login(email, password);
         localStorage.setItem("token", response.data.accessToken);
         store.isAuth = true;
         store.user = response.data.user;
   
         return { message: "", errors: [] };
      } catch (e: any) {
         return { message: e?.response?.data?.message, errors: e?.response?.data?.errors };
      }
   }

   static async refresh(): Promise<void> {
      try {
         const response = await AuthService.refresh();

         const store = useStore();
         localStorage.setItem("token", response.data.accessToken);
         store.isAuth = true;
         store.user = response.data.user;

      } catch (e: any) {
         console.log(e?.response?.data?.message);
      }
   }

   static async logout(): Promise<void> {
      try {
         await AuthService.logout();
   
         const store = useStore();
         localStorage.removeItem("token");
         store.isAuth = false;
         store.user = <IUser>{};
   
      } catch (e: any) {
         console.log(e?.response?.data?.message);
      }
   }
}
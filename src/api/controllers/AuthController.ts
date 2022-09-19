import { useStore } from "@/store/main"
import { IUser } from "@/intefaces/interfaces"
import AuthService from "../services/AuthService"

export default class AuthController {
   static async refresh(): Promise<void> {
      await AuthService.refresh()
         .then((response) => {
            const store = useStore();
            localStorage.setItem("token", response.data.accessToken);
            store.user = response.data.user;
         })
         .catch((e: any) => console.log(e?.response?.data?.message));
   }

   static async logout(): Promise<void> {
      await AuthService.logout()
         .then(() => {
            const store = useStore();
            localStorage.removeItem("token");
            store.user = <IUser>{};
         })
         .catch((e: any) => console.log(e?.response?.data?.message));
   }
}
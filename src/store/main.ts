import { IUser } from "@/intefaces/interfaces";
import { defineStore } from "pinia";

const name: string = 'main';

export const useStore = defineStore({
    id: name,
    state: () => {
        return {
            isAuth: false,
            user: <IUser>{},
        }
    },
})
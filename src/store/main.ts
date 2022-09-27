import { IUser } from '@/intefaces/interfaces'
import { defineStore } from 'pinia'

const name: string = 'main';

export const useStore = defineStore({
    id: name,
    state: () => {
        return {
            user: <IUser>{},
            isPageLoading: false,
        }
    },
    getters: {
        isAuth(state): boolean {
            return !!Object.keys(state.user).length;
        },
        isAdmin(state): boolean {
            return state?.user?.roles?.includes('admin');
        },
    }
})
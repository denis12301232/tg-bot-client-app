import { IUser } from '@/intefaces/interfaces'
import { defineStore } from 'pinia'


export const useStore = defineStore('main', {
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
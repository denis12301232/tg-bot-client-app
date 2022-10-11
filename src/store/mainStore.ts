import { IUser } from '@/intefaces/interfaces'
import { defineStore } from 'pinia'


export const useStore = defineStore('main', {
    state: () => ({
        user: <IUser>{},
        isPageLoading: false,
        theme: 'system',
    }),
    getters: {
        isAuth(state): boolean {
            return !!Object.keys(state.user).length;
        },
        isAdmin(state): boolean {
            return state?.user?.roles?.includes('admin');
        },
        currentTheme(state): string {
            switch (state.theme) {
                case 'light':
                case 'dark':
                    return state.theme;
                case 'system':
                    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                        return 'dark';
                    } else {
                        return 'light';
                    }
                default:
                    return 'light';
            }
        }
    },
    actions: {
        ifThemeSaved(): void {
            const theme = localStorage.getItem('theme');
            if (theme) {
                this.theme = theme;
                document.documentElement.className = this.currentTheme;
            } else {
                document.documentElement.className = this.currentTheme;
                localStorage.setItem('theme', this.theme);
            }
        },
    }
})
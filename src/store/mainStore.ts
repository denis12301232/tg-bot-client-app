import { IUser, AlertType } from '@/intefaces/interfaces'
import { defineStore } from 'pinia'


export const useStore = defineStore('main', {
    state: () => ({
        user: <IUser>{},
        isPageLoading: false,
        theme: 'system',
        alert: {
            type: <AlertType>'success',
            message: '',
            isVisible: false,
        }
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
        showAlert() {
            this.alert.isVisible = !this.alert.isVisible;
        },
        setAlert(type: AlertType, message: string) {
            this.alert.type = type;
            this.alert.message = message || 'Неизвестная ошибка!';
        }
    }
})
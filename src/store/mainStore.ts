import { IUser, AlertType } from '@/interfaces/interfaces'
import { defineStore } from 'pinia'


export const useStore = defineStore('main', {
    state: () => ({
        user: <IUser>{},
        isPageLoading: false,
        isMenuVisible: false,
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
        setTheme() {
            switch (this.theme) {
               case 'light':
                  this.theme = 'dark';
                  localStorage.setItem('theme', 'dark');
                  break;
               case 'dark':
                  this.theme = 'light';
                  localStorage.setItem('theme', 'light');
                  break;
            }
         },
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
        setMenuVisible() {
            this.isMenuVisible = !this.isMenuVisible;
         },
        showAlert(value: boolean): void {
            this.alert.isVisible = value;
        },
        setAlert(type: AlertType, message: string): void {
            this.alert.type = type;
            this.alert.message = message || 'Неизвестная ошибка!';
        }
    }
})
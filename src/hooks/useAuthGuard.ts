import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useStore } from '@/stores'


export function useAuthGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
   const store = useStore();
   store.isAuth ? next() : next({ path: '/' });
}
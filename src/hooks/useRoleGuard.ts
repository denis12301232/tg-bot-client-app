import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useStore } from '@/stores'


export function useRoleGuard(roles: string[]) {
   return function (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
      const store = useStore();
      for (const role of roles) {
         if (store.user?.roles.includes(role)) return next();
      }
      return next({ path: '/' });
   }
}
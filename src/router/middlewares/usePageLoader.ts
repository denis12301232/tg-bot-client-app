import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useStore } from '@/stores'


export function usePageLoader(loading: boolean) {
   return function (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
      const store = useStore();
      store.isPageLoading = loading;
      next();
   }
}
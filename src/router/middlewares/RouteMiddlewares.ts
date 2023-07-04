import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useStore } from '@/stores';
import { Validate } from '@/util';

export default class RouteMiddlewares {
  static async useLayout(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const layout = to.meta.layout || 'VoidLayout';
    const component = await import(`../../layouts/${layout}.vue`);
    to.meta.layoutComponent = component.default;
    next();
  }

  static useAuthGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const store = useStore();
    store.isAuth ? next() : next({ path: '/' });
  }

  static useRoleGuard(roles: string[]) {
    return function (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
      const store = useStore();
      for (const role of roles) {
        if (store.user?.roles.includes(role)) return next();
      }
      return next({ path: '/' });
    };
  }

  static usePageLoader(loading: boolean) {
    return function (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
      const store = useStore();
      store.isPageLoading = loading;
      next();
    };
  }

  static useUUIDV4Guard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    return Validate.isUUIDV4(String(to.params.id)) ? next() : next({ path: '/' });
  }

  static useNotAuthOnly(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const store = useStore();
    store.isAuth ? next({ path: '/' }) : next();
  }
}

import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export default async function useLayout(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
   const layout = to.meta.layout || 'HeaderLayout';
   const component = await import(`../../layouts/${layout}.vue`);
   to.meta.layoutComponent = component.default;
   next();
}
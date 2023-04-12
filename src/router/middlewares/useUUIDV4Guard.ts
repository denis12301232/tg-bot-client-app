import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { Validate } from '@/util';


export default function useAuthGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
   return Validate.isUUIDV4(String(to.params.id)) ? next() : next({ path: '/' });
}
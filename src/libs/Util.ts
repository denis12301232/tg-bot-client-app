import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useStore } from '@/store/mainStore'
import { useHeaderStore } from '@/store/headerStore'
import AuthController from '@/api/controllers/AuthController'

export default class Util {
   static beforeEnterHome(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
      const store = useStore();
      const headerStore = useHeaderStore();

      if (to.query.login || to.query.registration) {
         AuthController.refresh()
            .then(() => {
               if (store.isAuth) throw new Error();
               headerStore.isModalVisible = true;
               if (to.query.login) {
                  headerStore.isLogVisible = true;
                  headerStore.isRegVisible = false;
               }
               else if (to.query.registration) {
                  headerStore.isLogVisible = false;
                  headerStore.isRegVisible = true;
               }
               return next();
            })
            .catch(() => next());
      } else {
         return next();
      }
   }
}
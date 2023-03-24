import { createRouter, createWebHistory } from 'vue-router'
import { useLayout, usePageLoader } from '@/router/middlewares'
import { routes } from '@/router/routes'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
});

router.beforeEach(useLayout);
router.beforeEach(usePageLoader(true));
router.beforeResolve(usePageLoader(false));

export default router;
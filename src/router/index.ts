import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import RouteMiddlewares from './middlewares/RouteMiddlewares';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(RouteMiddlewares.useLayout);
router.beforeEach(RouteMiddlewares.usePageLoader(true));
router.beforeResolve(RouteMiddlewares.usePageLoader(false));

export default router;

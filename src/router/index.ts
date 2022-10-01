import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useStore } from '@/store/mainStore'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/info',
    name: 'info',
    component: () => import('../views/InfoView.vue'),

  },
  {
    path: '/list',
    name: 'list',
    component: () => import('../views/ListView.vue'),
  },
  {
    path: '/tools',
    name: 'tools',
    component: () => import('../views/ToolsView.vue'),
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/AccountView.vue'),
  },
  {
    path: '/restore',
    name: 'restore',
    component: () => import('../views/RestoreView.vue'),
  },
  {
    path: "/:pathMatch(.*)*",
    name: '404',
    component: () => import('@/components/TheError.vue'),
    props: { code: 404, message: 'Not Found' }
  },
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import('@/views/TestView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  store.isPageLoading = true;
  next();
});

router.beforeResolve((to, from, next) => {
  const store = useStore();
  store.isPageLoading = false;
  next();
});

export default router;

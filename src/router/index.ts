import { createRouter, createWebHistory } from 'vue-router'
import { useAuthGuard, useRoleGuard } from '@/hooks'
import { useStore } from '@/stores'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Home.vue')
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('@/pages/List.vue'),
      beforeEnter: [useAuthGuard, useRoleGuard(['admin'])]
    },
    {
      path: '/list/:id',
      name: 'list_by_id',
      component: () => import('@/pages/ListById.vue'),
      props: true,
      beforeEnter: [useAuthGuard, useRoleGuard(['admin'])]
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('@/pages/Info.vue'),
      beforeEnter: [useAuthGuard, useRoleGuard(['admin'])]
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/pages/Account.vue'),
      beforeEnter: [useAuthGuard]
    },
    {
      path: '/tools',
      name: 'tools',
      component: () => import('@/pages/Tools.vue'),
      redirect: '/tools/google',
      //beforeEnter: [useAuthGuard, useRoleGuard(['admin'])],
      children: [
        { path: 'google', component: () => import('~/tools/ToolsGoogle.vue') },
        { path: 'sheets', component: () => import('~/tools/ToolsSheets.vue') },
        { path: 'roles', component: () => import('~/tools/ToolsRoles.vue') },
      ]
    },
    {
      path: '/restore',
      name: 'restore',
      component: () => import('@/pages/Restore.vue')
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('@/pages/Gallery.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/pages/Test.vue')
    }
  ]
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

export default router

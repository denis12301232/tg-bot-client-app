import type { RouteRecordRaw } from 'vue-router'
import { useAuthGuard, useRoleGuard } from '@/router/middlewares'


export const routes: RouteRecordRaw[] = [
   {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Home.vue'),
   },
   {
      path: '/list',
      name: 'list',
      component: () => import('@/pages/List.vue'),
      beforeEnter: [useAuthGuard, useRoleGuard(['admin'])],
   },
   {
      path: '/list/:id',
      name: 'list_by_id',
      component: () => import('@/pages/ListById.vue'),
      props: true,
      beforeEnter: [useAuthGuard, useRoleGuard(['admin'])],
      meta: { layout: 'SimpleLayout', layoutProps: { title: 'Информация о заявке' } }
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
      beforeEnter: [useAuthGuard],
      meta: { layout: 'AccountLayout', layoutProps: { title: 'Аккаунт' } }
   },
   {
      path: '/tools',
      name: 'tools',
      component: () => import('@/pages/Tools.vue'),
      redirect: '/tools/google',
      beforeEnter: [useAuthGuard, useRoleGuard(['admin'])],
      children: [
         { path: 'google', component: () => import('~/tools/ToolsGoogle.vue') },
         { path: 'sheets', component: () => import('~/tools/ToolsSheets.vue') },
         { path: 'roles', component: () => import('~/tools/ToolsRoles.vue') },
      ],
      meta: { layout: 'ToolsLayout' }
   },
   {
      path: '/restore',
      name: 'restore',
      component: () => import('@/pages/Restore.vue'),
      meta: { layout: 'SimpleLayout', layoutProps: { title: 'Восстановление пароля' } }
   },
   {
      path: '/gallery',
      name: 'gallery',
      component: () => import('@/pages/Gallery.vue'),
      meta: { layout: 'SimpleLayout', layoutProps: { title: 'Галерея' } }
   },
   {
      path: '/messanger',
      name: 'messanger',
      component: () => import('@/pages/Messanger.vue'),
      beforeEnter: [useAuthGuard],
      meta: { layout: 'VoidLayout' }
   },
   {
      path: '/task',
      name: 'task',
      component: () => import('@/pages/Task.vue'),
      redirect: '/task/list',
      children: [
         { path: 'create', component: () => import('~/task/TaskCreate.vue') },
         { path: 'list', component: () => import('~/task/TaskList.vue') },
         { path: 'id/:id', component: () => import('~/task/TaskById.vue') }
      ],
      beforeEnter: [useAuthGuard],
      meta: { layout: 'TaskLayout' }
   },
   {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('~/TheError.vue'),
      props: { code: 404, message: 'Not found' },
      meta: { layout: 'VoidLayout' }
   },
   {
      path: '/test',
      name: 'test',
      component: () => import('@/pages/Test.vue'),
      meta: { layout: 'VoidLayout' }
   }
];
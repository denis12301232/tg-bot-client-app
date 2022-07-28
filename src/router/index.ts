import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
    path: "/:pathMatch(.*)*",
    name: '404',
    component: () => import('@/components/errors/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router;

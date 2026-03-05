import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Daily from "../views/Daily.vue"

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { category: 'tech' },
  },
  {
    path: '/daily',
    name: 'Daily',
    component: Daily,
    meta: { category: 'life' },
  },
  {
    path: '/daily/map',
    name: 'DailyMap',
    component: () => import('../views/DailyMap.vue'),
    meta: { category: 'life' },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/posts/:postName(.*)',
    name: 'Posts',
    component: () => import('../views/Post.vue'),
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || '/'),
  routes
})

export default router

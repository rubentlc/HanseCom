import UsersListView from '@/views/UsersListView.vue'
import { createRouter, createWebHistory } from 'vue-router'

export const ORDERS_PATH = '/:id/orders'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'usersList',
      component: UsersListView
    },
    {
      path: ORDERS_PATH,
      name: 'orders',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/OrdersListView.vue')
    }
  ]
})

export default router

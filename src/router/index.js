import { createRouter, createWebHistory } from 'vue-router'
import ServiceListView from '../views/ServiceListView.vue'

const routes = [
  {
    path: '/',
    redirect: {
      name: 'service-list'
    }
  },
  {
    path: '/service-list',
    name: 'service-list',
    component: ServiceListView
  },
  {
    path: '/configs',
    name: 'configs',
    component: () => import('../views/ConfigsView.vue')
  },
  {
    path: '/metrics',
    name: 'metrics',
    component: () => import('../views/MetricsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

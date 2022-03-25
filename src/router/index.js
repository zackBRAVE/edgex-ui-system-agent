import { createRouter, createWebHistory } from 'vue-router'
import ServiceListView from '../views/ServiceListView.vue'

const routes = [
  {
    path: '/',
    redirect: {
      name: 'service-list',
    },
  },
  {
    path: '/service-list',
    name: 'service-list',
    component: ServiceListView,
    meta: {
      title: 'System Service List',
    },
  },
  {
    path: '/configs',
    name: 'configs',
    component: () => import('../views/ConfigsView.vue'),
    meta: {
      title: 'Service Configs',
    },
  },
  {
    path: '/metrics',
    name: 'metrics',
    component: () => import('../views/MetricsView.vue'),
    meta: {
      title: 'Service Metrics',
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

const defaultTitle = 'System Service List'
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : defaultTitle
  next()
})

export default router

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
      title: 'System Services List',
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

export default routes

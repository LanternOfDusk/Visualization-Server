import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MonitorView from '../views/MonitorView.vue'
import AboutView from '../views/AboutView.vue'
import DeviceView from '../views/DeviceView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/monitor',
    name: 'monitor',
    component: MonitorView
  },
  {
    path: '/device',
    name: 'device',
    component: DeviceView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

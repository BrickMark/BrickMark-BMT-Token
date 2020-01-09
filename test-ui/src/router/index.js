import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardApp from '../views/DashboardApp.vue'
import EventsApp from '../views/EventsApp.vue';
import VotingApp from '../views/VotingApp.vue';
import RolesMgmtApp from '../views/RolesMgmtApp.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardApp
  },
  {
    path: '/voting',
    name: 'voting',
    component: VotingApp
  },
  {
    path: '/roles',
    name: 'rolesmgmt',
    component: RolesMgmtApp
  },
  {
    path: '/events',
    name: 'events',
    component: EventsApp
  }
]



const router = new VueRouter({
  routes
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import Investors from '../views/Investors.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'investors',
    component: Investors
  },

  // {
  //   path: '/assets/:address',
  //   name: 'asset',
  //   component: Asset
  // },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]



const router = new VueRouter({
  routes
})

export default router

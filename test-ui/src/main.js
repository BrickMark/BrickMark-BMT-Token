import App from './App.vue'
import router from './router'
import Vue from 'vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import { store } from './store/store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify: vuetify,
  render: h => h(App)
}).$mount('#app')


// new Vue({
//   router,
//   vuetify: vuetify,
//   render: h => h(App)
// }).$mount('#app')

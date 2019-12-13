import App from './App.vue'
import router from './router'
import Vue from 'vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export

Vue.config.productionTip = false

new Vue({
  router,
  vuetify: vuetify,
  render: h => h(App)
}).$mount('#app')


// new Vue({
//   router,
//   vuetify: vuetify,
//   render: h => h(App)
// }).$mount('#app')

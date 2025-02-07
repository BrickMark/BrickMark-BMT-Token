import App from './App.vue'
import router from './router'
import Vue from 'vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import { store } from './store/store'
import Clipboard from 'v-clipboard'

Vue.config.productionTip = false
Vue.use(Clipboard);

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

import Vue from 'vue'
import Vuetify from 'vuetify/lib'

//document.body.setAttribute('data-app', true)
Vue.use(Vuetify)
const opts = {
    theme: {
        dark: false,
      }
}
export default new Vuetify(opts)
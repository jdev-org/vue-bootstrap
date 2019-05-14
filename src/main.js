// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import { store } from './store/store.js'


// bootstrap-vue
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// vuelayers
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css'
//import router from './router' // uncomment router elements to use router

Vue.use(BootstrapVue)
Vue.use(VueLayers)
Vue.use(Vuex)
Vue.config.productionTip = false

// fontawesome
library.add(fas, far, fab)
Vue.component('font-awesome-icon', FontAwesomeIcon)
// vue-bootstrap-typehead
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  //router,
  store,
  components: { App },
  template: '<App/>'
})

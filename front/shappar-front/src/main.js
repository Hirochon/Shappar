import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'

// BootstrapVue
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import {
  faTimes, faSearch, faEllipsisH, faListOl, faSortAmountUp, faSortAmountDownAlt,
  faSyncAlt, faSpinner, faCheck, faChartLine, faCamera, faChevronCircleDown,
  faVenusMars, faBirthdayCake, faBars, faTrashAlt, faPlus, faPaperPlane,
  faArrowAltCircleLeft, faEdit, faClipboardList, faClipboardCheck
} from '@fortawesome/free-solid-svg-icons'

import './registerServiceWorker'

library.add(
  faTimes, faSearch, faEllipsisH, faListOl, faSortAmountUp, faSortAmountDownAlt,
  faSyncAlt, faSpinner, faCheck, faChartLine, faCamera, faChevronCircleDown,
  faVenusMars, faBirthdayCake, faBars, faTrashAlt, faPlus, faPaperPlane,
  faArrowAltCircleLeft, faEdit, faClipboardList, faClipboardCheck
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

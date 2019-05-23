// https://vuetifyjs.com/en/framework/icons
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// rem ???
// import Vuetify from 'vuetify'

// https://github.com/websanova/vue-auth/blob/master/docs/Installation.md
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'

// Components
import './components'

// Plugins
import './plugins'

// Sync router with store
import { sync } from 'vuex-router-sync'

// Application imports
import App from './App'
// import AppInterface from './AppInterface'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'

// Sync store with router
sync(store, router)

Vue.config.productionTip = false

// https://github.com/websanova/vue-auth/blob/master/docs/StepByStepGuide.md
Vue.axios.defaults.baseURL = 'http://api-demo/api/v1';
// Vue.http.options.root = 'http://api-demo/api/v1';
Vue.router = router

// https://github.com/websanova/vue-auth/blob/master/docs/Installation.md
Vue.use(VueAxios, axios)

Vue.use(VueAuth, {
    // auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
    auth: require('./lib/vue-auth_driver_auth_bearer_custom.js'),

    http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
    // http: require('./lib/vue-auth_driver_http_axios_custom.js'),

    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),

    loginData: {
		url: 'rpc/login',
	},
	fetchData: {
		url: 'rpc/user',
		enabled: false,
	},
	refreshData: {
		url: 'rpc/refresh',
		enabled: false,
	}
})

// rem ???
// Vue.use(Vuetify, {
// 	iconfont: 'md' // 'md' || 'mdi' || 'fa' || 'fa4'
// })


/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/**
 * Vue Router
 *
 * @library
 *
 * https://router.vuejs.org/en/
 */

// Lib imports
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import Router from 'vue-router'
import Meta from 'vue-meta'

import AppInterface from '../AppInterface.vue'

// Routes
import Login from '../views/Login.vue'
import paths from './paths'

function route (path, view, name, meta) {
  return {
    name: name || view,
    path,
    meta: meta || null,
    component: (resovle) => import(
      `@/views/${view}.vue`
    ).then(resovle)
  }
}

Vue.use(Router)

// Create a new router
const router = new Router({

  mode: 'history',
  
  routes: [

    { path: '/login', name: 'Login', component: Login },

    {
      path: '/', name: 'app', component: AppInterface, redirect: { name: 'Users' },
      meta: {
        auth: true,
      },
      children: 
        paths.map(path => route(path.path, path.view, path.name, path.meta))
          .concat([
            { path: '*', redirect: '/users' }
          ])
    },

  ],

  // scrollBehavior (to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition
  //   }
  //   if (to.hash) {
  //     return { selector: to.hash }
  //   }
  //   return { x: 0, y: 0 }
  // }

})


Vue.use(Meta)

// Bootstrap Analytics
// Set in .env
// https://github.com/MatteoGabriele/vue-analytics
if (process.env.GOOGLE_ANALYTICS) {
  Vue.use(VueAnalytics, {
    id: process.env.GOOGLE_ANALYTICS,
    router,
    autoTracking: {
      page: process.env.NODE_ENV !== 'development'
    }
  })
}

export default router

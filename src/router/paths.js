/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [

  {
    path: '/users',
    view: 'Users',
    meta: {
      auth: {
        roles: ['admin'],
      }
    },
  },
  {
    path: '/users/add',
    view: "UserMod",
  },

  {
    path: '/books',
    view: 'Books',
  },
  {
    path: '/books/add',
    view: 'BookMod',
  },

]

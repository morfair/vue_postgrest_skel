/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [

  {
    path: '/users',
    view: 'Users',
    name: 'users',
    meta: {
      auth: {
        roles: ['admin'],
      }
    },
  },
  {
    path: '/users/add',
    view: "UserMod",
    name: 'user_add',
    meta: {
      auth: {
        roles: ['admin'],
      }
    },
  },
  {
    path: '/users/:id',
    view: "UserMod",
    name: 'user_edit',
    meta: {
      auth: {
        roles: ['admin'],
      }
    },
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

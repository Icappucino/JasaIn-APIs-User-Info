const handler = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/register',
    handler: handler.signUp,
  },
  {
    method: 'POST',
    path: '/login',
    handler: handler.logIn,
  },
  {
    method: 'PUT',
    path: '/update',
    handler: handler.updateUser,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'POST',
    path: '/order',
    handler: handler.placeOrder,
    options: {
      auth: 'jwt',
    },
  },
];

module.exports = routes;

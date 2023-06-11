const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const jwt = require('jsonwebtoken');

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

const validate = async (decoded, request, h) => {
  // Verifikasi token JWT
  // Misalnya, Anda dapat melakukan pengecekan ke database apakah user dengan ID tersebut ada
  // Contoh implementasi sederhana hanya melakukan pengecekan ID
  if (decoded.id) {
    return { isValid: true };
  } else {
    return { isValid: false };
  }
};

const init = async () => {
  await server.register(require('@hapi/cookie'));
  await server.register(require('hapi-auth-jwt2'));

  server.auth.strategy('jwt', 'jwt', {
    key: 'your-secret-key',
    validate,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default('jwt');

  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();

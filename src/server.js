const routes = require('./routes');
const Hapi = require('@hapi/hapi');
const jwt = require('jsonwebtoken');

const server = Hapi.server({
  port: 3000,
  host: 'woven-edge-381212:asia-southeast2:jasain',
});

// Fungsi untuk membuat token JWT
const generateToken = (userId) => {
  const payload = {
    sub: userId,
    // Tambahkan klaim lain yang diperlukan dalam konteks aplikasi
  };

  // Ganti 'your-secret-key' dengan kunci rahasia yang sesuai
  const secretKey = 'your-secret-key';

  // Buat token JWT dengan menggunakan jwt.sign()
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

  return token;
};

// Contoh fungsi login
const login = (request, h) => {
  // Proses autentikasi pengguna
  const userId = 123; // Contoh ID pengguna yang berhasil diautentikasi

  // Generate token JWT
  const token = generateToken(userId);

  return {
    token,
  };
};

// Contoh penggunaan fungsi login
const handleLogin = async (request, h) => {
  try {
    const response = await login(request, h);
    return response;
  } catch (error) {
    console.error(error);
    return h.response('Failed to login').code(500);
  }
};

// Menjalankan server Hapi.js
const init = async () => {
  server.route({
    method: 'POST',
    path: '/login',
    handler: handleLogin,
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();

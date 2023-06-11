const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'username', // Ganti dengan username MySQL
  password: 'password', // Ganti dengan password MySQL
  database: 'dbname', // Ganti dengan nama database
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
  console.log('Connected to database');
});

const signUp = async (request, h) => {
  const { name, email, password } = request.payload;

  try {
    // Cek apakah email sudah terdaftar
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    const checkEmailResult = await query(checkEmailQuery, [email]);

    if (checkEmailResult.length > 0) {
      return h.response({ message: 'Email is already registered' }).code(409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user ke database
    const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    await query(insertUserQuery, [name, email, hashedPassword]);

    return h.response({ message: 'User registered successfully' }).code(201);
  } catch (error) {
    console.error('Error registering user:', error);
    return h.response({ message: 'Failed to register user' }).code(500);
  }
};

const logIn = async (request, h) => {
  const { email, password } = request.payload;

  try {
    // Cek apakah email terdaftar
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    const checkEmailResult = await query(checkEmailQuery, [email]);

    if (checkEmailResult.length === 0) {
      return h.response({ message: 'Email not found' }).code(404);
    }

    // Verifikasi password
    const user = checkEmailResult[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return h.response({ message: 'Invalid password' }).code(401);
    }

    // Generate token
    const token = jwt.sign({ id: user.id_user }, 'your-secret-key');

    return h.response({ message: 'Login successful', token }).code(200);
  } catch (error) {
    console.error('Error logging in:', error);
    return h.response({ message: 'Failed to log in' }).code(500);
  }
};

const updateUser = async (request, h) => {
  const { id } = request.auth.credentials;
  const { name, email } = request.payload;

  try {
    // Update informasi akun user
    const updateUserQuery = 'UPDATE users SET name = ?, email = ? WHERE id_user = ?';
    await query(updateUserQuery, [name, email, id]);

    return h.response({ message: 'User information updated' }).code(200);
  } catch (error) {
    console.error('Error updating user:', error);
    return h.response({ message: 'Failed to update user' }).code(500);
  }
};

const placeOrder = async (request, h) => {
  const { id } = request.auth.credentials;
  const { product, quantity } = request.payload;

  try {
    // Simpan pesanan ke database
    const placeOrderQuery = 'INSERT INTO orders (user_id, product, quantity) VALUES (?, ?, ?)';
    await query(placeOrderQuery, [id, product, quantity]);

    return h.response({ message: 'Order placed successfully' }).code(201);
  } catch (error) {
    console.error('Error placing order:', error);
    return h.response({ message: 'Failed to place order' }).code(500);
  }
};

const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  signUp,
  logIn,
  updateUser,
  placeOrder,
};

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Impor jwt
const sequelize = require('./config/database');
const User = require('./models/user');

const app = express();
app.use(bodyParser.json());

// Secret key untuk JWT
const JWT_SECRET = 'joni'; // Gantilah dengan secret yang lebih kuat dan aman

// Sinkronisasi model dengan database
sequelize.sync()
  .then(() => console.log('Database tersinkronisasi'))
  .catch(err => console.error('Gagal sinkronisasi database:', err));

// API untuk menambahkan pengguna
app.post('/api/users', async (req, res) => {
  const { username, nama, email, password, history } = req.body;
  console.log(req.body);
  if (!username || !nama || !email || !password || !history) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  try {
    // Hash password sebelum menyimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan data pengguna ke database
    const newUser = await User.create({
      username,
      nama,
      email,
      password: hashedPassword,
      history,
    });

    res.status(201).json({
      message: 'Pengguna berhasil ditambahkan',
      user: {
        username: newUser.username,
        nama: newUser.nama,
        email: newUser.email,
        history: newUser.history,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan pengguna', error: err.message });
  }
});

// API untuk login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password harus diisi' });
  }

  try {
    // Mencari pengguna berdasarkan username
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Memverifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // Membuat token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h', // Token akan kedaluwarsa dalam 1 jam
    });

    // Mengembalikan respons sukses jika login berhasil
    res.json({
      message: 'Login berhasil',
      user: {
        username: user.username,
        nama: user.nama,
        email: user.email,
        history: user.history,
      },
      token, // Sertakan token dalam respons
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal login', error: err.message });
  }
});

// API untuk mengambil semua pengguna (diperlukan otentikasi)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data pengguna', error: err.message });
  }
});

// Middleware untuk memverifikasi token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token tidak disediakan' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Gunakan middleware untuk endpoint yang memerlukan otentikasi
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data pengguna', error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const sequelize = require('./config/database');
const User = require('./models/user');
const { generateToken, verifyToken } = require('./middleware/auth');
const swagger = require('./swagger');
const root = require('./routes/root');
const feuture = require('./routes/feature');
const disease = require('./routes/disease');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());

app.enable('trust proxy');
app.set('json spaces', 2);

app.set('views', './view');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'view')));

sequelize
  .sync()
  .then(() => console.log('Database tersinkronisasi'))
  .catch((err) => console.error('Gagal sinkronisasi database:', err));

/**
 * @swagger
 *
 * /api/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "budihermawanto"
 *               name:
 *                 type: string
 *                 example: "Budi Hermawanto"
 *               email:
 *                 type: string
 *                 example: "budihermawanto@gmail.com"
 *               password:
 *                 type: string
 *                 example: "budi1234"
 *     responses:
 *       201:
 *         description: Pengguna berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Permintaan tidak valid
 *       500:
 *         description: Gagal menambahkan pengguna
 *
 * /api/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account:
 *                 type: string
 *                 example: "budihermawanto"
 *               password:
 *                 type: string
 *                 example: "budi1234"
 *     responses:
 *       201:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Permintaan tidak valid
 *       404:
 *         description: Pengguna tidak ditemukan
 *       500:
 *         description: Gagal login
 *
 * /api/user:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data pengguna berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Gagal mengambil data pengguna
 *   delete:
 *     tags:
 *       - Auth
 *     summary: Delete User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pengguna berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Gagal menghapus pengguna
 *
 * /api/listuser:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get List User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar pengguna berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       history:
 *                         type: array
 *                         items:
 *                           type: object
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Gagal mengambil daftar pengguna
 */

// eslint-disable-next-line consistent-return
app.post('/api/register', async (req, res) => {
  const {
    username, name, email, password,
  } = req.body;
  if (!username) {
    return res.status(400).json({ status: false, message: 'Masukkan username' });
  }
  if (!name) {
    return res.status(400).json({ status: false, message: 'Masukkan name' });
  }
  if (!email) {
    return res.status(400).json({ status: false, message: 'Masukkan email' });
  }
  if (!email.includes('@gmail')) {
    return res.status(400).json({ status: false, message: 'Harap pakai Gmail' });
  }
  if (!password) {
    return res.status(400).json({ status: false, message: 'Masukkan password' });
  }
  if (password.length < 6) {
    return res.status(400).json({ status: false, message: 'Kata sandi minimal harus 6 karakter' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      name,
      email,
      password: hashedPassword,
      history: '[]',
    });

    res.status(201).json({
      status: true,
      message: 'Pengguna berhasil ditambahkan',
      user: {
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        history: newUser.history,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: 'Gagal menambahkan pengguna' });
  }
});

// eslint-disable-next-line consistent-return
app.post('/api/login', async (req, res) => {
  const { account, password } = req.body;

  if (!account) {
    return res
      .status(400)
      .json({ status: false, message: 'Masukkan username atau email' });
  }
  if (!password) {
    return res
      .status(400)
      .json({ status: false, message: 'Masukkan password' });
  }

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: account },
          { username: account },
        ],
      },
    });

    if (!user) {
      return res.status(404).json({ status: false, message: 'Pengguna tidak ditemukan' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: false, message: 'Password salah' });
    }

    const token = generateToken(user.id);

    res.status(201).json({
      status: true,
      message: 'Login berhasil',
      token,
      user: {
        username: user.username,
        name: user.name,
        email: user.email,
        history: JSON.parse(user.history),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal login', error: err.message });
  }
});

app.get('/api/user', verifyToken, async (req, res) => {
  try {
    const data = req.user;
    const user = await User.findOne({
      where: {
        id: data.user.id,
      },
    });
    res.status(201).json({
      status: true,
      user: {
        username: user.username,
        name: user.name,
        email: user.email,
        password: user.password,
        history: JSON.parse(user.history),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: 'Gagal mengambil data pengguna', error: err.message });
  }
});

app.delete('/api/user', verifyToken, async (req, res) => {
  try {
    const data = req.user;
    const user = await User.destroy({
      where: {
        id: data.user.id,
      },
    });
    console.log(user);
    res.status(201).json({
      status: true,
      message: 'Pengguna berhasil di hapus',
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: 'Gagal mengambil data pengguna', error: err.message });
  }
});

app.get('/api/listuser', verifyToken, async (req, res) => {
  try {
    const users = await User.findAll();
    const list = users.map((user) => {
      const {
        id, password, history, ...userData
      } = user.dataValues;
      return userData;
    });
    res.status(201).json({ status: true, list });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: 'Gagal mengambil data pengguna', error: err.message });
  }
});

app.use('/', root);
app.use('/api', feuture);
app.use('/api', disease);
swagger(app);

app.use('*', (req, res) => res.status(404).json({
  status: false,
  message: 'Page Not Found',
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

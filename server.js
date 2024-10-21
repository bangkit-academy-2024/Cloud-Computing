const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Impor jwt
const sequelize = require("./config/database");
const User = require("./models/user");
const { generateToken, verifyToken } = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.enable("trust proxy");
app.set("json spaces", 2);

// Sinkronisasi model dengan database
sequelize
  .sync()
  .then(() => console.log("Database tersinkronisasi"))
  .catch((err) => console.error("Gagal sinkronisasi database:", err));

// API untuk menambahkan pengguna
app.post("/api/register", async (req, res) => {
  const { username, nama, email, password } = req.body;
  console.log(req.body);
  if (!username) {
    return res.status(400).json({ message: "Masukkan username" });
  }
  if (!nama) {
    return res.status(400).json({ message: "Masukkan nama" });
  }
  if (!email) {
    return res.status(400).json({ message: "Masukkan email" });
  }
  if (!password) {
    return res.status(400).json({ message: "Masukkan password" });
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
      history: [],
    });

    res.status(201).json({
      message: "Pengguna berhasil ditambahkan",
      user: {
        username: newUser.username,
        nama: newUser.nama,
        email: newUser.email,
        history: newUser.history,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menambahkan pengguna", error: err.message });
  }
});

// API untuk login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ message: "Masukkan username" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ message: "Masukkan password" });
  }

  try {
    // Mencari pengguna berdasarkan username
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    // Memverifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Membuat token JWT
    const token = generateToken(user.id);

    // Mengembalikan respons sukses jika login berhasil
    res.json({
      message: "Login berhasil",
      user: {
        username: user.username,
        nama: user.nama,
        email: user.email,
        history: user.history,
      },
      token, // Sertakan token dalam respons
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal login", error: err.message });
  }
});

// API untuk mengambil semua pengguna (diperlukan otentikasi)
app.get("/api/listuser", verifyToken, async (req, res) => {
  try {
    const users = await User.findAll();
    const list = users.map((user) => {
      const { password, ...userWithoutPassword } = user.dataValues;
      return userWithoutPassword;
    });
    res.json(list);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data pengguna", error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

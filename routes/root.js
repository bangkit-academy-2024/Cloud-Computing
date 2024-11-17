const express = require('express');
// const axios = require('axios');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/api');
});

router.get('/register', (req, res) => {
  const { curdToken } = req.cookies;
  if (curdToken) {
    return res.redirect('/dashboard');
  }
  return res.render('register', { error: '' });
});

router.get('/login', (req, res) => {
  const { curdToken } = req.cookies;
  if (curdToken) {
    return res.redirect('/dashboard');
  }
  return res.render('login', { error: '' });
});

router.get('/logout', (req, res) => {
  res.clearCookie('curdToken');
  res.redirect('/login');
});

router.get('/dashboard', authMiddleware, (req, res) => res.status(404).json({
  status: true,
  message: 'Anda berhasil login',
  endpoint: {
    profile: '/profile',
    chatbot: '/chat',
    logout: '/logout',
  },
}));

router.get('/profile', authMiddleware, async (req, res) => {
  const { curdToken } = req.cookies;

  const url = `${req.protocol}://${req.get('host')}/api/user`;
  const token = `Bearer ${curdToken}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: '*/*',
      Authorization: token,
    },
  });
  const data = await response.json();
  const bio = data.user;
  return res.render('profile', { bio });
});

router.get('/chat', (req, res) => {
  res.render('chat');
});

module.exports = router;

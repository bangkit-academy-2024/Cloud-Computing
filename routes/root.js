const express = require('express');
const axios = require('axios');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
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

router.get('/dashboard', authMiddleware, (req, res) => {
  res.render('dashboard');
});

router.get('/profile', authMiddleware, async (req, res) => {
  const { curdToken } = req.cookies;

  const url = `${req.protocol}://${req.get('host')}/api/user`;
  const token = `Bearer ${curdToken}`;

  const response = await axios.get(url, {
    headers: {
      Accept: '*/*',
      Authorization: token,
    },
  });
  const bio = response.data.user;
  return res.render('profile', { bio });
});

router.get('/chat', (req, res) => {
  res.render('chat');
});

module.exports = router;

const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(userId) {
  const payload = {
    user: {
      id: userId,
    },
  };
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: 360000,
  };

  return jwt.sign(payload, secret, options);
}

// eslint-disable-next-line consistent-return
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }
  const token = authHeader.substring('Bearer '.length);
  const secret = process.env.JWT_SECRET;
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Unauthorized');
  }
}

// eslint-disable-next-line consistent-return
async function authMiddleware(req, res, next) {
  const { curdToken } = req.cookies;
  if (curdToken) {
    try {
      const deCodeToken = await jwt.verify(curdToken, process.env.JWT_SECRET);
      req.userInfo = deCodeToken;
      next();
    } catch {
      return res.redirect('/login');
    }
  } else {
    return res.redirect('/login');
  }
}

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
};

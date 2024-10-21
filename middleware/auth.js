const jwt = require("jsonwebtoken");
require("dotenv").config();

// This function generates a JWT token for a given user ID
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

// This middleware function verifies that the request has a valid JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }
  const token = authHeader.substring("Bearer ".length);
  const secret = process.env.JWT_SECRET;
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
}

module.exports = {
  generateToken,
  verifyToken,
};

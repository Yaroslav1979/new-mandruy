const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: 'Немає токена' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // додаємо id в req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Недійсний токен' });
  }
};
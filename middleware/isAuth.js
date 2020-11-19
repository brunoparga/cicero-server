const jwt = require('jsonwebtoken');

module.exports = (req, _, next) => {
  const token = req.get('Authorization').split(' ')[1] || '';
  let decodedToken;
  if (token) {
    decodedToken = jwt.verify(token, process.env.TOKEN_SIGNING_SECRET);
  }
  req.userId = decodedToken.id;
  next();
};

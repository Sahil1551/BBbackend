const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const accessToken = req.header('Authorization');

    if (!accessToken) {
      return res.status(401).json({ msg: 'Access Denied. Missing Authorization header' });
    }

    const token = accessToken.replace('Bearer ', ''); 

    jwt.verify(token, process.env.JWT_SECRET_KEY_ACCESS, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: 'Invalid Token. Authorization failed' });
      }
      
      req.user = decoded;
      next(); 
    });
  } catch (err) {
    console.error('Authorization Error:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = auth;



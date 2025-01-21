const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
   //Check if the request has the authorization header
   const authorization = req.header('authorization');
   if (!authorization) 
      return res.status(401).json({ error: 'Token not found' });

   // Extract the token from the request's header
   const token = req.header('authorization').split(' ')[1];
   if (!token) return res.status(401).json({ error: 'Unauthorized' });

   try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded payload to the request object
      req.user = decoded;
      next();
   } catch (err) {
      console.error(err);
      res.status(401).json({ error: 'Invalid token' });
   }
};

const generateToken = (userData) => {
   return jwt.sign(userData, process.env.JWT_SECRET);
}

module.exports = { jwtAuthMiddleware, generateToken };
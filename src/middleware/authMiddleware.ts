import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Protected Routes, Token Based
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  const currentToken = authHeader && authHeader.split(' ')[1];
//   console.log(req.headers.authorization);


  if (currentToken == null) {
    // console.log(currentToken);
    return res.status(403).json({ message: 'You are Unauthorized - please provide token' });
  }
  const jwt_secret = process.env.JWT_SECRET || "";

  // Verify the token in the header
  jwt.verify(currentToken, jwt_secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Access Forbidden' });
    }
    if (typeof user === 'object' && user !== null) {
      
      req.body._id = user._id;
      next();
    } else {
      next();
    }
  });
}

export { authenticateToken };

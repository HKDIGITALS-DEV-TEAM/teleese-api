import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

module.exports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res.status(401).json({ message: "Authorization header is missing" });
    }

    const tokenParts = bearerToken.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format. Expected 'Bearer <token>'" });
    }

    const token = tokenParts[1];

    const tokenData = jwt.decode(token);

    req.body = {...req.body, tokenData}

    next();
  } catch (error) {

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token has expired" });
    }

    next(error);
  }
};
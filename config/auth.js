import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getCookieOptions } from "./cookieOptions.js";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    
    // Fallback to Bearer token header if cookie is absent
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "User is not authenticated",
        success: false,
      });
    }

    const decode = jwt.verify(token, JWT_SECRET);
    const userId = decode.id || decode.userId;
    
    req.userId = userId;
    req.user = {
      id: userId,
      _id: userId,
      userType: decode.userType,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Verification Error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export default isAuthenticated;

export const verifyAndRefreshToken = (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authenticated", success: false });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id || decoded.userId;

    const refreshedToken = jwt.sign(
      { id: userId, userType: decoded.userType },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", refreshedToken, getCookieOptions());

    req.userId = userId;
    req.user = {
      id: userId,
      _id: userId,
      userType: decoded.userType,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token expired or invalid", success: false });
  }
};
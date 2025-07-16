import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(`token:- ${token}`);

    if (!token) {
      return res.status(401).json({
        message: "user is not authenticated",
        success: false,
      });
    }
    const decode = await jwt.verify(token, JWT_SECRET);
    console.log(`JWT verify: ${JSON.stringify(decode)}`);
    req.user = decode.userId;
    next();
  } catch (error) {
    console.log(`network error :- ${error}`);
    return res.status(500).json({
      message: "Internal Server Error or Invalid Token",
      success: false,
    });
  }
};

export default isAuthenticated;


export const verifyAndRefreshToken = (req, res, next) =>{
  const token = req.cookies?.token;
  if(!token) return res.status(401).json({message: "Not authenticated"});

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const refreshedToken = jwt.sign(
      {id: decoded.id, userType: decoded.userType},
      JWT_SECRET,
      { expiresIn: "30s"}
    );
    res.cookie("token", refreshedToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 1000
    });

    req.user = decoded
    next();

  } catch (error) {
    return req.status(401).json({message: "Token expired or invalid"})
  }
}
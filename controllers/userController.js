import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userType,
    });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
     const token = jwt.sign(
      { id: user._id, userType: user.userType },
      JWT_SECRET,
      // { expiresIn: "30s" }
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ⚠️ set to true in production
      sameSite: "none",
      // maxAge: 30 * 1000 // change the same value of token expire
    });

    res.status(200).json({
      message: `${user.name} WellCome Back`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });

  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async(req, res) =>{
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // ⚠️ set to true in production
      sameSite: "none",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in user logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const getMe = async(req, res) =>{
  try {

    const token = req.cookies.token;

    if(!token){
      return res.status(401).json({message:"Unauthorized"})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select("-password")

    if(!user){
      return res.status(404).json({message:"User not found"})
    }

    res.json({user})
    
  } catch (error) {
    console.error("Error in getting user info:", error);
    res.status(500).json({
      message:"Internal server error"
    })
  }
}
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Create Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    // Create JWT token
    const token = createToken(user._id);
    res.json({ success: true, message: "Login successful", token,user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error, please try again later." });
  }
};

// Register User
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Check if user already exists
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "User already exists." });
    }

    // Validate email format and password strength
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email." });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password (at least 8 characters)." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashPassword,
    });

    // Save user
    const user = await newUser.save();

    // Create JWT token
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error occurred during registration." });
  }
}


export { loginUser, registerUser };

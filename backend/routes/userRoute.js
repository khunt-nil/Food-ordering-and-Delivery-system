import express from "express"
import {loginUser,registerUser }from "../controllers/userController.js"
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
const  userRouter =express.Router();

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/verify-token", async(req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await userModel.findById(decoded.id)
        res.json({ success: true, message: "Token is valid", user: user });
    } catch (error) {
        console.log(error)
        res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
});
export default userRouter
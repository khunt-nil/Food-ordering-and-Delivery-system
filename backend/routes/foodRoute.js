import express from "express";
import { addFood,listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();
//store image 
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Define the POST route for adding food with an image
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);

export default foodRouter;

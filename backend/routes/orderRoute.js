import express from 'express';
import authMiddleware from "../middleware/auth.js"
import { placeOrder,getOrders, verifyOrder, getUserOrders, updateStatus } from '../controllers/orderController.js';

const orderRouter = express.Router();

// Route to create a new order
orderRouter.post('/place',placeOrder);
orderRouter.get("/", getOrders);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/get-order",getUserOrders);
orderRouter.put("/update-status/:orderId",updateStatus);
export default orderRouter;

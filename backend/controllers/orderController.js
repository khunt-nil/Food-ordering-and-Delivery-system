
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from "stripe";
import jwt from 'jsonwebtoken';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:3000";

    try {
        const { address, amount, items } = req.body;

        // Validate required fields
        if (!address || !amount || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Missing required fields or items" });
        }

        const { firstName, lastName, email, street, city, state, pincode, country, phone } = address;

        if (!firstName || !lastName || !email || !street || !city || !state || !pincode || !country || !phone) {
            return res.status(400).json({ success: false, message: "Incomplete address details" });
        }

        // Create a new order in MongoDB
        const newOrder = new orderModel({
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            pincode,
            country,
            phone,
            items,
            totalAmount: amount+20,
        });

        await newOrder.save();

        // Prepare items for Stripe Checkout
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Convert price to paisa
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 2000, // 20 INR in paisa
            },
            quantity: 1,
        });

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
const verifyOrder = async (req, res) => {
    try {
        const { orderId, success } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        if(success == true){
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            return res.json({success:true,message:"Paid"})
        }else{
            await orderModel.findByIdAndDelete(orderId)
            return res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};


const getOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; 
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }


        // Verify and decode the token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Extract user ID from the token

        if (!userId) {
            return res.status(400).json({ success: false, message: "Invalid token data" });
        }

        // Fetch user details from the database
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log(user)
        // Fetch orders for the specific user email
        const userOrders = await orderModel.find({ email: user.email }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders: userOrders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateStatus = async(req,res)=>{
    try {
        const { orderId } = req.params;
        const { status } = req.body;
    
        // Validate status value
        const validStatuses = ["Pending", "Processing", "Delivered"];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ success: false, message: "Invalid status" });
        }
    
        // Find and update the order
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    
        if (!updatedOrder) {
          return res.status(404).json({ success: false, message: "Order not found" });
        }
    
        res.json({ success: true, message: "Order status updated", order: updatedOrder });
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
      }
}
export { placeOrder,getOrders ,verifyOrder,getUserOrders,updateStatus};

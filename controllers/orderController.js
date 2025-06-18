import orderModel from "../models/orderModel.js";
import userModel  from "../models/userModel.js";
import Stripe     from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = "http://localhost:5174";

/* ────────────────────────── 1. placeOrder ────────────────────────── */
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId:  req.body.userId,
      items:   req.body.items,
      amount:  req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map(item => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),     // ₹→paise
      },
      quantity: item.quantity,
    }));

    // delivery charge
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url:  `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

/* ────────────────────────── 2. verifyOrder ────────────────────────── */
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return res.json({ success: true, message: "Paid" });
    }
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: false, message: "Not Paid" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error verifying order" });
  }
};

/* ────────────────────────── 3. userOrders ────────────────────────── */
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// Listing orders for admin panel
const listOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:Error})
        
    }
}

// api for updating order status
const updateStatus = async (req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})

    } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
        
    }

}

/* ────────────────────────── 4. exports ───────────────────────────── */
export { placeOrder, verifyOrder, userOrders ,listOrders,updateStatus};

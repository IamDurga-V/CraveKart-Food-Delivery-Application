import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const placeOrder = async (req, res) => {
  let newOrder;
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;
    console.log(
      "placeOrder: Request received for userId:",
      userId,
      "amount:",
      amount,
    );
    newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_order_${newOrder._id}`,
    };
    console.log(
      "placeOrder: Attempting to create Razorpay order with options:",
      options,
    );
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
    } catch (razorpayError) {
      console.error(
        "placeOrder: Failed to create Razorpay order:",
        razorpayError.message,
      );
      if (newOrder && newOrder._id) {
        await orderModel.findByIdAndDelete(newOrder._id);
      }
      return res.status(500).json({
        success: false,
        message: "Failed to initiate payment. Please try again.",
        details: razorpayError.message,
      });
    }
    res.json({
      success: true,
      orderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error(
      "placeOrder: General order placement failure (MongoDB or unhandled):",
      error,
    );
    if (newOrder && newOrder._id && !res.headersSent) {
      await orderModel.findByIdAndDelete(newOrder._id);
    }
    res.status(500).json({ success: false, message: "Order placement failed" });
  }
};
const verifyOrder = async (req, res) => {
  const {
    orderId,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  } = req.body;
  try {
    if (
      !orderId ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      console.error(
        "verifyOrder: Missing required payment verification parameters:",
        { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature },
      );
      if (orderId) {
        await orderModel.findByIdAndDelete(orderId);
        console.log(
          "verifyOrder: Deleted MongoDB order due to missing verification parameters:",
          orderId,
        );
      }
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Missing parameters",
      });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("verifyOrder: Verifying signature for body:", body);
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    if (expectedSignature === razorpay_signature) {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        paymentId: razorpay_payment_id,
      });
      return res.json({
        success: true,
        message: "Payment Verified & Order Saved",
      });
    } else {
      console.error(
        "verifyOrder: Payment verification failed: Signature mismatch for order ID:",
        orderId,
      );
      if (orderId) {
        await orderModel.findByIdAndDelete(orderId);
      }
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Invalid signature",
      });
    }
  } catch (error) {
    console.error("verifyOrder: General verification error:", error);
    if (orderId) {
      await orderModel.findByIdAndDelete(orderId);
    }
    return res.status(500).json({
      success: false,
      message: "Server Error during payment verification",
    });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("userOrders: Fetching orders for userId:", userId);
    const orders = await orderModel
      .find({ userId, payment: true })
      .sort({ createdAt: -1 });
    console.log(
      "userOrders: Found",
      orders.length,
      "paid orders for userId:",
      userId,
    );
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("userOrders: Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//API for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };

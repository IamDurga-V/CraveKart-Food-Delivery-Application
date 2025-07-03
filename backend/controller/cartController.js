import userModel from "../models/userModel.js";

// Add items to UserCart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.body.itemId;
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Remove items from UserCart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.body.itemId;
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};
    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Fetch User Cart Data
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };

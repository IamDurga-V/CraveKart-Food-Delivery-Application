// offerController.js
import offerModel from "../models/offerModel.js";
import userModel from "../models/userModel.js";

// ✅ Validate an offer code
export const validateOffer = async (req, res) => {
  try {
    const userId = req?.user?.id || req.body.userId || null;
    const { code, orderAmount } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({ success: false, message: "Code and order amount are required" });
    }

    const offer = await offerModel.findOne({ code: code.toUpperCase(), isActive: true });
    if (!offer) return res.status(404).json({ success: false, message: "Offer code not found or inactive" });

    if (offer.expiryDate < new Date()) {
      return res.status(400).json({ success: false, message: "Offer code expired" });
    }

    if (orderAmount < offer.minOrderAmount) {
      return res.status(400).json({ success: false, message: `Minimum order amount for this offer is ₹${offer.minOrderAmount}` });
    }

    if (offer.forNewUsersOnly) {
      if (!userId) return res.status(400).json({ success: false, message: "User ID required for this offer" });
      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      if (Array.isArray(user.orders) && user.orders.length > 0) {
        return res.status(400).json({ success: false, message: "Offer valid for new users only" });
      }
    }

    let discountAmount = 0;
    discountAmount = offer.discountType === "flat"
      ? offer.discountValue
      : (orderAmount * offer.discountValue) / 100;
    discountAmount = Math.min(discountAmount, orderAmount);

    return res.status(200).json({ success: true, discountAmount, message: "Offer applied successfully" });

  } catch (error) {
    console.error("Offer validation error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while validating offer" });
  }
};

// ✅ Create offer
export const createOffer = async (req, res) => {
  try {
    const offer = await offerModel.create(req.body);
    res.status(201).json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating offer" });
  }
};

// ✅ Delete offer
export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    await offerModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting offer" });
  }
};

// ✅ Get all offers
export const getAllOffers = async (req, res) => {
  try {
    const offers = await offerModel.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching offers" });
  }
};

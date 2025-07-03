import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const totalIncome = await orderModel
      .aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ])
      .then((result) => result[0]?.total || 0);
    const totalUsers = await userModel.countDocuments({ role: "User" });
    res.status(200).json({
      success: true,
      totalOrders,
      totalIncome,
      totalUsers,
    });
  } catch (error) {
    console.error("Admin stats fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export { getAdminStats };

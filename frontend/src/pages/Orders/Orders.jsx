import React, { useState, useEffect } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../../../frontend/src/assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
        console.log("✅ Orders fetched:", response.data.data);
      } else {
        toast.error("❌ Failed to fetch orders");
      }
    } catch (error) {
      toast.error("❌ Server Error");
      console.error("Fetch Error:", error);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const newStatus = event.target.value;
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus,
      });

      if (response.data.success) {
        toast.success("✅ Status updated");
        fetchAllOrders(); // refresh the orders list
      } else {
        toast.error("❌ Failed to update status");
      }
    } catch (error) {
      toast.error("❌ Error updating status");
      console.error("Status Update Error:", error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="parcel" />

              {/* 🥗 Food Items Column */}
              <div className="order-item-food">
                {order.items.map((item, i) => (
                  <p key={i}>
                    {item.name} x {item.quantity}
                  </p>
                ))}
              </div>

              {/* 📦 Address Details */}
              <div className="order-item-address">
                <p className="order-item-name">{order.address.name}</p>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country}, {order.address.zipcode}
                </p>
                <p>{order.address.phone}</p>
              </div>

              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>

              {/* 🔄 Status Dropdown */}
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;

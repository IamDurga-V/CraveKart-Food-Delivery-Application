import React, { useState, useEffect, useContext } from 'react';
import './MyOrder.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userOrders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data.data || []);
      console.log("Fetched Orders:", response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {loading ? (
          <p className="loading-message">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p className="no-orders-message">You haven't placed any orders yet.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="parcel" />
              <p>
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x{item.quantity}
                    {idx !== order.items.length - 1 && ', '}
                  </span>
                ))}
              </p>
              <p>₹{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrder;

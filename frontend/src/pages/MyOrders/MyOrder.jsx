import React, { useState, useEffect, useContext } from 'react';
import './MyOrder.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const MyOrder = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(`${url}/api/order/userOrders`, {}, {
        headers: { token }
      });
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? ( // Conditional rendering: if data array is empty
          <p className="no-orders-message">You haven't placed any orders yet.</p>
        ) : (
          // Else, map through the orders and display them
          data.map((order, index) => {
            return (
              <div key={index} className='my-orders-order'>
                <img src={assets.parcel_icon} alt="parcel" />
                <p>
                  {
                    order.items.map((item, idx) => {
                      return `${item.name} x${item.quantity}${idx !== order.items.length - 1 ? ', ' : ''}`;
                    })
                  }
                </p>
                <p>₹{order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                <button onClick={fetchOrders}>Track Order</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrder;

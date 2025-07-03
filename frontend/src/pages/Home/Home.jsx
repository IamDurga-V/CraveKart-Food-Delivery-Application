import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const Home = () => {
  const { token, url } = useContext(StoreContext);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalIncome: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        console.warn("Token not yet set, skipping fetchStats.");
        return;
      }
      try {
        const res = await axios.get(`${url}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setStats({
            totalOrders: res.data.totalOrders,
            totalIncome: res.data.totalIncome,
            totalUsers: res.data.totalUsers,
          });
        } else {
          console.error("Stats fetch failed:", res.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [url, token]);

  return (
    <div className="admin-home">
      <div className="home-container">
        <div className="hero-section">
          <h1>Welcome, Admin!</h1>
          <div className="underline"></div>
        </div>
        {loading ? (
          <p className="loading-message">Loading stats...</p>
        ) : (
          <div className="metrics-grid">
            <div className="metric-card">
              <img
                src={assets.order_icon}
                alt="Orders Icon"
                className="metric-icon"
              />
              <h3>Orders</h3>
              <p>{stats.totalOrders}</p>
            </div>
            <div className="metric-card">
              <img
                src={assets.revenue_icon}
                alt="Revenue Icon"
                className="metric-icon"
              />
              <h3>Revenue</h3>
              <p>₹{stats.totalIncome.toLocaleString()}</p>
            </div>
            <div className="metric-card">
              <img
                src={assets.users_icon}
                alt="Users Icon"
                className="metric-icon"
              />
              <h3>Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
          </div>
        )}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/add" className="action-button">
              <img
                src={assets.add_icon}
                alt="Add Icon"
                className="button-icon"
              />
              Add Item
            </Link>
            <Link to="/update" className="action-button">
              <img
                src={assets.update_icon}
                alt="Update Icon"
                className="button-icon"
              />
              Update Item
            </Link>
            <Link to="/display" className="action-button">
              <img
                src={assets.display_icon}
                alt="View Icon"
                className="button-icon"
              />
              View Items
            </Link>
            <Link to="/orders" className="action-button">
              <img
                src={assets.order_icon}
                alt="Orders Icon"
                className="button-icon"
              />
              Manage Orders
            </Link>
            <Link to="/add-offer" className="action-button">
              <img
                src={assets.add_icon}
                alt="Orders Icon"
                className="button-icon"
              />
              Add Offers
            </Link>
            <Link to="/manage-offers" className="action-button">
              <img
                src={assets.update_icon}
                alt="Orders Icon"
                className="button-icon"
              />
              Manage Offers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

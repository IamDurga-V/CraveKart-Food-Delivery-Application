import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <img src={assets.add_icon} alt="" className="sidebar-icon" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/update" className="sidebar-option">
          <img src={assets.update_icon} alt="" className="sidebar-icon" />
          <p>Update Items</p>
        </NavLink>
        <NavLink to="/display" className="sidebar-option">
          <img src={assets.display_icon} alt="" className="sidebar-icon" />
          <p>Display Items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <img src={assets.order_icon} alt="" className="sidebar-icon" />
          <p>Orders</p>
        </NavLink>

        {/* ✅ Added Offer Management Options */}
        <NavLink to="/add-offer" className="sidebar-option">
          <img src={assets.add_icon} alt="" className="sidebar-icon" />
          <p>Add Offer</p>
        </NavLink>
        <NavLink to="/manage-offers" className="sidebar-option">
          <img src={assets.update_icon} alt="" className="sidebar-icon" />
          <p>Manage Offers</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

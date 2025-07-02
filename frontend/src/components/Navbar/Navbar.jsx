import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optionally add confirmation
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    // Clear token or user info
    localStorage.removeItem("token"); // Or your specific key

    // Navigate to login
    navigate("/");
  };

  return (
    <div className="navbar">
      <img src={assets.logo} alt="Logo" className="logo" />
      <img
        src={assets.profile_image}
        alt="Profile"
        className="profile"
        onClick={handleLogout}
        style={{ cursor: "pointer" }}
        title="Click to logout"
      />
    </div>
  );
};

export default Navbar;

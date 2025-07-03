import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = () => {
  const navigate = useNavigate();
  // Destructure setUserId here as well, so it can be cleared on logout
  const { setToken, setUserRole, setUserId } = useContext(StoreContext); 

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    // Clear context states
    setToken("");       // Set token to empty string (not null) for consistency
    setUserRole("User"); // Explicitly set role to "User" (default non-admin)
    setUserId("");      // Clear userId

    // Clear localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId"); // Clear userId from localStorage

    // Redirect to home page
    navigate("/");
  };

  return (
    <div className="navbar">
      <img onClick={() => navigate("/admin")} src={assets.admin_logo} alt="Logo" className="logo" />
      <img
        src={assets.profile_image}
        alt="Profile"
        className="profile"
        onClick={handleLogout}
        title="Click to logout"
      />
    </div>
  );
};

export default Navbar;
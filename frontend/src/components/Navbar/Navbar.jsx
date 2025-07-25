import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { setToken, setUserRole, setUserId } = useContext(StoreContext);
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    setToken("");
    setUserRole("User");
    setUserId("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };
  return (
    <div className="navbar">
      <img
        onClick={() => navigate("/admin")}
        src={assets.admin_logo}
        alt="Logo"
        className="logo"
      />
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

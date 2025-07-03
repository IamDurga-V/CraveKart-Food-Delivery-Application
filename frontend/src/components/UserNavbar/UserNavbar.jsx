import React, { useContext, useState } from "react";
import "./UserNavbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import SearchModal from "../SearchModal/SearchModal"; // Make sure this import is correct

const UserNavbar = ({ setShowLogin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menu, setMenu] = useState("menu");
  const [showSearch, setShowSearch] = useState(false); // State for modal
  const {
    getTotalCartAmount,
    token,
    setToken,
    setUserRole,
    setUserId // <<< Added setUserId here
  } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    // Clear localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId"); // <<< Clear userId from localStorage

    // Clear context states
    setToken("");       // Set token to empty string
    setUserRole("User"); // Explicitly set role to "User"
    setUserId("");      // Clear userId

    // Redirect to home page
    navigate("/");
  };

  const handleMenuClick = (selected) => {
    setMenu(selected);
    setMenuOpen(false);
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img
          src={assets.logo}
          alt="CraveKart"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </Link>
      <ul className={`navbar-menu ${menuOpen ? "open" : ""}`}>
        <Link
          to="/"
          onClick={() => handleMenuClick("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#offers"
          onClick={() => handleMenuClick("offers")}
          className={menu === "offers" ? "active" : ""}
        >
          Offers
        </a>
        <a
          href="#explore-menu"
          onClick={() => handleMenuClick("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => handleMenuClick("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile App
        </a>
        <a
          href="#footer"
          onClick={() => handleMenuClick("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>

      <div className="navbar-right">
        <img
          src={assets.search_icon}
          alt="Search"
          className="search-trigger"
          onClick={() => setShowSearch(true)}
        />

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" />
            <ul className="navbar-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="Orders" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>

      {showSearch && (
        <SearchModal onClose={() => setShowSearch(false)} />
      )}
    </div>
  );
};

export default UserNavbar;
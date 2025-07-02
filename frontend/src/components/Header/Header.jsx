import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Crave it? Get it delivered.</h2>
        <p>
          Explore a diverse menu featuring a delectable array of dishes, crafted
          with the finest ingredients and culinary expertise. At CraveKart, our
          mission is to satisfy your cravings and elevate your dining experience
          — one delicious meal at a time.
        </p>
        <a href="#explore-menu">
          <button>View Menu</button>
        </a>
      </div>
    </div>
  );
};

export default Header;

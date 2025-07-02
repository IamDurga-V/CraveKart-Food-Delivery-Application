import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const priceFilters = [
  { label: "All", value: "All" },
  { label: "Under ₹100", value: "under-100" },
  { label: "₹100 - ₹200", value: "100-200" },
  { label: "Above ₹200", value: "above-200" },
];

const ExploreMenu = ({ category, setCategory, priceRange, setPriceRange }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Our Menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes. Our
        mission is to satisfy your cravings and elevate your dining experience —
        one delicious meal at a time.
      </p>

      {/* Category Filter */}
      <h3 className="explore-menu-heading">Filter by Category</h3>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => (
          <div
            onClick={() =>
              setCategory((prev) =>
                prev === item.menu_name ? "All" : item.menu_name,
              )
            }
            key={index}
            className="explore-menu-list-item"
          >
            <img
              className={category === item.menu_name ? "active" : ""}
              src={item.menu_image}
              alt=""
            />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>

      {/* Price Filter as Buttons */}
      <h3 className="explore-menu-heading">Filter by Price</h3>
      <div className="explore-menu-price-buttons">
        {priceFilters.map((filter, index) => (
          <button
            key={index}
            className={`price-filter-button ${priceRange === filter.value ? "active" : ""}`}
            onClick={() => setPriceRange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;

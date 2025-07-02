import React, { useContext, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, priceRange }) => {
  const { food_list } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filterByPrice = (price) => {
    if (priceRange === "All") return true;
    if (priceRange === "under-100") return price < 100;
    if (priceRange === "100-200") return price >= 100 && price <= 200;
    if (priceRange === "above-200") return price > 200;
  };

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header">
        <h2>Cravings? We’ve Got You Covered!</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="food-display-list">
        {food_list
          .filter(
            (item) =>
              (category === "All" || item.category === category) &&
              filterByPrice(item.price) &&
              item.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
      </div>
    </div>
  );
};

export default FoodDisplay;

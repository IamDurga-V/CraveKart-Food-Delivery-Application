import React, { useContext, useState, useEffect } from "react";
import "./SearchModal.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const SearchModal = ({ onClose }) => {
  const { food_list, url } = useContext(StoreContext);
  const [query, setQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState([]);

  useEffect(() => {
    const results = food_list.filter((food) =>
      food.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFoods(results);
  }, [query, food_list]);

  const scrollToFoodItem = (id) => {
    const element = document.getElementById(`food-item-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      onClose();
    }
  };

  return (
    <div className="search-modal-overlay">
      <div className="search-modal">
        {/* ❌ Close Icon */}
        <button className="close-btn" onClick={onClose}>×</button>

        <input
          type="text"
          placeholder="Search for dishes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="search-results">
          {filteredFoods.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px" }}>
              No items found.
            </p>
          ) : (
            filteredFoods.map((food) => (
              <div
                className="search-result-item"
                key={food._id}
                onClick={() => scrollToFoodItem(food._id)}
              >
                <img
                  src={`${url}/images/${food.image}`}
                  alt={food.name}
                  className="result-image"
                />
                <div className="result-info">
                  <p className="result-name">{food.name}</p>
                  <p className="result-price">₹{food.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

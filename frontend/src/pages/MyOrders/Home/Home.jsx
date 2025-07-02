import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import Offers from "../../components/Offers/Offers";

const Home = () => {
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

  return (
    <div>
      <Header />

      {/* ✅ Only one Offers section with proper ID */}
      <div id="offers">
        <Offers />
      </div>

      <ExploreMenu
        category={category}
        setCategory={setCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />
      <FoodDisplay category={category} priceRange={priceRange} />
    </div>
  );
};

export default Home;

import React, { useEffect, useRef, useState } from "react";
import "./Offers.css";
import axios from "axios";
import { assets } from "../../assets/assets";

const Offers = () => {
  const [offersData, setOffersData] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const scrollRef = useRef(null);
  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/offer/all`);
      setOffersData(res.data);
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  };
  useEffect(() => {
    fetchOffers();
  }, []);
  const scrollLeft = () => {
    scrollRef.current.scrollLeft -= 300;
  };
  const scrollRight = () => {
    scrollRef.current.scrollLeft += 300;
  };
  return (
    <div className="offers" id="offers">
      <h1 className="offers-heading">CraveKart Exclusive Offers</h1>
      <p className="offers-subtext">
        Save big every time you order with CraveKart. Discover mouth-watering
        meals and unbeatable deals tailored just for you.
      </p>
      <p className="offers-subtext">
        Whether you're a first-time foodie or a regular craver, there's
        something special waiting!
      </p>

      <div className="offers-carousel-container">
        <button className="scroll-btn left" onClick={scrollLeft}>
          ◀
        </button>

        <div className="offers-scroll-wrapper" ref={scrollRef}>
          <div className="offer-image-circle">
            <img src={assets.offer_banner} alt="Promo Banner" />
          </div>
          {offersData.map((offer) => (
            <div className="offer-card" key={offer._id}>
              <div className="offer-badge">
                {offer.forNewUsersOnly
                  ? "New"
                  : offer.discountType === "flat"
                    ? "Hot Deal"
                    : "Discount"}
              </div>
              <h3>
                {offer.discountType === "flat"
                  ? `Flat ₹${offer.discountValue} OFF`
                  : `${offer.discountValue}% OFF`}
              </h3>
              <p>On orders above ₹{offer.minOrderAmount}.</p>
              {offer.description && (
                <p className="offer-description">{offer.description}</p>
              )}
              {offer.code && offer.code !== "N/A" && (
                <p className="offer-code">
                  <img src={assets.tag_icon} alt="Tag Icon" />
                  <strong>Use Code:</strong> {offer.code}
                </p>
              )}
              <p className="validity">
                {offer.expiryDate
                  ? `Valid till ${new Date(offer.expiryDate).toLocaleDateString()}`
                  : "Limited time offer!"}
              </p>
            </div>
          ))}
        </div>
        <button className="scroll-btn right" onClick={scrollRight}>
          ▶
        </button>
      </div>
    </div>
  );
};

export default Offers;

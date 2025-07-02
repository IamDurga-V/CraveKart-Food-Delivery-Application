import React from "react";
import "./Offers.css";
import { assets } from "../../assets/assets";

const offersData = [
  {
    id: 1,
    title: "Flat ₹100 OFF",
    description: "On orders above ₹499. Use code: CRAVE100",
    code: "CRAVE100",
    validTill: "Valid till 30th June 2025",
    badge: "Hot Deal",
  },
  {
    id: 2,
    title: "20% OFF on First Order",
    description: "New users only. Use code: FIRST20",
    code: "FIRST20",
    validTill: "Valid till 15th July 2025",
    badge: "New",
  },
  {
    id: 3,
    title: "Free Delivery",
    description: "On orders above ₹299. No code required.",
    code: "N/A",
    validTill: "Limited time offer!",
    badge: "Free Delivery",
  },
];

const Offers = () => {
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

      <div className="offers-container">
        {/* Left image */}
        <div className="offers-image">
          <img src={assets.offer_banner} alt="Offers Banner" />
        </div>

        {/* Right cards */}
        <div className="offers-list">
          {offersData.map((offer) => (
            <div className="offer-card" key={offer.id}>
              <div className="offer-badge">{offer.badge}</div>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              {offer.code !== "N/A" && (
                <p className="offer-code">
                  <img src={assets.tag_icon} alt="Tag" />
                  <strong>Use Code:</strong> {offer.code}
                </p>
              )}
              <p className="validity">{offer.validTill}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offers;

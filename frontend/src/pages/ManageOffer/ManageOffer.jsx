import React, { useEffect, useState } from "react";
import "./ManageOffer.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageOffer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all offers from backend
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/offer/all");
      setOffers(res.data || []); // Fallback to empty array if no data
    } catch (err) {
      toast.error("Error fetching offers", { position: "top-center" });
    }
    setLoading(false);
  };

  // Handle offer deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/offer/${id}`);
      toast.success("Offer deleted successfully", { position: "top-center" });
      fetchOffers(); // Refresh the list after deletion
    } catch (err) {
      toast.error("Error deleting offer", { position: "top-center" });
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="manage-offers-container">
      <h2>Manage Offers</h2>

      {loading ? (
        <p>Loading offers...</p>
      ) : offers.length === 0 ? (
        <p className="no-offers">No offers available</p>
      ) : (
        <>
          <div className="display-table-format title">
            <div>Code</div>
            <div>Type</div>
            <div>Discount</div>
            <div>Min Order</div>
            <div>Expiry</div>
            <div>New Users</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {offers.map((offer) => (
            <div className="display-table-format" key={offer._id}>
              <div>{offer.code}</div>
              <div>{offer.discountType}</div>
              <div>
                {offer.discountType === "delivery"
                  ? "Free Delivery"
                  : offer.discountValue}
              </div>
              <div>{offer.minOrderAmount}</div>
              <div>{new Date(offer.expiryDate).toLocaleDateString()}</div>
              <div>{offer.forNewUsersOnly ? "Yes" : "No"}</div>
              <div>{offer.isActive ? "Active" : "Inactive"}</div>
              <div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(offer._id)}
                  title={`Delete offer ${offer.code}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default ManageOffer;

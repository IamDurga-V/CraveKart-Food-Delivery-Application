import React, { useState } from "react";
import "./AddOffer.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddOffer = () => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "flat",
    discountValue: 0,
    minOrderAmount: 0,
    expiryDate: "",
    forNewUsersOnly: false,
    isActive: true,
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/offer/add", formData);
      toast.success("Offer added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      setFormData({
        code: "",
        description: "",
        discountType: "flat",
        discountValue: 0,
        minOrderAmount: 0,
        expiryDate: "",
        forNewUsersOnly: false,
        isActive: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding offer", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="add-offer-container">
      <h2>Add New Offer</h2>
      <form onSubmit={handleSubmit} className="add-offer-form">
        <label htmlFor="code">Code</label>
        <input
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Briefly describe the offer"
          rows={3}
          required
        />
        <label htmlFor="discountType">Discount Type</label>
        <select
          name="discountType"
          value={formData.discountType}
          onChange={handleChange}
        >
          <option value="flat">Flat</option>
          <option value="percentage">Percentage</option>
          <option value="delivery">Free Delivery</option>
        </select>
        {formData.discountType !== "delivery" && (
          <>
            <label htmlFor="discountValue">Discount Value</label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              required
              min={0}
            />
          </>
        )}
        <label htmlFor="minOrderAmount">Minimum Order Amount</label>
        <input
          type="number"
          name="minOrderAmount"
          value={formData.minOrderAmount}
          onChange={handleChange}
          min={0}
        />
        <label htmlFor="expiryDate">Expiry Date</label>
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="forNewUsersOnly"
            checked={formData.forNewUsersOnly}
            onChange={handleChange}
          />
          For New Users Only
        </label>
        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          Active
        </label>
        <button type="submit">Add Offer</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddOffer;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Display.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Display = ({ url }) => {
  const [display, setDisplay] = useState([]);
  const navigate = useNavigate();
  const fetchDisplay = async () => {
    try {
      const response = await axios.get(`${url}/api/food/display`);
      if (response.data.success) {
        setDisplay(response.data.data);
      } else {
        toast.error("Error fetching data");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });
      await fetchDisplay();
      if (response.data.success) {
        toast.success("Food Item Removed");
      } else {
        toast.error("Error Removing Food Item");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };
  const handleEdit = (item) => {
    navigate("/update", { state: item });
  };
  useEffect(() => {
    fetchDisplay();
  }, []);
  return (
    <div className="display add flex-col">
      <h2>Today's Temptations</h2>
      <div className="display-table">
        <div className="display-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Update</b>
          <b>Delete</b>
        </div>
        {display.map((item, index) => (
          <div key={index} className="display-table-format">
            <img src={`${url}/images/${item.image}`} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <p className="cursor edit-icon" onClick={() => handleEdit(item)}>
              ✎
            </p>
            <p
              className="cursor delete-icon"
              onClick={() => removeFood(item._id)}
            >
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Display;

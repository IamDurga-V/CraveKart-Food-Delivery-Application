import React, { useState, useEffect } from "react";
import "./Update.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
const Update = ({ url }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    id: "",
    image: "",
  });
  useEffect(() => {
    if (location.state) {
      setData({
        name: location.state.name,
        description: location.state.description,
        price: location.state.price,
        category: location.state.category,
        id: location.state._id,
        image: location.state.image,
      });
    }
  }, [location]);
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    if (image) {
      formData.append("image", image);
    } else {
      formData.append("image", data.image); // fallback
    }
    try {
      const response = await axios.post(`${url}/api/food/update`, formData);
      if (response.data.success) {
        toast.success("Food Item Updated");
        navigate("/display");
      } else {
        toast.error(response.data.message || "Error Updating");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server Error");
    }
  };
  return (
    <div className="update">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="update-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : data.image
                    ? `${url}/images/${data.image}`
                    : assets.upload_area
              }
              alt="Upload"
            />
          </label>
          <input
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
            type="file"
            id="image"
            hidden
          />
        </div>
        <div className="update-product-name flex-col">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type Here"
          />
        </div>
        <div className="update-product-description flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write Description Here"
          ></textarea>
        </div>
        <div className="update-category-price">
          <div className="update-category flex-col">
            <p>Product Category</p>
            <select
              onChange={onChangeHandler}
              name="category"
              value={data.category}
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="update-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="₹200"
            />
          </div>
        </div>
        <button type="submit" className="update-btn">
          UPDATE
        </button>
      </form>
    </div>
  );
};
export default Update;

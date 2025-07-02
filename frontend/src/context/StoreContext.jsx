import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || ""); // ✅ Added userId
  const url = "http://localhost:4000";

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: authHeader });
      } catch (error) {
        console.error("Add to cart error:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: authHeader });
      } catch (error) {
        console.error("Remove from cart error:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodDisplay = async () => {
    try {
      const response = await axios.get(`${url}/api/food/display`);
      setFoodList(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  };

  const localCartData = async () => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, { headers: authHeader });
      setCartItems(response?.data?.cartData || {});
    } catch (error) {
      console.error("Failed to load cart data:", error);
      setCartItems({});
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const decoded = jwtDecode(storedToken);
          const role = decoded.role || "User";
          const id = decoded.id || decoded.userId || decoded._id; // ✅ Adjust based on your JWT
          
          setUserRole(role);
          setUserId(id);
          
          localStorage.setItem("role", role);
          localStorage.setItem("userId", id);

          console.log("StoreContext set userRole:", role);
          console.log("StoreContext set userId:", id);

          await localCartData();
        } catch (error) {
          console.error("Token decoding error:", error);
          setToken("");
          setUserRole("User");
          setUserId("");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
        }
      } else {
        setUserRole("User");
        setUserId("");
        localStorage.setItem("role", "User");
      }
      await fetchFoodDisplay();
    };
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    userRole,
    setUserRole,
    userId, // ✅ Included userId
    setUserId,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

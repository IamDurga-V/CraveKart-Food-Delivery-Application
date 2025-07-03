import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure jwtDecode is imported

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState(""); // Initialize token as empty string

  // Initialize userRole and userId based on what is in localStorage or default
  // These will be immediately overwritten by useEffect if a valid token exists
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "User");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  // --- NEW STATE: loading ---
  // This state indicates if the initial token and data loading process is complete.
  const [loading, setLoading] = useState(true); // Starts as true, set to false after loadData completes

  // Load promo from localStorage or default to null/0
  const [appliedPromo, setAppliedPromo] = useState(() => {
    const promo = localStorage.getItem("appliedPromo");
    return promo ? JSON.parse(promo) : null;
  });
  const [discountAmount, setDiscountAmount] = useState(() => {
    const discount = localStorage.getItem("discountAmount");
    return discount ? parseInt(discount, 10) : 0;
  });

  const url = "http://localhost:4000";

  // Use a memoized authHeader to prevent unnecessary re-renders if token is the only dependency
  const authHeader = React.useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // Sync promo and discount state with localStorage whenever they change
  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem("appliedPromo", JSON.stringify(appliedPromo));
    } else {
      localStorage.removeItem("appliedPromo");
    }
  }, [appliedPromo]);

  useEffect(() => {
    if (discountAmount > 0) {
      localStorage.setItem("discountAmount", discountAmount.toString());
    } else {
      localStorage.removeItem("discountAmount");
    }
  }, [discountAmount]);

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
      setCartItems({}); // Clear cart if loading fails
    }
  };

  const calculatePromoDiscount = (promo, orderAmount) => {
    if (!promo || !promo.discountType || !promo.discountValue) return 0;
    if (promo.discountType === "delivery") return 200; // Assuming fixed delivery discount
    if (promo.discountType === "flat") return promo.discountValue;
    if (promo.discountType === "percentage") return Math.round((promo.discountValue / 100) * orderAmount);
    return 0;
  };

  const clearPromo = () => {
    setAppliedPromo(null);
    setDiscountAmount(0);
    localStorage.removeItem("appliedPromo");
    localStorage.removeItem("discountAmount");
  };

  // Main effect to load initial data and handle token changes
  useEffect(() => {
    const loadData = async () => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken || ""); // Update token state, ensuring it's never 'null'

      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          const role = decoded.role || "User";
          const id = decoded.id || decoded.userId || decoded._id; // Handle different potential ID fields

          setUserRole(role); // Set userRole in state
          setUserId(id);     // Set userId in state

          // Also ensure localStorage reflects these, especially if the token was just set
          localStorage.setItem("role", role);
          localStorage.setItem("userId", id);

          console.log("StoreContext useEffect: Set userRole:", role, "userId:", id);

          await localCartData(); // Fetch cart data if user is logged in
        } catch (error) {
          console.error("StoreContext useEffect: Token decoding error or invalid token:", error);
          // If token is invalid or decoding fails, clear all auth states
          setToken("");
          setUserRole("User"); // Set default role
          setUserId("");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          setCartItems({}); // Clear cart for invalid/expired tokens
        }
      } else {
        // If no token, ensure role is "User" and userId is empty
        setUserRole("User");
        setUserId("");
        localStorage.removeItem("role"); // Ensure role is removed if no token
        localStorage.removeItem("userId"); // Ensure userId is removed if no token
        setCartItems({}); // Clear cart if not logged in
      }
      await fetchFoodDisplay(); // Always fetch food list
      setLoading(false); // Set loading to false once all initial data is loaded
    };

    loadData();
  }, [token]); // Re-run this effect whenever the `token` state changes

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
    userId,
    setUserId,
    appliedPromo,
    setAppliedPromo,
    discountAmount,
    setDiscountAmount,
    calculatePromoDiscount,
    clearPromo,
    loading, // Expose the loading state
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
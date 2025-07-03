import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
export const StoreContext = createContext(null);
const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState(
    localStorage.getItem("role") || "User",
  );
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [loading, setLoading] = useState(true);
  const [appliedPromo, setAppliedPromo] = useState(() => {
    const promo = localStorage.getItem("appliedPromo");
    return promo ? JSON.parse(promo) : null;
  });
  const [discountAmount, setDiscountAmount] = useState(() => {
    const discount = localStorage.getItem("discountAmount");
    return discount ? parseInt(discount, 10) : 0;
  });
  const url = "http://localhost:4000";
  const authHeader = React.useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);
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
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: authHeader },
        );
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
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: authHeader },
        );
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
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: authHeader },
      );
      setCartItems(response?.data?.cartData || {});
    } catch (error) {
      console.error("Failed to load cart data:", error);
      setCartItems({});
    }
  };

  const calculatePromoDiscount = (promo, orderAmount) => {
    if (!promo || !promo.discountType || !promo.discountValue) return 0;
    if (promo.discountType === "delivery") return 200;
    if (promo.discountType === "flat") return promo.discountValue;
    if (promo.discountType === "percentage")
      return Math.round((promo.discountValue / 100) * orderAmount);
    return 0;
  };

  const clearPromo = () => {
    setAppliedPromo(null);
    setDiscountAmount(0);
    localStorage.removeItem("appliedPromo");
    localStorage.removeItem("discountAmount");
  };

  useEffect(() => {
    const loadData = async () => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken || "");
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          const role = decoded.role || "User";
          const id = decoded.id || decoded.userId || decoded._id;
          setUserRole(role);
          setUserId(id);
          localStorage.setItem("role", role);
          localStorage.setItem("userId", id);
          await localCartData();
        } catch (error) {
          setToken("");
          setUserRole("User");
          setUserId("");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          setCartItems({});
        }
      } else {
        setUserRole("User");
        setUserId("");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        setCartItems({});
      }
      await fetchFoodDisplay();
      setLoading(false);
    };
    loadData();
  }, [token]);
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
    loading,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;

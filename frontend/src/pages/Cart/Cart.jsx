import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    userId,
    appliedPromo,
    setAppliedPromo,
    discountAmount,
    setDiscountAmount,
    clearPromo,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [applying, setApplying] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) {
      setPromoMessage("Please enter a promo code.");
      return;
    }

    setApplying(true);
    setPromoMessage("");

    try {
      const subtotal = getTotalCartAmount();
      const deliveryFee = subtotal === 0 ? 0 : 200;
      const orderAmount = subtotal + deliveryFee;

      const response = await axios.post(
        `${url}/api/offer/validate`,
        {
          code: promoCodeInput.trim(),
          orderAmount,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Assuming backend sends discountAmount and promo object
        const promo = response.data.promo || { code: promoCodeInput.trim() };
        const discount = response.data.discountAmount || 0;

        setAppliedPromo(promo);
        setDiscountAmount(discount);
        setPromoMessage(`Promo applied! You saved ₹${discount}`);
      } else {
        setAppliedPromo(null);
        setDiscountAmount(0);
        setPromoMessage(response.data.message || "Invalid promo code.");
      }
    } catch (error) {
      setAppliedPromo(null);
      setDiscountAmount(0);
      setPromoMessage(
        error.response?.data?.message || "Failed to apply promo code."
      );
    }

    setApplying(false);
  };

  const handleRemovePromo = () => {
    setPromoCodeInput("");
    clearPromo();
    setPromoMessage("");
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 200;
  const totalBeforeDiscount = subtotal + deliveryFee;
  const totalAfterDiscount = Math.max(totalBeforeDiscount - discountAmount, 0);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p
                    onClick={() => removeFromCart(item._id)}
                    className="cross"
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{totalBeforeDiscount}</b>
            </div>
            {discountAmount > 0 && (
              <>
                <hr />
                <div className="cart-total-details">
                  <p>Discount ({appliedPromo?.code || ""})</p>
                  <p>-₹{discountAmount}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <b>Payable Amount</b>
                  <b>₹{totalAfterDiscount}</b>
                </div>
              </>
            )}
            <hr />
          </div>
          <button onClick={() => navigate("/placeorder")}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                disabled={appliedPromo !== null}
              />
              {!appliedPromo ? (
                <button
                  onClick={handleApplyPromo}
                  disabled={applying || !promoCodeInput.trim()}
                >
                  {applying ? "Applying..." : "Submit"}
                </button>
              ) : (
                <button onClick={handleRemovePromo}>Remove</button>
              )}
            </div>
            {promoMessage && <p className="promo-message">{promoMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

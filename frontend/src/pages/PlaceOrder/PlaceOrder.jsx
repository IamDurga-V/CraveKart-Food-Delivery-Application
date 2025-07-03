import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    discountAmount,
    appliedPromo,
    setDiscountAmount,  // Added for clearing promo
    setAppliedPromo,    // Added for clearing promo
    setCartItems,       // Added for clearing cart
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    const subtotal = getTotalCartAmount();
    if (subtotal === 0) {
      console.warn("Cart is empty! Cannot proceed to payment.");
      return;
    }

    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        });
      }
    });

    const address = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      street: data.street,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode,
      country: data.country,
      phone: data.phone,
    };

    const deliveryFee = subtotal === 0 ? 0 : 200;
    const totalAmountBeforeDiscount = subtotal + deliveryFee;
    const payableAmount = Math.max(totalAmountBeforeDiscount - discountAmount, 0);

    const orderData = {
      address,
      items: orderItems,
      amount: payableAmount,
      promoCode: appliedPromo?.code || null,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Clear promo and cart state on successful order creation
        setDiscountAmount(0);
        setAppliedPromo(null);
        setCartItems({});

        const { razorpayOrderId, amount, currency, orderId } = response.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount,
          currency: currency,
          name: "CraveKart",
          description: "Order Payment",
          order_id: razorpayOrderId,
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: "#1A73E8",
          },
          handler: function (response) {
            window.location.href = `/verify?success=true&orderId=${orderId}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`;
          },
        };

        const rzp = new window.Razorpay(options);
        let paymentProcessed = false;

        rzp.on("payment.failed", function (response) {
          paymentProcessed = true;
          window.location.href = `/verify?success=false&orderId=${orderId}&payment_id=${response.error.metadata.payment_id}`;
        });

        rzp.on("modal.close", function () {
          if (!paymentProcessed) {
            window.location.href = `/verify?success=false&orderId=${orderId}&reason=closed`;
          }
        });

        rzp.open();

        setTimeout(() => {
          if (!paymentProcessed && rzp.isOpen()) {
            rzp.close();
            window.location.href = `/verify?success=false&orderId=${orderId}&reason=timeout`;
          }
        }, 60000);
      } else {
        window.location.href = `/verify?success=false`;
      }
    } catch (error) {
      console.error("PlaceOrder Error:", error);
      window.location.href = `/verify?success=false`;
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 200;
  const totalBeforeDiscount = subtotal + deliveryFee;
  const totalAfterDiscount = Math.max(totalBeforeDiscount - discountAmount, 0);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last Name"
            required
          />
        </div>
        <input
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="email"
          placeholder="Email Address"
          required
        />
        <input
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Street"
          required
        />
        <div className="multi-fields">
          <input
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City"
            required
          />
          <input
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="State"
            required
          />
        </div>
        <div className="multi-fields">
          <input
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            type="text"
            placeholder="Zip Code"
            required
          />
          <input
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="Country"
            required
          />
        </div>
        <input
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="text"
          placeholder="Phone Number"
          required
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
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
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

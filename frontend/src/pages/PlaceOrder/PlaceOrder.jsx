import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate(); // Initialize useNavigate

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

    if (getTotalCartAmount() === 0) {
      console.warn("Cart is empty! Cannot proceed to payment.");
      // In a real app, show a user-friendly message here.
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

    const orderData = {
      address: address,
      items: orderItems,
      amount: getTotalCartAmount() + 200, // Assuming 200 is delivery fee
    };

    console.log("PlaceOrder: Initiating order placement process.");
    console.log("PlaceOrder: URL for backend API:", url);
    console.log("PlaceOrder: Order Data being sent:", orderData);

    try {
      // Step 1: Send order data to your backend to create a Razorpay Order
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      console.log("PlaceOrder: Backend response for /api/order/place:", response.data);

      if (response.data.success) {
        const { razorpayOrderId, amount, currency, orderId } = response.data;

        // Step 2: Open Razorpay checkout with data from backend
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
            console.log("Razorpay handler (Success) called. Response:", response);
            window.location.href = `/verify?success=true&orderId=${orderId}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`;
          },
        };

        console.log("PlaceOrder: Initializing Razorpay checkout with options:", options);
        const rzp = new window.Razorpay(options);

        let paymentProcessed = false; // Flag to track if any Razorpay event fired

        rzp.on('payment.failed', function (response) {
            console.error("Razorpay payment failed event:", response);
            paymentProcessed = true; // Mark as processed
            window.location.href = `/verify?success=false&orderId=${orderId}&payment_id=${response.error.metadata.payment_id}`;
        });

        rzp.on('modal.close', function () {
            console.log("Razorpay modal closed event.");
            // Only redirect if payment wasn't already processed (success or explicit failure)
            if (!paymentProcessed) {
                console.log("Redirecting due to modal closure without explicit payment status.");
                window.location.href = `/verify?success=false&orderId=${orderId}&reason=closed`;
            } else {
                console.log("Modal closed, but payment status already handled.");
            }
        });

        rzp.open();

        // Add a timeout to force redirect if no Razorpay event fires within a set time
        // This handles cases where the modal gets stuck or doesn't provide a clear callback
        setTimeout(() => {
            if (!paymentProcessed && rzp.isOpen()) {
                console.warn("Razorpay modal stuck or unresponsive. Forcing redirection to failure page.");
                rzp.close(); // Attempt to close the stuck modal
                window.location.href = `/verify?success=false&orderId=${orderId}&reason=timeout`;
            }
        }, 60000); // 60 seconds (adjust as needed, give enough time for payment flow)


      } else {
        // If the backend's /api/order/place call returns success: false
        console.error("PlaceOrder: Backend /api/order/place returned success: false. Redirecting to failed verification.");
        window.location.href = `/verify?success=false`;
      }
    } catch (error) {
      // This catches network errors, CORS issues, or unhandled errors from the backend /api/order/place call
      console.error("PlaceOrder: Error during /api/order/place API call:", error);
      window.location.href = `/verify?success=false`;
    }
  };
  
  // Guard useEffect to ensure user is logged in and cart is not empty
  useEffect(()=>{
    if(!token){
      console.log("PlaceOrder useEffect: No token found, redirecting to /cart.");
      navigate('/cart');
    }
    // Only check cart amount if token exists. If cart is empty, redirect.
    else if(getTotalCartAmount()===0)
    {
      console.log("PlaceOrder useEffect: Cart is empty, redirecting to /cart.");
      navigate('/cart');
    }
  },[token, getTotalCartAmount, navigate]); // Add navigate to dependencies

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input name="firstName" value={data.firstName} onChange={onChangeHandler} type="text" placeholder="First Name" required />
          <input name="lastName" value={data.lastName} onChange={onChangeHandler} type="text" placeholder="Last Name" required />
        </div>
        <input name="email" value={data.email} onChange={onChangeHandler} type="email" placeholder="Email Address" required />
        <input name="street" value={data.street} onChange={onChangeHandler} type="text" placeholder="Street" required />
        <div className="multi-fields">
          <input name="city" value={data.city} onChange={onChangeHandler} type="text" placeholder="City" required />
          <input name="state" value={data.state} onChange={onChangeHandler} type="text" placeholder="State" required />
        </div>
        <div className="multi-fields">
          <input name="zipcode" value={data.zipcode} onChange={onChangeHandler} type="text" placeholder="Zip Code" required />
          <input name="country" value={data.country} onChange={onChangeHandler} type="text" placeholder="Country" required />
        </div>
        <input name="phone" value={data.phone} onChange={onChangeHandler} type="text" placeholder="Phone Number" required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 200}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 200}</b>
            </div>
            <hr />
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

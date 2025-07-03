import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./Verify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success") === "true";
  const orderId = searchParams.get("orderId");
  const razorpay_payment_id = searchParams.get("razorpay_payment_id");
  const razorpay_order_id = searchParams.get("razorpay_order_id");
  const razorpay_signature = searchParams.get("razorpay_signature");
  const reason = searchParams.get("reason");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(null);
  useEffect(() => {
    console.log("Verify component loaded with URL parameters:");
    console.log("success:", success);
    console.log("orderId:", orderId);
    console.log("razorpay_payment_id:", razorpay_payment_id);
    console.log("razorpay_order_id:", razorpay_order_id);
    console.log("razorpay_signature:", razorpay_signature);
    console.log("reason:", reason);
  }, [
    success,
    orderId,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    reason,
  ]);
  const verifyPayment = async () => {
    console.log("Attempting to verify payment with backend...");
    try {
      const response = await axios.post(`${url}/api/order/verify`, {
        orderId,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        frontend_success_flag: success,
        failure_reason: reason,
      });
      if (response.data.success) {
        setVerified(true);
        setTimeout(() => navigate("/myorders"), 3000);
      } else {
        setVerified(false);
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (error) {
      setVerified(false);
      setTimeout(() => navigate("/"), 3000);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      setVerified(false);
      setLoading(false);
      setTimeout(() => navigate("/"), 3000);
    }
  }, [
    orderId,
    url,
    navigate,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    success,
    reason,
  ]);
  return (
    <div className="verify-page">
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Verifying payment...</p>
        </div>
      ) : verified ? (
        <div className="success-message">
          <h1>Payment Successful!</h1>
          <p>
            <b>Order ID:</b> {orderId}
          </p>
          <p>
            <b>Payment ID:</b> {razorpay_payment_id}
          </p>
          <p>Your food is on its way! Redirecting to orders...</p>
        </div>
      ) : (
        <div className="error-message">
          <h1>Payment Failed</h1>
          <p>Something went wrong. Redirecting to home...</p>
          {reason && <p>Reason: {reason.replace(/%20/g, " ")}</p>}
        </div>
      )}
    </div>
  );
};

export default Verify;

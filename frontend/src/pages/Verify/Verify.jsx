import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./Verify.css"; // Ensure you have a CSS file for styling the spinner and messages

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success") === "true"; // This is from our redirect, not Razorpay's direct success
  const orderId = searchParams.get("orderId");
  // Get all Razorpay-specific parameters from the URL
  const razorpay_payment_id = searchParams.get("razorpay_payment_id");
  const razorpay_order_id = searchParams.get("razorpay_order_id");
  const razorpay_signature = searchParams.get("razorpay_signature");
  // Optional parameters passed for specific failure reasons (e.g., from modal.close or timeout)
  const reason = searchParams.get("reason"); 

  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(null); // null: initial, true: success, false: failed

  // Log all incoming URL parameters for debugging
  useEffect(() => {
    console.log("Verify component loaded with URL parameters:");
    console.log("success:", success);
    console.log("orderId:", orderId);
    console.log("razorpay_payment_id:", razorpay_payment_id);
    console.log("razorpay_order_id:", razorpay_order_id);
    console.log("razorpay_signature:", razorpay_signature);
    console.log("reason:", reason); // Log the new 'reason' parameter
  }, [success, orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature, reason]);


  const verifyPayment = async () => {
    console.log("Attempting to verify payment with backend...");
    try {
      // Send all relevant parameters to the backend for verification.
      // For failed payments, razorpay_order_id and razorpay_signature might be null/undefined.
      // The backend's verifyOrder function will handle the missing parameters.
      const response = await axios.post(`${url}/api/order/verify`, {
        orderId,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        // Potentially send the success flag as well, though backend uses signature for truth
        frontend_success_flag: success, // New flag for backend awareness
        failure_reason: reason // New parameter for backend awareness
      });

      if (response.data.success) {
        console.log("Backend verification successful. Setting verified to true.");
        setVerified(true);
        console.log("Attempting to redirect to /myorders in 3 seconds.");
        setTimeout(() => navigate("/myorders"), 3000); // redirect after 3 sec
      } else {
        console.log("Backend verification failed. Setting verified to false.");
        setVerified(false);
        console.log("Attempting to redirect to / in 3 seconds.");
        setTimeout(() => navigate("/"), 3000); // redirect to home
      }
    } catch (error) {
      console.error("Verification Error during API call:", error);
      setVerified(false);
      console.log("Attempting to redirect to / in 3 seconds due to API error.");
      setTimeout(() => navigate("/"), 3000);
    } finally {
      setLoading(false);
      console.log("Loading state set to false.");
    }
  };

  useEffect(() => {
    // Always attempt to verify with the backend if an orderId is present.
    // The backend will determine success/failure and handle database updates.
    if (orderId) {
      console.log("useEffect: orderId is present. Calling verifyPayment().");
      verifyPayment();
    } else {
      // This case handles direct navigation to /verify without an orderId
      console.warn("Verify page accessed without orderId. Redirecting to home.");
      setVerified(false);
      setLoading(false);
      setTimeout(() => navigate("/"), 3000);
    }
  }, [orderId, url, navigate, razorpay_payment_id, razorpay_order_id, razorpay_signature, success, reason]); // Add all relevant dependencies

  return (
    <div className="verify-page">
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div> {/* Add CSS for .spinner */}
          <p>Verifying payment...</p>
        </div>
      ) : verified ? (
        <div className="success-message">
          <h1>Payment Successful!</h1>
          <p><b>Order ID:</b> {orderId}</p>
          <p><b>Payment ID:</b> {razorpay_payment_id}</p>
          <p>Your food is on its way! Redirecting to orders...</p>
        </div>
      ) : (
        <div className="error-message">
          <h1>Payment Failed</h1>
          <p>Something went wrong. Redirecting to home...</p>
          {reason && <p>Reason: {reason.replace(/%20/g, ' ')}</p>} {/* Display reason if available */}
        </div>
      )}
    </div>
  );
};

export default Verify;

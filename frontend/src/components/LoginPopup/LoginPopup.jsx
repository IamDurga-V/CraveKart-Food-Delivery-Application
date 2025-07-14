import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, setUserRole, setUserId } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [otpState, setOtpState] = useState(""); // State for OTP verification
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
    otp: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    if (name === "otp" && !/^\d{0,6}$/.test(value)) {
      return; // Allow only 6 digits for OTP
    }
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;

    if (currState === "Login") {
      newUrl += "/api/user/login";
      try {
        const response = await axios.post(newUrl, {
          email: data.email,
          password: data.password,
          role: data.role,
        });
        if (response.data.success) {
          const receivedToken = response.data.token;
          setToken(receivedToken);
          localStorage.setItem("token", receivedToken);
          try {
            const decoded = jwtDecode(receivedToken);
            const role = decoded.role || "User";
            const id = decoded.id || decoded.userId || decoded._id;
            setUserRole(role);
            setUserId(id);
            localStorage.setItem("role", role);
            localStorage.setItem("userId", id);
            setShowLogin(false);
            toast.success("Logged in successfully");
          } catch (decodeError) {
            setToken("");
            setUserRole("User");
            setUserId("");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            toast.error("Authentication successful but token could not be processed. Please try again.");
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Login error: " + error.message);
        console.error("Login Error:", error);
      }
    } else if (currState === "Sign Up") {
      if (otpState === "") {
        newUrl += "/api/user/register";
        try {
          const response = await axios.post(newUrl, {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
          });
          if (response.data.success) {
            setOtpState("request");
            toast.success("Registration successful. Please request OTP.");
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("Registration error: " + error.message);
          console.error("Registration Error:", error);
        }
      } else if (otpState === "request") {
        newUrl += "/api/user/request-otp";
        try {
          const response = await axios.post(newUrl, { email: data.email });
          if (response.data.success) {
            setOtpState("verify");
            toast.success("OTP sent to your email");
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("OTP request error: " + error.message);
          console.error("OTP Request Error:", error);
        }
      } else if (otpState === "verify") {
        newUrl += "/api/user/verify-otp";
        try {
          const response = await axios.post(newUrl, {
            email: data.email,
            otp: data.otp,
          });
          if (response.data.success) {
            setCurrState("Login");
            setOtpState("");
            setData((prev) => ({ ...prev, name: "", otp: "", password: "" }));
            toast.success("OTP verified successfully. Please login.");
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("OTP verification error: " + error.message);
          console.error("OTP Verification Error:", error);
        }
      }
    } else if (currState === "Forgot Password") {
      if (otpState === "") {
        newUrl += "/api/user/request-otp";
        try {
          const response = await axios.post(newUrl, { email: data.email });
          if (response.data.success) {
            setOtpState("verify");
            toast.success("OTP sent to your email");
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("OTP request error: " + error.message);
          console.error("OTP Request Error:", error);
        }
      } else if (otpState === "verify") {
        newUrl += "/api/user/reset-password";
        try {
          const response = await axios.post(newUrl, {
            email: data.email,
            password: data.password,
            otp: data.otp,
          });
          if (response.data.success) {
            setCurrState("Login");
            setOtpState("");
            setData((prev) => ({ ...prev, password: "", otp: "" }));
            toast.success("Password reset successful. Please login.");
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("Password reset error: " + error.message);
          console.error("Password Reset Error:", error);
        }
      }
    }
  };

  return (
    <div className="login-popup">
      <div className="login-popup-container">
        <div className="login-popup-left">
          <div className="illustration-container">
            <img
              src={assets.login_illustration}
              alt="Login Illustration"
              className="illustration"
            />
            <h2>Welcome to CraveKart</h2>
            <p>Sign In or Create an account to continue your journey!</p>
          </div>
        </div>
        <div className="login-popup-right">
          <form onSubmit={onLogin} className="login-popup-form">
            <div className="login-popup-title">
              <h2>{currState}</h2>
              <img
                onClick={() => setShowLogin(false)}
                src={assets.cross_icon}
                alt="Close"
                className="close-icon"
              />
            </div>
            <div className="login-popup-inputs">
              {currState === "Sign Up" && otpState === "" && (
                <input
                  name="name"
                  onChange={onChangeHandler}
                  value={data.name}
                  type="text"
                  placeholder="Your Name"
                  required
                />
              )}
              <input
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                type="email"
                placeholder="Your Email"
                required
              />
              {(currState === "Login" || (currState === "Sign Up" && otpState === "") || (currState === "Forgot Password" && otpState === "verify")) && (
                <input
                  name="password"
                  onChange={onChangeHandler}
                  value={data.password}
                  type="password"
                  placeholder={currState === "Forgot Password" ? "New Password" : "Your Password"}
                  required
                />
              )}
              {(currState === "Sign Up" || currState === "Login") && otpState === "" && (
                <select
                  name="role"
                  onChange={onChangeHandler}
                  value={data.role}
                  className="role-select"
                  required
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              )}
              {(currState === "Sign Up" || currState === "Forgot Password") && otpState === "verify" && (
                <input
                  name="otp"
                  onChange={onChangeHandler}
                  value={data.otp}
                  type="text"
                  placeholder="Enter OTP"
                  required
                />
              )}
            </div>
            <button type="submit">
              {currState === "Sign Up"
                ? otpState === "verify"
                  ? "Verify OTP"
                  : otpState === "request"
                  ? "Request OTP"
                  : "Create Account"
                : currState === "Forgot Password"
                ? otpState === "verify"
                  ? "Reset Password"
                  : "Send OTP"
                : "Login"}
            </button>
            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>
            {currState === "Sign Up" && (
              <p>
                Already have an account?{" "}
                <span onClick={() => { setCurrState("Login"); setOtpState(""); }}>
                  Login Here
                </span>
              </p>
            )}
            {currState === "Login" && (
              <>
                <p>
                  Create a new account?{" "}
                  <span onClick={() => { setCurrState("Sign Up"); setOtpState(""); }}>
                    Click here
                  </span>
                </p>
                <p>
                  Forgot Password?{" "}
                  <span onClick={() => { setCurrState("Forgot Password"); setOtpState(""); }}>
                    Reset here
                  </span>
                </p>
              </>
            )}
            {currState === "Forgot Password" && (
              <p>
                Back to login?{" "}
                <span onClick={() => { setCurrState("Login"); setOtpState(""); }}>
                  Login Here
                </span>
              </p>
            )}
            {(otpState === "verify" || otpState === "request") && (
              <button
                type="button"
                onClick={() => onLogin({ preventDefault: () => {} })}
                className="resend-otp-button"
              >
                Resend OTP
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
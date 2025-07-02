import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User", // Default role
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }
    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-popup">
      <div className="login-popup-container">
        {/* Left Side - Illustration */}
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
        {/* Right Side - Form */}
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
              {currState === "Sign Up" && (
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
              <input
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                type="password"
                placeholder="Your Password"
                required
              />
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
            </div>
            <button type="submit">
              {currState === "Sign Up" ? "Create Account" : "Login"}
            </button>
            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>
                By continuing, I agree to the terms of use & privacy policy.
              </p>
            </div>
            {currState === "Sign Up" ? (
              <p>
                Already have an account?{" "}
                <span onClick={() => setCurrState("Login")}>Login Here</span>
              </p>
            ) : (
              <p>
                Create a new account?{" "}
                <span onClick={() => setCurrState("Sign Up")}>Click here</span>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
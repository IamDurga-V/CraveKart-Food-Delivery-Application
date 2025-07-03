import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, setUserRole, setUserId } = useContext(StoreContext); // Destructure setUserId

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
    event.preventDefault(); // Prevent default form submission behavior

    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        const receivedToken = response.data.token;
        setToken(receivedToken); // Update token state in context

        // Store token in localStorage
        localStorage.setItem("token", receivedToken);

        // --- Crucial Fix: Decode token and set userRole/userId immediately ---
        try {
          const decoded = jwtDecode(receivedToken);
          const role = decoded.role || "User"; // Get role from decoded token, default to 'User'
          const id = decoded.id || decoded.userId || decoded._id; // Get ID from decoded token

          setUserRole(role); // Update userRole state in context
          setUserId(id);     // Update userId state in context

          // Store role and userId in localStorage for persistence across refreshes
          localStorage.setItem("role", role);
          localStorage.setItem("userId", id);

          console.log("LoginPopup: Successfully set userRole:", role, "userId:", id);

        } catch (decodeError) {
          console.error("LoginPopup: Token decoding error after successful auth:", decodeError);
          // If token decoding fails (e.g., malformed token), treat as unauthenticated
          setToken("");
          setUserRole("User");
          setUserId("");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          alert("Authentication successful but token could not be processed. Please try again.");
        }
        // --- End Crucial Fix ---

        setShowLogin(false); // Close the login popup
      } else {
        alert(response.data.message); // Show error message from backend
      }
    } catch (error) {
      alert("An error occurred during authentication. Please try again.");
      console.error("Authentication Error:", error);
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
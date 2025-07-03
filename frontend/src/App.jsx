// App.js
import React, { useState, useEffect, useContext } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "./context/StoreContext";

// Admin components
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Display from "./pages/Display/Display";
import Orders from "./pages/Orders/Orders";
import Add from "./pages/Add/Add";
import Update from "./pages/Update/Update";
import Home from "./pages/Home/Home";
import AddOffer from "./pages/AddOffer/AddOffer";
import ManageOffer from "./pages/ManageOffer/ManageOffer";

// User components
import UserNavbar from "./components/UserNavbar/UserNavbar";
import Footer from "./components/Footer/Footer";
import AppDownload from "./components/AppDownload/AppDownload";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import UserHome from "./pages/UserHome/UserHome";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Verify from "./pages/Verify/Verify";
import MyOrder from "./pages/MyOrders/MyOrder";

// Common
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // --- NEW: Destructure `loading` from context ---
  const { userRole, setUserRole, token, url, loading } = useContext(StoreContext);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("App useEffect - userRole:", userRole, "token:", !!token, "path:", location.pathname, "loading:", loading);

    // --- NEW: Only run redirection logic AFTER loading is false ---
    if (!loading) {
      if (token) {
        const isAdminRoute =
          location.pathname.startsWith("/admin") ||
          location.pathname.startsWith("/add") ||
          location.pathname.startsWith("/update") ||
          location.pathname.startsWith("/display") ||
          location.pathname.startsWith("/orders") ||
          location.pathname.startsWith("/add-offer") ||
          location.pathname.startsWith("/manage-offers");

        // Consider adding a root admin path check
        const isRootAdminPath = location.pathname === "/admin";

        // Admin logic
        if (userRole === "Admin") {
          // If admin is on a user route, redirect to admin home
          if (!isAdminRoute && !isRootAdminPath) { // Check if it's not an admin route or the root admin path
            console.log("Redirecting Admin to /admin");
            navigate("/admin");
          }
          // If admin is on admin route, stay there
        }
        // User logic
        else if (userRole === "User") {
          // If user is on an admin route, redirect to user home
          if (isAdminRoute || isRootAdminPath) { // Check if it's an admin route or the root admin path
            console.log("Redirecting User to /");
            navigate("/");
          }
          // If user is on user route, stay there
        }
      } else {
        // No token, user is not logged in
        // If current path is NOT the home page, show login and redirect to home
        if (location.pathname !== "/") {
          console.log("No token, showing login and redirecting to /");
          setShowLogin(true);
          navigate("/");
        } else {
            // If on home page and no token, just ensure login popup can be shown if needed
            setShowLogin(false); // Ensure it's not shown automatically on `/`
        }
      }
    }
    // Dependency array: token, userRole, location.pathname, navigate, setShowLogin, loading
    // Make sure all relevant states are in the dependency array
  }, [token, userRole, location.pathname, navigate, setShowLogin, loading]); // <<< Added `loading` here

  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/add") ||
    location.pathname.startsWith("/update") ||
    location.pathname.startsWith("/display") ||
    location.pathname.startsWith("/orders") ||
    location.pathname.startsWith("/add-offer") ||
    location.pathname.startsWith("/manage-offers");

  // --- NEW: Render a loading indicator or null while authentication is being checked ---
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>
        Loading Application...
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      {/* Conditional rendering for Admin vs. User Layout */}
      {isAdminRoute && userRole === "Admin" ? (
        // Admin Layout
        <div>
          <Navbar />
          <hr />
          <div className="app-content">
            <Sidebar />
            <Routes>
              {/* Only allow /admin path if userRole is Admin */}
              <Route path="/admin" element={<Home url={url} />} />
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/update" element={<Update url={url} />} />
              <Route path="/display" element={<Display url={url} />} />
              <Route path="/orders" element={<Orders url={url} />} />
              <Route path="/add-offer" element={<AddOffer url={url} />} />
              <Route path="/manage-offers" element={<ManageOffer url={url} />} />
              {/* Fallback for admin if they try to access non-existent admin sub-route */}
              <Route path="*" element={<Home url={url} />} /> {/* Redirect to admin home */}
            </Routes>
          </div>
        </div>
      ) : (
        // User Layout (or Unauthenticated Layout)
        <div className="app">
          <UserNavbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path="/" element={<UserHome url={url} />} />
            <Route path="/cart" element={<Cart url={url} />} />
            <Route path="/placeorder" element={<PlaceOrder url={url} />} />
            <Route path="/verify" element={<Verify url={url} />} />
            <Route path="/myorders" element={<MyOrder url={url} />} />
            {/* Fallback for user if they try to access non-existent user sub-route 
                or if admin tries to access a user route and gets redirected */}
            <Route path="*" element={<UserHome url={url} />} /> {/* Redirect to user home */}

            {/* If user is not authenticated and tries to access a protected route, 
                they will be redirected to "/" by the useEffect above. 
                The LoginPopup will then appear only if setShowLogin(true) is called. */}
          </Routes>
          <AppDownload />
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;
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
  const { userRole, setUserRole, token, url } = useContext(StoreContext);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("App useEffect - userRole:", userRole, "token:", !!token, "path:", location.pathname);
    if (token) {
      const isAdminRoute = location.pathname.startsWith("/admin") ||
                           location.pathname.startsWith("/add") ||
                           location.pathname.startsWith("/update") ||
                           location.pathname.startsWith("/display") ||
                           location.pathname.startsWith("/orders") ||
                           location.pathname.startsWith("/add-offer") ||
                           location.pathname.startsWith("/manage-offers");

      const isUserRoute = location.pathname === "/" ||
                          location.pathname.startsWith("/cart") ||
                          location.pathname.startsWith("/placeorder") ||
                          location.pathname.startsWith("/verify") ||
                          location.pathname.startsWith("/myorders");

      if (userRole === "Admin" && !isAdminRoute) {
        console.log("Redirecting Admin to /admin");
        navigate("/admin");
      } else if (userRole === "User" && isAdminRoute) {
        console.log("Redirecting User to /");
        navigate("/");
      }
    } else {
      if (location.pathname !== "/") {
        console.log("No token, showing login and redirecting to /");
        setShowLogin(true);
        navigate("/");
      }
    }
  }, [token, userRole, location.pathname, navigate, setShowLogin]);

  const isAdminRoute = location.pathname.startsWith("/admin") ||
                       location.pathname.startsWith("/add") ||
                       location.pathname.startsWith("/update") ||
                       location.pathname.startsWith("/display") ||
                       location.pathname.startsWith("/orders") ||
                       location.pathname.startsWith("/add-offer") ||
                       location.pathname.startsWith("/manage-offers");

  return (
    <>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      {isAdminRoute && userRole === "Admin" ? (
        // Admin Layout
        <div>
          <Navbar />
          <hr />
          <div className="app-content">
            <Sidebar />
            <Routes>
              <Route path="/admin" element={<Home url={url} />} />
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/update" element={<Update url={url} />} />
              <Route path="/display" element={<Display url={url} />} />
              <Route path="/orders" element={<Orders url={url} />} />
              <Route path="/add-offer" element={<AddOffer url={url} />} />
              <Route path="/manage-offers" element={<ManageOffer url={url} />} />
            </Routes>
          </div>
        </div>
      ) : (
        // User Layout
        <div className="app">
          <UserNavbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path="/" element={<UserHome url={url} />} />
            <Route path="/cart" element={<Cart url={url} />} />
            <Route path="/placeorder" element={<PlaceOrder url={url} />} />
            <Route path="/verify" element={<Verify url={url} />} />
            <Route path="/myorders" element={<MyOrder url={url} />} />
          </Routes>
          <AppDownload />
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;

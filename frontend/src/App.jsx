import React, { useState, useEffect, useContext } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "./context/StoreContext";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Display from "./pages/Display/Display";
import Orders from "./pages/Orders/Orders";
import Add from "./pages/Add/Add";
import Update from "./pages/Update/Update";
import Home from "./pages/Home/Home";
import AddOffer from "./pages/AddOffer/AddOffer";
import ManageOffer from "./pages/ManageOffer/ManageOffer";
import UserNavbar from "./components/UserNavbar/UserNavbar";
import Footer from "./components/Footer/Footer";
import AppDownload from "./components/AppDownload/AppDownload";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import UserHome from "./pages/UserHome/UserHome";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Verify from "./pages/Verify/Verify";
import MyOrder from "./pages/MyOrders/MyOrder";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { userRole, setUserRole, token, url, loading } =
    useContext(StoreContext);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(
      "App useEffect - userRole:",
      userRole,
      "token:",
      !!token,
      "path:",
      location.pathname,
      "loading:",
      loading,
    );
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
        const isRootAdminPath = location.pathname === "/admin";
        if (userRole === "Admin") {
          if (!isAdminRoute && !isRootAdminPath) {
            navigate("/admin");
          }
        } else if (userRole === "User") {
          if (isAdminRoute || isRootAdminPath) {
            navigate("/");
          }
        }
      } else {
        if (location.pathname !== "/") {
          setShowLogin(true);
          navigate("/");
        } else {
          setShowLogin(false);
        }
      }
    }
  }, [token, userRole, location.pathname, navigate, setShowLogin, loading]);
  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/add") ||
    location.pathname.startsWith("/update") ||
    location.pathname.startsWith("/display") ||
    location.pathname.startsWith("/orders") ||
    location.pathname.startsWith("/add-offer") ||
    location.pathname.startsWith("/manage-offers");
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "24px",
        }}
      >
        Loading Application...
      </div>
    );
  }
  return (
    <>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      {isAdminRoute && userRole === "Admin" ? (
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
              <Route
                path="/manage-offers"
                element={<ManageOffer url={url} />}
              />
              <Route path="*" element={<Home url={url} />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="app">
          <UserNavbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path="/" element={<UserHome url={url} />} />
            <Route path="/cart" element={<Cart url={url} />} />
            <Route path="/placeorder" element={<PlaceOrder url={url} />} />
            <Route path="/verify" element={<Verify url={url} />} />
            <Route path="/myorders" element={<MyOrder url={url} />} />
            <Route path="*" element={<UserHome url={url} />} />
          </Routes>
          <AppDownload />
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;

import React, { useState } from "react";
import Navbar from "./component/navbar/navbar";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Home } from "./pages/home/home";
import { Cart } from "./pages/cart/cart";
import { Placeorder } from "./pages/placeorder/placeorder";
import { Footer } from "./component/footer/footer";
import {AppDownload} from "./component/appdownload/appdownload";
import LoginPopup from "./component/loginpopup/loginpopup";
import VerifyPage from "./pages/verify/verify";
import MyOrders from "./pages/myOrders/myOrder";


const App = () => {
  const [showLogin,setShowLogin]=useState(false);

  return (
    <Router>
      {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/placeorder" element={<Placeorder />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
         <AppDownload/>
      </div>
        <Footer/>
    </Router>
  );
};

export default App;

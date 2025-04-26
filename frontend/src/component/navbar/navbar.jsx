import React, { useContext, useState } from "react";
import "./navbar.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/storecontext";
import Cookies from "js-cookie";

const Navbar = ({ setShowLogin }) => {
    const { getTotalCartAmount, setIsLoggedIn, isLoggedIn ,setUser} = useContext(StoreContext);
    const [menu, setMenu] = useState("home");
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    // Retrieve token from cookies (for checking login status)
    const token = Cookies.get("token");

    // Logout function
    const handleLogout = () => {
        Cookies.remove("token"); // Remove token from cookies
        setShowDropdown(false); // Close dropdown
        navigate("/"); // Redirect to home page
        setIsLoggedIn(false);
        setUser({})
    };

    // Function to handle navigation
    const handleNavigation = (path) => {
        setMenu(path);
        navigate(path);
    };

    // Function to handle scrolling to sections
    const handleScrollToSection = (sectionId) => {
        navigate("/"); // Ensure we are on the home page first
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        }, 100); // Delay to allow navigation to complete
    };

    return (
        <div className="navbar">
            <button id="logo12" className="" onClick={() => handleNavigation("/")}>
                <img src={assets.logo} alt="Logo" className="logo" />
            </button>

            <ul className="navbar-menu">
                <button className={`nav-btn ${menu === "home" ? "active-btn" : ""}`} onClick={() => handleNavigation("/")}>
                    Home
                </button>
                <button className="nav-btn" onClick={() => handleScrollToSection("explore-menu")}>
                    Menu
                </button>
                <button className="nav-btn" onClick={() => handleScrollToSection("app-download")}>
                    Mobile App
                </button>
                <button className="nav-btn" onClick={() => handleScrollToSection("footer")}>
                    Contact Us
                </button>
                {isLoggedIn && (
                    <button className={`nav-btn ${menu === "orders" ? "active-btn" : ""}`} onClick={() => handleNavigation("/my-orders")}>
                        My Orders
                    </button>
                )}
            </ul>

            <div className="navbar-right">
                <div className="navbar-search-icon">
                    <button className="icon-btn" onClick={() => handleNavigation("/cart")}>
                        <img src={assets.basket_icon} alt="Cart" />
                    </button>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>

                {isLoggedIn ? (
                    <div className="profile-container">
                        <img
                            src={assets.profile_icon}
                            alt="Profile"
                            className="profile-icon"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />
                        {showDropdown && (
                            <div className="profile-dropdown">
                                <button className="dropdown-btn" onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className="nav-btn login-btn" onClick={() => setShowLogin(true)}>Sign In</button>
                )}
            </div>
        </div>
    );
};

export default Navbar;

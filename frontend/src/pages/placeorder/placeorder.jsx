import './placeorder.css';

import { useState, useContext,useEffect } from "react";
import axios from "axios";
import { StoreContext } from "../../context/storecontext.jsx";
export const Placeorder = () => {
  const { getTotalCartAmount, token, cartItems,user } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user && user.email ? user.email : "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [user]); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.street) newErrors.street = "Street address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    if (!formData.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    if (!cartItems || Object.keys(cartItems).length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    // Convert items from object to array
    const itemsArray = Object.keys(cartItems).map((key) => ({
      foodId: cartItems[key].foodId,
      name: cartItems[key].name,
      price: cartItems[key].price,
      quantity: cartItems[key].quantity,
    }));

    const orderData = {
      address: formData,
      items: itemsArray, // Send items as an array
      amount: getTotalCartAmount() ,
    };
    
    try {
      const response = await axios.post(`http://localhost:4000/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        if (response.data.session_url) {
          window.location.replace(response.data.session_url);
        } else {
          alert("Order placed successfully!");
        }
      } else {
        alert(response.data.message || "Error placing order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email address"
          disabled
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="Street"
        />
        {errors.street && <span className="error">{errors.street}</span>}

        <div className="multi-fields">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
          {errors.city && <span className="error">{errors.city}</span>}

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
          />
          {errors.state && <span className="error">{errors.state}</span>}
        </div>

        <div className="multi-fields">
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
          />
          {errors.pincode && <span className="error">{errors.pincode}</span>}

          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
          />
          {errors.country && <span className="error">{errors.country}</span>}
        </div>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>SubTotal</p>
            <p>{getTotalCartAmount()} ₹</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>{getTotalCartAmount() === 0 ? 0 : 20} ₹</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total </b>
            <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20} ₹</b>
          </div>
          <button type="submit">PROCEED TO EVENT</button>
        </div>
      </div>
    </form>
  );
};

export default Placeorder;

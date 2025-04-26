import React, { useContext, useState } from 'react';
import './loginpopup.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { StoreContext } from '../../context/storecontext';
import Cookies from 'js-cookie'
const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Sign Up");
  const {setIsLoggedIn,setUser} = useContext(StoreContext)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handle submit for Login and Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const url = currState === "Sign Up"
      ? 'http://localhost:4000/api/user/register'  // replace with actual signup endpoint
      : 'http://localhost:4000/api/user/login';  // replace with actual login endpoint

    const body = currState === "Sign Up"
      ? { name: formData.name, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      const response = await axios.post(url, body);

      if (response.data.success) {
        Cookies.set("token", response.data.token, { expires: 1, secure: true });
        setIsLoggedIn(true)
        if(response.data.user)setUser(response.data.user)
        alert(`${currState === 'Sign Up' ? 'Account created' : 'Logged in'} successfully!`);
        setShowLogin(false); 
        
      } else {
        setIsLoggedIn(false)
        setErrorMessage(response.data.message || 'Something went wrong!');
      }
    } catch (error) {
      setIsLoggedIn(false)
      setErrorMessage('Error: Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? null : (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              required
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Your Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Your Password"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : currState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
            By continuing, I agree to the terms and conditions of use & privacy policy.
          </p>
        </div>

        {currState === "Login" ? (
          <p>
            Don't have an account?{' '}
            <span onClick={() => setCurrState("Sign Up")}>Sign Up Here</span>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <span onClick={() => setCurrState("Login")}>Login Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;

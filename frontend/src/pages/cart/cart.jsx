import React, { useContext } from 'react';
import './cart.css';
import { StoreContext } from '../../context/storecontext';
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
  const { cartItems, foodList, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        {/* Table structure for cart items */}
        <table className="cart-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(cartItems).map((itemId) => {
              const cartItem = cartItems[itemId]; // Access the item in the cart
              const foodItem = foodList.find((food) => food._id === cartItem.foodId); // Find corresponding food

              if (foodItem) {
                return (
                  <tr key={foodItem._id}>
                    <td>
                      <img
                        src={`http://localhost:4000/images/${foodItem.image}`} 
                        alt={foodItem.name} 
                        className="cart-item-img"
                      />
                    </td>
                    <td>{foodItem.name}</td>
                    <td>{foodItem.price}₹</td>
                    <td>{cartItem.quantity}</td>
                    <td>{foodItem.price * cartItem.quantity}₹</td>
                    <td 
                      onClick={() => removeFromCart(foodItem._id)} 
                      className="cross"
                    >
                      x
                    </td>
                  </tr>
                );
              }
              return null; // Skip if no matching food item is found
            })}
          </tbody>
        </table>

        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>{getTotalCartAmount()}₹</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 20}₹</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total </b>
              <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}₹</b>
            </div>
            <button onClick={() => navigate('/placeorder')}>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

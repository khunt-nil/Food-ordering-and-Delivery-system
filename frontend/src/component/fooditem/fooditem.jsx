import React, { useContext } from 'react';
import './fooditem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/storecontext';

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

    // Get the current item details from the cartItems in context
    const item = cartItems[id] || { quantity: 0 }; // Default to quantity 0 if the item is not in the cart
    const itemCount = item.quantity;

    const handleAddClick = () => {
        if (itemCount === 0) {
            addToCart(id);  // Only call if the item is not in the cart
        }
    };
    

    const handleIncrease = () => {
        addToCart(id); // Add one more item to the cart
    };

    const handleDecrease = () => {
        removeFromCart(id); // Remove one item from the cart
    };

    // Construct the full URL to fetch the image from the backend
    const imageUrl = `http://localhost:4000/images/${image}`;

    return (
        <div className="food-item">
            <div className="food-item-img-container">
                <img src={imageUrl} alt={name} className="food-item-image" />
                {itemCount === 0 ? (
                    <img
                        onClick={handleAddClick}
                        src={assets.add_icon_white}
                        alt="Add to cart"
                        className="add"
                    />
                ) : (
                    <div className="food-item-counter">
                        <img
                            onClick={handleDecrease}
                            src={assets.remove_icon_red}
                            alt="Remove from cart"
                        />
                        <p>{itemCount}</p>
                        <img
                            onClick={handleIncrease}
                            src={assets.add_icon_green}
                            alt="Increase quantity"
                        />
                    </div>
                )}
            </div>

            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating" />
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">{price}₹</p>
            </div>
        </div>
    );
};

export default FoodItem;

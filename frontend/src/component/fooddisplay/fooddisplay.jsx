import React, { useContext } from 'react';
import './fooddisplay.css';
import { StoreContext } from '../../context/storecontext';
import FoodItem from '../fooditem/fooditem';

const FoodDisplay = ({ category }) => {
    const { foodList } = useContext(StoreContext);

    // Check if foodList is defined and has items
    if (!foodList || foodList.length === 0) {
        return <p>Loading food items...</p>;
    }

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {foodList.map((item, index) => {
                    // Corrected the condition: category should be compared with '==='
                    if (category === "All" || category === item.category) {
                        return (
                            <FoodItem
                                key={index}
                                id={item._id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        );
                    }
                    return null; // Return null if category doesn't match
                })}
            </div>
        </div>
    );
}

export default FoodDisplay;

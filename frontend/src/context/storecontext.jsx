import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [foodList, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [user,setUser] = useState({});
    useEffect(() => {
        console.log("Updated user:", user);
        setUser(user)
    }, [user]); // Logs whenever user state changes
    
    useEffect(() => {
        const verifyToken = async () => {
            const token = Cookies.get("token");
            
            if (!token) {
                setIsLoggedIn(false);
                return;
            }
    
            try {
                const response = await axios.get("http://localhost:4000/api/user/verify-token", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (response.data.success) {
                    setUser(response.data.user)
                    // console.log(user)
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                setUser({})
                console.error("Token verification failed:", error);
                setIsLoggedIn(false);
            }
        };
    
        verifyToken();
    }, []);
    // Fetch food list from backend
    useEffect(() => {
        const fetchFoodList = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/food/list");
                if (response.data.success) {
                    setFoodList(response.data.data);
                } else {
                    console.error("Error fetching food list");
                }
            } catch (error) {
                console.error("Error fetching food list", error);
            }
        };

        fetchFoodList();
    }, []);

    const addToCart = (id) => {
        setCartItems((prevCartItems) => {
            const food = foodList.find((food) => food._id === id);
            
            if (!food) return prevCartItems;
    
            return {
                ...prevCartItems,
                [id]: {
                    foodId: id,
                    name: food.name,
                    price: food.price,
                    quantity: (prevCartItems[id]?.quantity || 0) + 1, // ✅ Ensures +1 increment only
                },
            };
        });
    };
    
    const removeFromCart = (id) => {
        setCartItems((prevCartItems) => {
            if (!prevCartItems[id]) return prevCartItems; // If item doesn't exist, return state as is
    
            const updatedCart = { ...prevCartItems };
    
            if (updatedCart[id].quantity > 1) {
                updatedCart[id] = {
                    ...updatedCart[id],
                    quantity: updatedCart[id].quantity - 1,
                };
            } else {
                delete updatedCart[id]; // ✅ Correct way to remove an item from an object
            }
            return updatedCart; // Ensure a new reference is returned
        });
    };
    
    

    // Function to calculate total amount of the cart
    const getTotalCartAmount = () => {
        return Object.values(cartItems).reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    const contextValue = {
        foodList, // Renamed for clarity
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;

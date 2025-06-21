import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantsWithMenu, setRestaurantsWithMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [token, setToken] = useState("");
  const url = "http://localhost:4000";

  const loadCartData = async (token) => {
    setCartLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(response.data.cartData || {});
      if (response.data.restaurantId) {
        setSelectedRestaurant(response.data.restaurantId);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    const fetchRestaurantsWithMenu = async () => {
      try {
        const restaurantsRes = await axios.get(`${url}/api/restaurant/list`);
        
        if (restaurantsRes.data.success) {
          const restaurantsWithMenus = await Promise.all(
            restaurantsRes.data.data.map(async (restaurant) => {
              try {
                const menuRes = await axios.get(`${url}/api/food/menu/${restaurant._id}`);
                return {
                  ...restaurant,
                  menuItems: menuRes.data.success ? menuRes.data.data : [],
                };
              } catch (error) {
                console.error(`Error fetching menu for restaurant ${restaurant._id}:`, error);
                return { ...restaurant, menuItems: [] };
              }
            })
          );
          setRestaurantsWithMenu(restaurantsWithMenus);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantsWithMenu();
  }, []);

  useEffect(() => {
    const initializeCart = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    };
    initializeCart();
  }, []);

  const addToCart = async (restaurantId, itemId) => {
    try {
      setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
      
      if (!selectedRestaurant) {
        setSelectedRestaurant(restaurantId.toString());
      }

      if (token) {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId, restaurantId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Cart sync failed:", error);
      setCartItems((prev) => {
        const updated = { ...prev };
        if (updated[itemId] <= 1) delete updated[itemId];
        else updated[itemId] -= 1;
        return updated;
      });
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setCartItems((prev) => {
        const updatedCart = { ...prev };
        if (updatedCart[itemId] > 1) {
          updatedCart[itemId] -= 1;
        } else {
          delete updatedCart[itemId];
          if (Object.keys(updatedCart).length === 0) {
            setSelectedRestaurant(null);
          }
        }
        return updatedCart;
      });

      if (token) {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Remove from cart failed:", error);
      setCartItems((prev) => {
        const updatedCart = { ...prev };
        updatedCart[itemId] = (updatedCart[itemId] || 0) + 1;
        return updatedCart;
      });
    }
  };

  const clearCart = () => {
    setCartItems({});
    setSelectedRestaurant(null);
  };

  const getTotalCartAmount = () => {
    if (!selectedRestaurant) return 0;
    const restaurant = restaurantsWithMenu.find((r) => r._id === selectedRestaurant);
    if (!restaurant) return 0;

    return Object.keys(cartItems).reduce((total, itemId) => {
      const item = restaurant.menuItems.find((menuItem) => menuItem._id === itemId);
      return item ? total + item.price * cartItems[itemId] : total;
    }, 0);
  };

  const getCurrentRestaurantItems = () => {
    if (!selectedRestaurant) return [];
    const restaurant = restaurantsWithMenu.find((r) => r._id === selectedRestaurant);
    return restaurant ? restaurant.menuItems : [];
  };

  const contextValue = {
    restaurantsWithMenu,
    loading: loading || cartLoading,
    cartItems,
    selectedRestaurant,
    setCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    getCurrentRestaurantItems,
    url,
    token,
    setToken,
    loadCartData,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
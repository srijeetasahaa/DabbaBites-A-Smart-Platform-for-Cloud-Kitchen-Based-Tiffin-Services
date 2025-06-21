import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import RestaurantMenu from './pages/RestaurantMenu/RestaurantMenu';
import Menu from './pages/Menu/Menu';
import AboutUs from './pages/AboutUs/AboutUs';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import OrderHistory from "./pages/OrderHistory/OrderHistory";

import TrackOrder from './pages/TrackOrder/TrackOrder';
import SearchResults from './pages/SearchResults/SearchResults';
import StoreContextProvider from './context/StoreContext';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <StoreContextProvider>
      <>
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
        <div className='app'>
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path='*' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
             <Route path='/order-success' element={<OrderSuccess />} />
             
            <Route path="/track/:orderId" element={<TrackOrder />} />
           <Route path="/order-history" element={<OrderHistory />} />


            <Route path='/menu' element={<Menu />} />
            <Route path='/about' element={<AboutUs />} />
            <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </div>
        <Footer />
      </>
    </StoreContextProvider>
  );
};

export default App;
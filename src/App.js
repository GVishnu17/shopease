import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Wishlist from './pages/Wishlist';
import OrderTracking from './pages/OrderTracking';
import './App.css';

export default function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <AnnouncementBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders/:orderId" element={<OrderTracking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
}

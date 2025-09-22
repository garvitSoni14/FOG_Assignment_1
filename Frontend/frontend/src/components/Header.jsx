import React, { useState, useEffect } from "react";
import "./Header.css";
import { FiShoppingCart, FiUser, FiHeart, FiSearch } from "react-icons/fi";
import logo from '../assets/logo.svg';
const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">
          <div className="logo-icon">
                        <img src={logo} alt="Furniro Logo" className="logo-img" />
          </div>
          <span className="logo-text">Furniro</span>
        </div>

        <nav className="nav-links">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Shop</a>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Contact</a>
        </nav>

        <div className="header-actions">
          <FiUser className="icon" />
          <FiSearch className="icon" />
          <FiHeart className="icon" />
          <FiShoppingCart className="icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;

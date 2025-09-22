import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <img src="/src/assets/header.png" alt="Interior Design Background" className="hero-image" />
      </div>
      <div className="hero-content">
        <div className="hero-text-container">
          <h1 className="hero-title">
            <span className="title-line">Transform Your</span>
            <span className="title-line highlight">Living Space</span>
            <span className="title-line">Into Art</span>
          </h1>
          <p className="hero-subtitle">
            Discover premium furniture that blends elegance with comfort
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;

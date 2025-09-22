import React from 'react';
import './FeaturesFooter.css';
import { FiAward, FiShield, FiTruck, FiHeadphones } from 'react-icons/fi';

const FeaturesFooter = () => {
  const features = [
    {
      icon: FiAward,
      title: "High Quality",
      subtitle: "crafted from top materials"
    },
    {
      icon: FiShield,
      title: "Warranty Protection",
      subtitle: "Over 2 years"
    },
    {
      icon: FiTruck,
      title: "Free Shipping",
      subtitle: "Order over 150 $"
    },
    {
      icon: FiHeadphones,
      title: "24 / 7 Support",
      subtitle: "Dedicated support"
    }
  ];

  return (
    <section className="features-footer">
      <div className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <div className="feature-icon">
              <feature.icon />
            </div>
            <div className="feature-content">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-subtitle">{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesFooter;

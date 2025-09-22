import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ProductGrid from './components/ProductGrid';
import FeaturesFooter from './components/FeaturesFooter';

function App() {
  const [showAdminActions, setShowAdminActions] = useState(true); // Set to true to show admin actions
  const productGridRef = useRef();

  const handleAddProduct = () => {
    if (productGridRef.current) {
      productGridRef.current.handleAddProduct();
    }
  };

  return (
    <div className="App">
      <Header />
      <Hero />
      <FilterBar 
        onAddProduct={handleAddProduct}
        showAddButton={showAdminActions}
      />
      <ProductGrid 
        ref={productGridRef}
        showAdminActions={showAdminActions}
      />
      <FeaturesFooter />
    </div>
  );
}

export default App;

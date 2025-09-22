import React from "react";
import "./FilterBar.css";
import { FiFilter, FiGrid, FiList, FiPlus } from "react-icons/fi";

const FilterBar = ({ 
  onAddProduct, 
  resultsText = "Showing 1-16 of 32 results",
  showAddButton = true 
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-left">
        <button className="filter-btn">
          <FiFilter className="filter-icon" />
          <span className="filter-text">Filter</span>
        </button>
        <div className="view-toggle">
          <button className="view-btn active">
            <FiGrid className="view-icon" />
          </button>
          <button className="view-btn">
            <FiList className="view-icon" />
          </button>
        </div>
        <div className="separator"></div>
      </div>

      <div className="filter-center">
        <span className="results-text">{resultsText}</span>
      </div>

      <div className="filter-right">
        {showAddButton && (
          <button className="add-product-btn" onClick={onAddProduct}>
            <FiPlus className="add-icon" />
            Add Product
          </button>
        )}
        <div className="show-control">
          <span className="show-text">Show</span>
          <div className="show-input">
            <span className="show-value">16</span>
          </div>
        </div>
        <div className="sort-control">
          <span className="sort-text">Sort by</span>
          <div className="sort-input">
            <span className="sort-value">Default</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

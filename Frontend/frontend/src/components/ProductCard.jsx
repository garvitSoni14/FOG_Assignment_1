import React from "react";
import "./ProductCard.css";
import { FiShare2, FiHeart, FiRepeat, FiEdit3, FiTrash2 } from "react-icons/fi";

const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  showAdminActions = false 
}) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit && onEdit(product);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete && onDelete(product);
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image || product.imageUrl} alt={product.name} className="product-image" />
        {product.badge && (
          <div className={`product-badge ${product.badge.type}`}>
            {product.badge.text}
          </div>
        )}
        
        {/* Admin Actions - Show on hover */}
        {showAdminActions && (
          <div className="admin-actions">
            <button 
              className="admin-action-btn edit-btn"
              onClick={handleEdit}
              title="Edit Product"
            >
              <FiEdit3 />
            </button>
            <button 
              className="admin-action-btn delete-btn"
              onClick={handleDelete}
              title="Delete Product"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-prices">
          <span className="current-price">₹{product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="old-price">₹{product.oldPrice.toLocaleString()}</span>
          )}
        </div>
      </div>

      <div className="product-overlay">
        <button className="add-cart-btn">Add to Cart</button>
        <div className="product-actions">
          <div className="action-item">
            <FiShare2 className="action-icon" />
            <span>Share</span>
          </div>
          <div className="action-item">
            <FiRepeat className="action-icon" />
            <span>Compare</span>
          </div>
          <div className="action-item">
            <FiHeart className="action-icon" />
            <span>Like</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

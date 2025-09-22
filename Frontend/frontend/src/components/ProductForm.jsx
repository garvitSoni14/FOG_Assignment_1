import React, { useState, useEffect } from 'react';
import './ProductForm.css';
import { FiX, FiSave, FiLoader } from 'react-icons/fi';

const ProductForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product = null, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    oldPrice: '',
    description: '',
    badge: {
      type: '',
      text: ''
    },
    inStock: true,
    rating: 0,
    reviewCount: 0,
    tags: ''
  });

  const [errors, setErrors] = useState({});

  // Predefined options
  const categories = ['Chair', 'Table', 'Sofa', 'Bed', 'Storage'];
  const badgeTypes = ['', 'discount', 'new', 'sale'];
  const brands = ['Furniro', 'IKEA', 'West Elm', 'Ashley', 'Pottery Barn'];

  // Static image URL
  const staticImageUrl = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop";

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || '',
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        description: product.description || '',
        badge: {
          type: product.badge?.type || '',
          text: product.badge?.text || ''
        },
        inStock: product.inStock !== undefined ? product.inStock : true,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        tags: product.tags ? product.tags.join(', ') : ''
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        brand: '',
        category: '',
        price: '',
        oldPrice: '',
        description: '',
        badge: {
          type: '',
          text: ''
        },
        inStock: true,
        rating: 0,
        reviewCount: 0,
        tags: ''
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (formData.oldPrice && formData.oldPrice <= 0) {
      newErrors.oldPrice = 'Old price must be greater than 0';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    if (formData.reviewCount < 0) {
      newErrors.reviewCount = 'Review count cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
      rating: parseFloat(formData.rating),
      reviewCount: parseInt(formData.reviewCount),
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      imageUrl: staticImageUrl,
      badge: formData.badge.type ? formData.badge : undefined
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="product-form-overlay" onClick={handleClose}>
      <div className="product-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="product-form-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-btn" onClick={handleClose} disabled={loading}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter product name"
                disabled={loading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className={errors.brand ? 'error' : ''}
                disabled={loading}
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              {errors.brand && <span className="error-message">{errors.brand}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={errors.category ? 'error' : ''}
                disabled={loading}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={errors.price ? 'error' : ''}
                placeholder="0"
                min="0"
                step="0.01"
                disabled={loading}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="oldPrice">Old Price (₹)</label>
              <input
                type="number"
                id="oldPrice"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleInputChange}
                className={errors.oldPrice ? 'error' : ''}
                placeholder="0"
                min="0"
                step="0.01"
                disabled={loading}
              />
              {errors.oldPrice && <span className="error-message">{errors.oldPrice}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className={errors.rating ? 'error' : ''}
                placeholder="0"
                min="0"
                max="5"
                step="0.1"
                disabled={loading}
              />
              {errors.rating && <span className="error-message">{errors.rating}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="badge.type">Badge Type</label>
              <select
                id="badge.type"
                name="badge.type"
                value={formData.badge.type}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">No Badge</option>
                {badgeTypes.slice(1).map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="badge.text">Badge Text</label>
              <input
                type="text"
                id="badge.text"
                name="badge.text"
                value={formData.badge.text}
                onChange={handleInputChange}
                placeholder="e.g., -30%, New, Sale"
                disabled={loading || !formData.badge.type}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="modern, comfortable, luxury (comma separated)"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reviewCount">Review Count</label>
              <input
                type="number"
                id="reviewCount"
                name="reviewCount"
                value={formData.reviewCount}
                onChange={handleInputChange}
                className={errors.reviewCount ? 'error' : ''}
                placeholder="0"
                min="0"
                disabled={loading}
              />
              {errors.reviewCount && <span className="error-message">{errors.reviewCount}</span>}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
                disabled={loading}
              />
              <span className="checkbox-text">In Stock</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiLoader className="loading-icon" />
                  {product ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <FiSave />
                  {product ? 'Update Product' : 'Add Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

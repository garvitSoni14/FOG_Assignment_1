import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./ProductGrid.css";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import ProductForm from "./ProductForm";
import ConfirmDialog from "./ConfirmDialog";
import { useProducts, useFilterOptions, useProductCRUD } from "../hooks/useProducts";

const ProductGrid = forwardRef(({ filters = {}, showAdminActions = false }, ref) => {
  const { 
    products,
    setProducts, 
    pagination, 
    loading, 
    error, 
    changePage, 
    changePageSize,
    refetch
  } = useProducts(filters);
  
  const { paginationOptions } = useFilterOptions();
  const { createProduct, updateProduct, deleteProduct, loading: crudLoading } = useProductCRUD();

  // State for modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // CRUD Handlers
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditing && selectedProduct) {
        const result = await updateProduct(selectedProduct.id, formData);
        if (result.success) {
          setIsFormOpen(false);
          refetch();
        }
      } else {
        const result = await createProduct(formData);
        if (result.success) {
          setIsFormOpen(false);
          refetch();
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDeleteConfirm = async () => {
  try {
    const productId = selectedProduct.id;

    // Optimistic update → frontend se turant hatao
    setProducts((prev) => prev.filter((p) => p.id !== productId));

    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);

    // Backend delete call
    const result = await deleteProduct(productId);

    if (!result.success) {
      // Agar fail ho gaya toh backend se refresh kar lo
      refetch();
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    refetch(); // safety net
  }
};

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
    setIsEditing(false);
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleAddProduct
  }));

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="product-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="product-section">
        <div className="error-container">
          <h3>Error Loading Products</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No products found
  if (!loading && products.length === 0) {
    return (
      <div className="product-section">
        <div className="no-products-container">
          <h3>No Products Found</h3>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-section">
      {/* Loading overlay for subsequent loads */}
      {loading && products.length > 0 && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            showAdminActions={showAdminActions}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>

      {/* Enhanced Pagination Component */}
      <Pagination
        pagination={pagination}
        onPageChange={changePage}
        onPageSizeChange={changePageSize}
        pageSizeOptions={paginationOptions.pageSizeOptions || []}
        loading={loading}
      />

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        loading={crudLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={crudLoading}
      />
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;

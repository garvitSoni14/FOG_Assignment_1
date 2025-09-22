import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Custom hook for managing products with pagination and filtering
export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products with current filters
  const fetchProducts = useCallback(async (newFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = apiService.buildProductQuery({ ...filters, ...newFilters });
      const response = await apiService.getProducts(queryParams);

      if (response.success) {
        setProducts(response.data.products);
        setPagination(apiService.formatPagination(response.data.pagination));
        setFilters({ ...filters, ...newFilters });
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update filters and fetch products
  const updateFilters = useCallback((newFilters) => {
    fetchProducts(newFilters);
  }, [fetchProducts]);

  // Change page
  const changePage = useCallback((page) => {
    fetchProducts({ page });
  }, [fetchProducts]);

  // Change page size
  const changePageSize = useCallback((limit) => {
    fetchProducts({ limit, page: 1 }); // Reset to first page when changing page size
  }, [fetchProducts]);

  // Sort products
  const sortProducts = useCallback((sortBy, sortOrder = 'asc') => {
    fetchProducts({ sortBy, sortOrder, page: 1 }); // Reset to first page when sorting
  }, [fetchProducts]);

  // Search products
  const searchProducts = useCallback((search) => {
    fetchProducts({ search, page: 1 }); // Reset to first page when searching
  }, [fetchProducts]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      page: 1,
      limit: filters.limit || 16,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    fetchProducts(clearedFilters);
  }, [fetchProducts, filters.limit]);

  // Load initial products
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    pagination,
    filters,
    loading,
    error,
    updateFilters,
    changePage,
    changePageSize,
    sortProducts,
    searchProducts,
    clearFilters,
    refetch: fetchProducts,
  };
};

// Hook for managing filter options
export const useFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    categories: [],
    priceRange: { minPrice: 0, maxPrice: 0, avgPrice: 0 },
    tags: [],
    badgeTypes: [],
    ratingStats: { avgRating: 0, maxRating: 0, minRating: 0 },
  });
  const [paginationOptions, setPaginationOptions] = useState({
    pageSizeOptions: [],
    totalProducts: 0,
    defaultPageSize: 16,
    maxPageSize: 100,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFilterOptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [filtersResponse, paginationResponse] = await Promise.all([
        apiService.getFilterOptions(),
        apiService.getPaginationOptions(),
      ]);

      if (filtersResponse.success) {
        setFilterOptions(filtersResponse.data);
      }

      if (paginationResponse.success) {
        setPaginationOptions(paginationResponse.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching filter options:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  return {
    filterOptions,
    paginationOptions,
    loading,
    error,
    refetch: fetchFilterOptions,
  };
};

// Hook for managing single product
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getProduct(id);
      if (response.success) {
        setProduct(apiService.formatProduct(response.data));
      } else {
        throw new Error(response.message || 'Failed to fetch product');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduct(productId);
  }, [productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: () => fetchProduct(productId),
  };
};

// Hook for product CRUD operations
export const useProductCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.createProduct(productData);
      if (response.success) {
        return { success: true, data: apiService.formatProduct(response.data) };
      } else {
        throw new Error(response.message || 'Failed to create product');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.updateProduct(id, productData);
      if (response.success) {
        return { success: true, data: apiService.formatProduct(response.data) };
      } else {
        throw new Error(response.message || 'Failed to update product');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.deleteProduct(id);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  };
};

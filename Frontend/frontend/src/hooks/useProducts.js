import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Custom hook for managing products with pagination and filtering
export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (newFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = apiService.buildProductQuery({ ...filters, ...newFilters });
      const response = await apiService.getProducts(queryParams);

      // response is expected to be an array or an object with products
      setProducts(Array.isArray(response) ? response : response.products || []);
      if (response.pagination) {
        setPagination(apiService.formatPagination(response.pagination));
      }
      setFilters({ ...filters, ...newFilters });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters) => fetchProducts(newFilters), [fetchProducts]);
  const changePage = useCallback((page) => fetchProducts({ page }), [fetchProducts]);
  const changePageSize = useCallback((limit) => fetchProducts({ limit, page: 1 }), [fetchProducts]);
  const sortProducts = useCallback((sortBy, sortOrder = 'asc') => fetchProducts({ sortBy, sortOrder, page: 1 }), [fetchProducts]);
  const searchProducts = useCallback((search) => fetchProducts({ search, page: 1 }), [fetchProducts]);
  const clearFilters = useCallback(() => {
    fetchProducts({
      page: 1,
      limit: filters.limit || 16,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }, [fetchProducts, filters.limit]);

  useEffect(() => { fetchProducts(); }, []);

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
    refetch: fetchProducts
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
      const filtersResponse = await apiService.getFilterOptions();
      const paginationResponse = await apiService.getPaginationOptions();

      setFilterOptions(filtersResponse || {});
      setPaginationOptions(paginationResponse || {});
    } catch (err) {
      setError(err.message);
      console.error('Error fetching filter options:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFilterOptions(); }, [fetchFilterOptions]);

  return { filterOptions, paginationOptions, loading, error, refetch: fetchFilterOptions };
};

// Hook for managing a single product
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
      setProduct(response || null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProduct(productId); }, [productId, fetchProduct]);

  return { product, loading, error, refetch: () => fetchProduct(productId) };
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
      return response || null;
    } catch (err) {
      setError(err.message);
      return null;
    } finally { setLoading(false); }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateProduct(id, productData);
      return response || null;
    } catch (err) {
      setError(err.message);
      return null;
    } finally { setLoading(false); }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.deleteProduct(id);
      return response || null;
    } catch (err) {
      setError(err.message);
      return null;
    } finally { setLoading(false); }
  }, []);

  return { createProduct, updateProduct, deleteProduct, loading, error };
};

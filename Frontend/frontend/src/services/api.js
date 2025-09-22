// API Service for Furniro Backend Integration
const API_BASE_URL = 'http://localhost:4000/api';

class ApiService {
  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // ==================== PRODUCT ENDPOINTS ====================

  // Get products with filtering, sorting, and pagination
  async getProducts(params = {}) {
    const defaultParams = {
      page: 1,
      limit: 16,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    const queryParams = { ...defaultParams, ...params };
    return this.get('/products', queryParams);
  }

  // Get single product by ID
  async getProduct(id) {
    return this.get(`/products/${id}`);
  }

  // Create new product
  async createProduct(productData) {
    return this.post('/products', productData);
  }

  // Update product
  async updateProduct(id, productData) {
    return this.put(`/products/${id}`, productData);
  }

  // Delete product
  async deleteProduct(id) {
    return this.delete(`/products/${id}`);
  }

  // Bulk create products
  async bulkCreateProducts(products) {
    return this.post('/products/bulk', { products });
  }

  // ==================== FILTER & PAGINATION ENDPOINTS ====================

  // Get filter options
  async getFilterOptions() {
    return this.get('/products/filters');
  }

  // Get pagination options
  async getPaginationOptions() {
    return this.get('/products/pagination-options');
  }

  // Get product statistics
  async getProductStats() {
    return this.get('/products/stats');
  }

  // ==================== UTILITY METHODS ====================

  // Build query parameters for product filtering
  buildProductQuery(filters = {}) {
    const {
      page = 1,
      limit = 16,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      brand,
      category,
      minPrice,
      maxPrice,
      search,
      inStock,
      badge,
      tags,
      rating,
    } = filters;

    const params = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    // Add filters only if they have values
    if (brand) params.brand = Array.isArray(brand) ? brand : [brand];
    if (category) params.category = Array.isArray(category) ? category : [category];
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    if (search) params.search = search;
    if (inStock !== undefined) params.inStock = inStock;
    if (badge) params.badge = badge;
    if (tags) params.tags = Array.isArray(tags) ? tags : [tags];
    if (rating !== undefined) params.rating = rating;

    return params;
  }

  // Format product data for display
  formatProduct(product) {
    return {
      id: product._id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      imageUrl: product.imageUrl,
      description: product.description,
      badge: product.badge,
      inStock: product.inStock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      tags: product.tags || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  // Format pagination data
  formatPagination(pagination) {
    return {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      itemsPerPage: pagination.itemsPerPage,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
      startItem: pagination.startItem,
      endItem: pagination.endItem,
      pageNumbers: pagination.pageNumbers,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage,
      showing: pagination.showing,
    };
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
  getFilterOptions,
  getPaginationOptions,
  getProductStats,
  buildProductQuery,
  formatProduct,
  formatPagination,
} = apiService;

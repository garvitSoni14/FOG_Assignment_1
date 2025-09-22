// API Service for Furniro Backend Integration
const API_BASE_URL = import.meta.env.VITE_API_URL;

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

      // Handle empty responses
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Invalid JSON response from ${url}: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Unwrap common API envelope { success, data }
      if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
        return data.data;
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

  async getProduct(id) {
    return this.get(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.post('/products', productData);
  }

  async updateProduct(id, productData) {
    return this.put(`/products/${id}`, productData);
  }

  async deleteProduct(id) {
    return this.delete(`/products/${id}`);
  }

  async bulkCreateProducts(products) {
    return this.post('/products/bulk', { products });
  }

  // ==================== FILTER & PAGINATION ENDPOINTS ====================
  async getFilterOptions() {
    return this.get('/products/filters');
  }

  async getPaginationOptions() {
    // Backend route not available in deployment; return sensible defaults
    return {
      pageSizeOptions: [
        { value: 8, label: '8 per page' },
        { value: 16, label: '16 per page' },
        { value: 24, label: '24 per page' },
        { value: 32, label: '32 per page' },
        { value: 48, label: '48 per page' }
      ],
      totalProducts: 0,
      defaultPageSize: 16,
      maxPageSize: 100
    };
  }

  async getProductStats() {
    return this.get('/products/stats');
  }

  // ==================== UTILITY METHODS ====================
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

    const params = { page, limit, sortBy, sortOrder };

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

  formatProduct(product) {
    return {
      id: product._id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      imageUrl: product.imageUrl || product.image,
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

const apiService = new ApiService();
export default apiService;

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

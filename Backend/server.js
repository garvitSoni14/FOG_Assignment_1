require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// ------------------- MongoDB Connection ------------------- //
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/furniro';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> console.log('MongoDB connected to:', mongoURI))
.catch(err => console.log('MongoDB connection error:', err));

// ------------------- Product Model ------------------- //
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: Number,
  imageUrl: { type: String, required: true },
  description: String,
  badge: {
    type: { type: String, enum: ['discount', 'new', 'sale'] },
    text: String
  },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// ------------------- CRUD ROUTES ------------------- //

// GET products with comprehensive filtering/sorting/pagination
app.get('/api/products', async (req, res) => {
  try {
    const { 
      brand, 
      category, 
      minPrice, 
      maxPrice, 
      sortBy, 
      sortOrder, 
      page = 1, 
      limit = 16,
      search,
      inStock,
      badge,
      tags,
      rating
    } = req.query;

    // Build filter object
    const filter = {};

    // Brand filtering (supports multiple brands)
    if (brand) {
      if (Array.isArray(brand)) {
        filter.brand = { $in: brand };
      } else {
        filter.brand = brand;
      }
    }

    // Category filtering (supports multiple categories)
    if (category) {
      if (Array.isArray(category)) {
        filter.category = { $in: category };
      } else {
        filter.category = category;
      }
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Stock filtering
    if (inStock !== undefined) {
      filter.inStock = inStock === 'true';
    }

    // Badge filtering
    if (badge) {
      filter['badge.type'] = badge;
    }

    // Tags filtering
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    // Rating filtering
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // Build query
    let query = Product.find(filter);

    // Advanced sorting options
    if (sortBy) {
      const sort = {};
      const validSortFields = ['name', 'brand', 'price', 'rating', 'createdAt', 'updatedAt'];
      
      if (validSortFields.includes(sortBy)) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        // For name and brand sorting, add secondary sort by price
        if (sortBy === 'name' || sortBy === 'brand') {
          sort.price = 1;
        }
        
      query = query.sort(sort);
      }
    } else {
      // Default sorting by creation date (newest first)
      query = query.sort({ createdAt: -1 });
    }

    // Enhanced Pagination with validation
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 16)); // Max 100 items per page
    const skip = (pageNum - 1) * limitNum;
    
    query = query.skip(skip).limit(limitNum);

    // Execute query
    const products = await query;
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    // Calculate advanced pagination info
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    const startItem = total > 0 ? skip + 1 : 0;
    const endItem = Math.min(skip + limitNum, total);
    
    // Generate page numbers for pagination UI
    const generatePageNumbers = (currentPage, totalPages, maxVisible = 5) => {
      const pages = [];
      const halfVisible = Math.floor(maxVisible / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);
      
      if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    };
    
    const pageNumbers = generatePageNumbers(pageNum, totalPages);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage,
          hasPrevPage,
          startItem,
          endItem,
          pageNumbers,
          nextPage: hasNextPage ? pageNum + 1 : null,
          prevPage: hasPrevPage ? pageNum - 1 : null,
          showing: `${startItem}-${endItem} of ${total} products`
        },
        filters: {
          appliedFilters: {
            brand: brand || null,
            category: category || null,
            priceRange: {
              min: minPrice ? Number(minPrice) : null,
              max: maxPrice ? Number(maxPrice) : null
            },
            search: search || null,
            inStock: inStock || null,
            badge: badge || null,
            tags: tags || null,
            rating: rating || null
          }
        }
      }
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch products', 
      message: err.message 
    });
  }
});

// GET pagination options
app.get('/api/products/pagination-options', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    
    const pageSizeOptions = [
      { value: 8, label: '8 per page' },
      { value: 16, label: '16 per page' },
      { value: 24, label: '24 per page' },
      { value: 32, label: '32 per page' },
      { value: 48, label: '48 per page' }
    ];

    res.json({
      success: true,
      data: {
        pageSizeOptions,
        totalProducts,
        defaultPageSize: 16,
        maxPageSize: 100
      }
    });
  } catch (err) {
    console.error('Error fetching pagination options:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch pagination options', 
      message: err.message 
    });
  }
});

// GET filter options (brands, categories, price ranges)
app.get('/api/products/filters', async (req, res) => {
  try {
    // Get all unique brands
    const brands = await Product.distinct('brand');
    
    // Get all unique categories
    const categories = await Product.distinct('category');
    
    // Get price range
    const priceStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);
    
    // Get all unique tags
    const tags = await Product.distinct('tags');
    
    // Get badge types
    const badgeTypes = await Product.distinct('badge.type');
    
    // Get rating distribution
    const ratingStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          maxRating: { $max: '$rating' },
          minRating: { $min: '$rating' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        brands: brands.sort(),
        categories: categories.sort(),
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 },
        tags: tags.filter(tag => tag).sort(),
        badgeTypes: badgeTypes.filter(badge => badge).sort(),
        ratingStats: ratingStats[0] || { avgRating: 0, maxRating: 0, minRating: 0 }
      }
    });
  } catch (err) {
    console.error('Error fetching filter options:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch filter options', 
      message: err.message 
    });
  }
});

// GET product statistics
app.get('/api/products/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ inStock: true });
    const outOfStockProducts = await Product.countDocuments({ inStock: false });
    
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const brandStats = await Product.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        categoryStats,
        brandStats
      }
    });
  } catch (err) {
    console.error('Error fetching product stats:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch product statistics', 
      message: err.message 
    });
  }
});

// POST create product with enhanced validation
app.post('/api/products', async (req, res) => {
  try {
    // Validate required fields
    const { name, brand, category, price, imageUrl } = req.body;
    
    if (!name || !brand || !category || !price || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, brand, category, price, and imageUrl are required'
      });
    }

    // Validate price is positive number
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid price',
        message: 'Price must be a positive number'
      });
    }

    // Check if product with same name already exists
    const existingProduct = await Product.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      brand: { $regex: new RegExp(`^${brand}$`, 'i') }
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        error: 'Product already exists',
        message: `Product "${name}" by "${brand}" already exists`
      });
    }

    const product = new Product({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await product.save();
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch(err) {
    console.error('Error creating product:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: errors.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create product', 
      message: err.message 
    });
  }
});

// PUT update product with enhanced validation
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
        message: 'Product ID must be a valid MongoDB ObjectId'
      });
    }

    // Validate price if provided
    if (updateData.price !== undefined && updateData.price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid price',
        message: 'Price must be a positive number'
      });
    }

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found',
        message: 'No product found with the provided ID'
      });
    }

    // Check for duplicate name/brand if name or brand is being updated
    if (updateData.name || updateData.brand) {
      const name = updateData.name || existingProduct.name;
      const brand = updateData.brand || existingProduct.brand;
      
      const duplicateProduct = await Product.findOne({ 
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        brand: { $regex: new RegExp(`^${brand}$`, 'i') }
      });

      if (duplicateProduct) {
        return res.status(409).json({
          success: false,
          error: 'Product already exists',
          message: `Product "${name}" by "${brand}" already exists`
        });
      }
    }

    const updated = await Product.findByIdAndUpdate(
      id, 
      { ...updateData, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updated,
      message: 'Product updated successfully'
    });
  } catch(err) {
    console.error('Error updating product:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: errors.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to update product', 
      message: err.message 
    });
  }
});

// DELETE product with enhanced validation
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
        message: 'Product ID must be a valid MongoDB ObjectId'
      });
    }

    // Check if product exists before deletion
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found',
        message: 'No product found with the provided ID'
      });
    }

    const deleted = await Product.findByIdAndDelete(id);
    
    res.json({ 
      success: true,
      message: 'Product deleted successfully',
      data: { 
        id: deleted._id,
        name: deleted.name,
        brand: deleted.brand
      }
    });
  } catch(err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete product', 
      message: err.message 
    });
  }
});

// GET single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ 
      success: false,
      error: 'Product not found' 
    });
    res.json({
      success: true,
      data: product
    });
  } catch(err) {
    res.status(400).json({ 
      success: false,
      error: 'Failed to fetch product', 
      message: err.message 
    });
  }
});

// POST bulk create products (for seeding)
app.post('/api/products/bulk', async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        error: 'Products must be an array'
      });
    }

    const createdProducts = await Product.insertMany(products);
    res.status(201).json({
      success: true,
      data: {
        count: createdProducts.length,
        products: createdProducts
      }
    });
  } catch(err) {
    res.status(400).json({ 
      success: false,
      error: 'Failed to create products', 
      message: err.message 
    });
  }
});

// Root route
app.get('/', (req,res)=> res.send('Backend with MongoDB running'));

// ------------------- Start server ------------------- //
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

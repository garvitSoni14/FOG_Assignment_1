const mongoose = require('mongoose');
require('dotenv').config();

// Product Schema (same as in server.js)
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

// Comprehensive furniture product data
const furnitureProducts = [
  // Chairs
  {
    name: "Syltherine",
    brand: "Furniro",
    category: "Chair",
    price: 2500000,
    oldPrice: 3500000,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    description: "Stylish cafe chair with modern design and comfortable seating",
    badge: { type: "discount", text: "-30%" },
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
    tags: ["modern", "comfortable", "cafe", "stylish"]
  },
  {
    name: "Leviosa",
    brand: "Furniro",
    category: "Chair",
    price: 1800000,
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    description: "Elegant dining chair with premium materials",
    badge: { type: "new", text: "New" },
    inStock: true,
    rating: 4.8,
    reviewCount: 95,
    tags: ["elegant", "dining", "premium", "luxury"]
  },
  {
    name: "Lolito",
    brand: "Furniro",
    category: "Chair",
    price: 3200000,
    imageUrl: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=300&fit=crop",
    description: "Luxury office chair with ergonomic design",
    badge: { type: "sale", text: "Sale" },
    inStock: true,
    rating: 4.3,
    reviewCount: 67,
    tags: ["luxury", "office", "ergonomic", "professional"]
  },
  {
    name: "Respira",
    brand: "Furniro",
    category: "Chair",
    price: 2100000,
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop",
    description: "Comfortable lounge chair for relaxation",
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
    tags: ["lounge", "comfortable", "relaxation", "home"]
  },

  // Tables
  {
    name: "Grifo",
    brand: "Furniro",
    category: "Table",
    price: 4500000,
    oldPrice: 5500000,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    description: "Modern dining table with sleek design",
    badge: { type: "discount", text: "-18%" },
    inStock: true,
    rating: 4.7,
    reviewCount: 156,
    tags: ["modern", "dining", "sleek", "contemporary"]
  },
  {
    name: "Muggo",
    brand: "Furniro",
    category: "Table",
    price: 2800000,
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    description: "Compact coffee table perfect for small spaces",
    badge: { type: "new", text: "New" },
    inStock: true,
    rating: 4.4,
    reviewCount: 73,
    tags: ["compact", "coffee", "small-space", "versatile"]
  },
  {
    name: "Pingky",
    brand: "Furniro",
    category: "Table",
    price: 3600000,
    imageUrl: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=300&fit=crop",
    description: "Elegant side table with storage compartments",
    inStock: true,
    rating: 4.5,
    reviewCount: 112,
    tags: ["elegant", "side-table", "storage", "functional"]
  },
  {
    name: "Potty",
    brand: "Furniro",
    category: "Table",
    price: 1900000,
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop",
    description: "Minimalist end table with clean lines",
    inStock: true,
    rating: 4.2,
    reviewCount: 58,
    tags: ["minimalist", "end-table", "clean", "simple"]
  },

  // Sofas
  {
    name: "Sofa Set",
    brand: "Furniro",
    category: "Sofa",
    price: 8500000,
    oldPrice: 10500000,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    description: "Luxury 3-seater sofa set with premium upholstery",
    badge: { type: "discount", text: "-19%" },
    inStock: true,
    rating: 4.9,
    reviewCount: 234,
    tags: ["luxury", "3-seater", "premium", "upholstery"]
  },
  {
    name: "Corner Sofa",
    brand: "Furniro",
    category: "Sofa",
    price: 7200000,
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    description: "Modern corner sofa perfect for living rooms",
    badge: { type: "new", text: "New" },
    inStock: true,
    rating: 4.6,
    reviewCount: 167,
    tags: ["modern", "corner", "living-room", "spacious"]
  },
  {
    name: "Loveseat",
    brand: "Furniro",
    category: "Sofa",
    price: 4200000,
    imageUrl: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=300&fit=crop",
    description: "Compact 2-seater loveseat for cozy spaces",
    inStock: true,
    rating: 4.4,
    reviewCount: 98,
    tags: ["compact", "2-seater", "cozy", "intimate"]
  },
  {
    name: "Sectional Sofa",
    brand: "Furniro",
    category: "Sofa",
    price: 9800000,
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop",
    description: "Large sectional sofa with modular design",
    inStock: true,
    rating: 4.8,
    reviewCount: 189,
    tags: ["large", "sectional", "modular", "flexible"]
  },

  // Beds
  {
    name: "King Bed",
    brand: "Furniro",
    category: "Bed",
    price: 12000000,
    oldPrice: 15000000,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    description: "Luxury king-size bed with premium headboard",
    badge: { type: "discount", text: "-20%" },
    inStock: true,
    rating: 4.9,
    reviewCount: 278,
    tags: ["luxury", "king-size", "premium", "headboard"]
  },
  {
    name: "Queen Bed",
    brand: "Furniro",
    category: "Bed",
    price: 8500000,
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    description: "Elegant queen-size bed with storage drawers",
    badge: { type: "new", text: "New" },
    inStock: true,
    rating: 4.7,
    reviewCount: 145,
    tags: ["elegant", "queen-size", "storage", "drawers"]
  },
  {
    name: "Single Bed",
    brand: "Furniro",
    category: "Bed",
    price: 4200000,
    imageUrl: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=300&fit=crop",
    description: "Compact single bed perfect for guest rooms",
    inStock: true,
    rating: 4.3,
    reviewCount: 87,
    tags: ["compact", "single", "guest-room", "space-saving"]
  },
  {
    name: "Bunk Bed",
    brand: "Furniro",
    category: "Bed",
    price: 6800000,
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop",
    description: "Space-saving bunk bed for kids' rooms",
    inStock: true,
    rating: 4.5,
    reviewCount: 123,
    tags: ["space-saving", "bunk", "kids", "functional"]
  },

  // Storage
  {
    name: "Wardrobe",
    brand: "Furniro",
    category: "Storage",
    price: 5500000,
    oldPrice: 6800000,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    description: "Large wardrobe with sliding doors and multiple compartments",
    badge: { type: "discount", text: "-19%" },
    inStock: true,
    rating: 4.6,
    reviewCount: 198,
    tags: ["large", "sliding-doors", "compartments", "storage"]
  },
  {
    name: "Bookshelf",
    brand: "Furniro",
    category: "Storage",
    price: 2800000,
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    description: "Modern bookshelf with adjustable shelves",
    badge: { type: "new", text: "New" },
    inStock: true,
    rating: 4.4,
    reviewCount: 76,
    tags: ["modern", "adjustable", "shelves", "books"]
  },
  {
    name: "Chest of Drawers",
    brand: "Furniro",
    category: "Storage",
    price: 3200000,
    imageUrl: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=300&fit=crop",
    description: "Classic chest of drawers with smooth gliding mechanism",
    inStock: true,
    rating: 4.5,
    reviewCount: 134,
    tags: ["classic", "drawers", "smooth", "traditional"]
  },
  {
    name: "TV Stand",
    brand: "Furniro",
    category: "Storage",
    price: 2400000,
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop",
    description: "Sleek TV stand with cable management system",
    inStock: true,
    rating: 4.3,
    reviewCount: 92,
    tags: ["sleek", "tv-stand", "cable-management", "entertainment"]
  }
];

// Seeding function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/furniro';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB:', mongoURI);

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const createdProducts = await Product.insertMany(furnitureProducts);
    console.log(`Successfully seeded ${createdProducts.length} products`);

    // Display summary
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');
    
    console.log('\n=== SEEDING SUMMARY ===');
    console.log(`Total Products: ${createdProducts.length}`);
    console.log(`Categories: ${categories.join(', ')}`);
    console.log(`Brands: ${brands.join(', ')}`);
    
    // Category breakdown
    for (const category of categories) {
      const count = await Product.countDocuments({ category });
      console.log(`${category}: ${count} products`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, furnitureProducts };

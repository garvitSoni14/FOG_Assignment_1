# Furniro E-commerce Application - Complete Setup Guide

## 🚀 **Application Overview**

This is a fully functional e-commerce application for furniture sales with the following features:

### **Frontend Features:**
- ✅ Responsive navbar with glass effect on scroll
- ✅ Animated hero section with inspiring text
- ✅ Product grid with pagination
- ✅ Product cards with hover effects
- ✅ Add/Edit/Delete product functionality
- ✅ Filter bar with sorting options
- ✅ Features footer
- ✅ Mobile responsive design

### **Backend Features:**
- ✅ RESTful API with Express.js
- ✅ MongoDB database integration
- ✅ Server-side pagination
- ✅ Advanced filtering and sorting
- ✅ CRUD operations for products
- ✅ Input validation and error handling
- ✅ 20 pre-seeded furniture products

## 📋 **Prerequisites**

Before running the application, ensure you have:

1. **Node.js** (v14 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **npm** or **yarn** package manager

## 🛠️ **Installation & Setup**

### **1. Clone/Download the Project**
```bash
# Navigate to your project directory
cd Assignment1
```

### **2. Backend Setup**

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:4000`

### **3. Frontend Setup**

```bash
# Navigate to frontend directory (in a new terminal)
cd Frontend/frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### **4. Database Seeding (Optional)**

If you need to reset the database with fresh data:

```bash
# Navigate to backend directory
cd Backend

# Seed the database with 20 products
npm run seed
```

## 🎯 **Testing the Application**

### **1. Basic Functionality Test**

1. **Open the application** in your browser at `http://localhost:5173`
2. **Verify the navbar** - should show Furniro logo and navigation
3. **Check the hero section** - should display animated text
4. **View products** - should show 20 furniture products in a grid
5. **Test pagination** - should show page numbers and navigation

### **2. Product Management Test**

#### **Adding a Product:**
1. Click the **"Add Product"** button in the filter bar
2. Fill out the form with product details:
   - Name: "Test Chair"
   - Brand: "Furniro"
   - Category: "Chair"
   - Price: "2500000"
   - Description: "A beautiful test chair"
3. Click **"Add Product"**
4. Verify the product appears in the grid

#### **Editing a Product:**
1. Hover over any product card
2. Click the **blue edit icon**
3. Modify the product details
4. Click **"Update Product"**
5. Verify the changes are reflected

#### **Deleting a Product:**
1. Hover over any product card
2. Click the **red delete icon**
3. Confirm deletion in the dialog
4. Verify the product is removed

### **3. Pagination Test**

1. **Change page size** using the dropdown in pagination
2. **Navigate pages** using page numbers or Next/Previous buttons
3. **Verify results** show correct "Showing X-Y of Z products"

### **4. Responsive Design Test**

1. **Resize browser window** to test mobile responsiveness
2. **Check navbar** - should hide nav links on mobile
3. **Verify product grid** - should show 2 columns on mobile
4. **Test modals** - should work properly on all screen sizes

## 🔧 **API Endpoints**

The backend provides the following API endpoints:

### **Products**
- `GET /api/products` - Get products with filtering/pagination
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/bulk` - Bulk create products

### **Filter Options**
- `GET /api/products/filters` - Get available filter options
- `GET /api/products/pagination-options` - Get pagination options
- `GET /api/products/stats` - Get product statistics

### **Example API Calls**

```bash
# Get all products
curl http://localhost:4000/api/products

# Get products with pagination
curl "http://localhost:4000/api/products?page=1&limit=8"

# Get products by category
curl "http://localhost:4000/api/products?category=Chair"

# Get products sorted by price
curl "http://localhost:4000/api/products?sortBy=price&sortOrder=asc"

# Create a new product
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Sofa",
    "brand": "Furniro",
    "category": "Sofa",
    "price": 5000000,
    "description": "A comfortable test sofa",
    "imageUrl": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
  }'
```

## 🗄️ **Database Structure**

The application uses MongoDB with the following product schema:

```javascript
{
  name: String (required),
  brand: String (required),
  category: String (required),
  price: Number (required),
  oldPrice: Number,
  imageUrl: String (required),
  description: String,
  badge: {
    type: String (enum: ['discount', 'new', 'sale']),
    text: String
  },
  inStock: Boolean (default: true),
  rating: Number (0-5),
  reviewCount: Number,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 📱 **Mobile Responsiveness**

The application is fully responsive with breakpoints at:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: 360px - 479px

## 🎨 **Design Features**

- **Golden Theme**: Consistent brand colors (#B88E2F, #D4AF37)
- **Glass Effect**: Navbar becomes transparent on scroll
- **Smooth Animations**: Hover effects and transitions
- **Professional UI**: Clean, modern design
- **Loading States**: Visual feedback during operations

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **Backend not starting:**
   - Check if MongoDB is running
   - Verify port 4000 is not in use
   - Check console for error messages

2. **Frontend not connecting to backend:**
   - Ensure backend is running on port 4000
   - Check browser console for CORS errors
   - Verify API_BASE_URL in services/api.js

3. **Database connection issues:**
   - Check MongoDB connection string
   - Ensure MongoDB service is running
   - Verify network connectivity

4. **Products not loading:**
   - Run `npm run seed` to populate database
   - Check backend console for errors
   - Verify API endpoints are working

### **Reset Everything:**
```bash
# Stop all servers (Ctrl+C)
# Clear database and reseed
cd Backend
npm run seed

# Restart backend
npm run dev

# Restart frontend (in new terminal)
cd Frontend/frontend
npm run dev
```

## 📊 **Performance Features**

- **Server-side pagination** for large datasets
- **Optimized queries** with MongoDB indexes
- **Lazy loading** for better performance
- **Responsive images** with proper sizing
- **Efficient state management** with React hooks

## 🔒 **Security Features**

- **Input validation** on both frontend and backend
- **CORS protection** configured
- **Error handling** without exposing sensitive data
- **SQL injection protection** with Mongoose
- **XSS protection** with proper data sanitization

## 🚀 **Production Deployment**

For production deployment:

1. **Backend:**
   - Set up environment variables
   - Use production MongoDB instance
   - Configure proper CORS settings
   - Set up error logging

2. **Frontend:**
   - Build production bundle: `npm run build`
   - Deploy to static hosting (Netlify, Vercel, etc.)
   - Update API_BASE_URL for production

## 📝 **Development Notes**

- **Hot Reload**: Both frontend and backend support hot reload
- **Error Logging**: Check browser console and terminal for errors
- **API Testing**: Use Postman or curl for API testing
- **Database Management**: Use MongoDB Compass for database inspection

---

## ✅ **Verification Checklist**

- [ ] Backend server running on port 4000
- [ ] Frontend server running on port 5173
- [ ] Database connected and seeded with 20 products
- [ ] Products displaying in grid layout
- [ ] Pagination working correctly
- [ ] Add product functionality working
- [ ] Edit product functionality working
- [ ] Delete product functionality working
- [ ] Mobile responsiveness working
- [ ] All animations and effects working

**🎉 Your Furniro e-commerce application is now fully functional!**

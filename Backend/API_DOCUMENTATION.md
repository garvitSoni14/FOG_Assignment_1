# Furniro Backend API Documentation

## Overview
This backend provides comprehensive server-side sorting and filtering functionality for the Furniro furniture e-commerce platform.

## Base URL
```
http://localhost:4000/api
```

## API Endpoints

### 1. Get Products with Filtering & Sorting
**GET** `/products`

#### Query Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `brand` | string/array | Filter by brand name(s) | `brand=Furniro` or `brand=Furniro&brand=IKEA` |
| `category` | string/array | Filter by category | `category=Chair` or `category=Chair&category=Table` |
| `minPrice` | number | Minimum price filter | `minPrice=1000000` |
| `maxPrice` | number | Maximum price filter | `maxPrice=5000000` |
| `sortBy` | string | Sort field (name, brand, price, rating, createdAt) | `sortBy=price` |
| `sortOrder` | string | Sort direction (asc, desc) | `sortOrder=desc` |
| `page` | number | Page number (default: 1) | `page=2` |
| `limit` | number | Items per page (default: 16) | `limit=20` |
| `search` | string | Search in name, description, brand, category | `search=chair` |
| `inStock` | boolean | Filter by stock availability | `inStock=true` |
| `badge` | string | Filter by badge type (discount, new, sale) | `badge=discount` |
| `tags` | string/array | Filter by tags | `tags=modern` |
| `rating` | number | Minimum rating filter | `rating=4` |

#### Example Request
```
GET /api/products?brand=Furniro&category=Chair&minPrice=1000000&maxPrice=3000000&sortBy=price&sortOrder=asc&page=1&limit=16
```

#### Response
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "...",
        "name": "Syltherine",
        "brand": "Furniro",
        "category": "Chair",
        "price": 2500000,
        "oldPrice": 3500000,
        "imageUrl": "https://...",
        "description": "Stylish cafe chair...",
        "badge": {
          "type": "discount",
          "text": "-30%"
        },
        "inStock": true,
        "rating": 4.5,
        "reviewCount": 128,
        "tags": ["modern", "comfortable"],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 48,
      "itemsPerPage": 16,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "filters": {
      "appliedFilters": {
        "brand": "Furniro",
        "category": "Chair",
        "priceRange": {
          "min": 1000000,
          "max": 3000000
        },
        "search": null,
        "inStock": null,
        "badge": null,
        "tags": null,
        "rating": null
      }
    }
  }
}
```

### 2. Get Filter Options
**GET** `/products/filters`

#### Response
```json
{
  "success": true,
  "data": {
    "brands": ["Furniro", "IKEA", "West Elm"],
    "categories": ["Chair", "Table", "Sofa", "Bed", "Storage"],
    "priceRange": {
      "minPrice": 1000000,
      "maxPrice": 15000000,
      "avgPrice": 4500000
    },
    "tags": ["modern", "comfortable", "luxury", "compact"],
    "badgeTypes": ["discount", "new", "sale"],
    "ratingStats": {
      "avgRating": 4.5,
      "maxRating": 5.0,
      "minRating": 3.8
    }
  }
}
```

### 3. Get Product Statistics
**GET** `/products/stats`

#### Response
```json
{
  "success": true,
  "data": {
    "totalProducts": 48,
    "inStockProducts": 45,
    "outOfStockProducts": 3,
    "categoryStats": [
      {
        "_id": "Chair",
        "count": 12,
        "avgPrice": 2400000
      }
    ],
    "brandStats": [
      {
        "_id": "Furniro",
        "count": 48,
        "avgPrice": 4500000
      }
    ]
  }
}
```

### 4. Get Single Product
**GET** `/products/:id`

#### Response
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Syltherine",
    "brand": "Furniro",
    "category": "Chair",
    "price": 2500000,
    "oldPrice": 3500000,
    "imageUrl": "https://...",
    "description": "Stylish cafe chair...",
    "badge": {
      "type": "discount",
      "text": "-30%"
    },
    "inStock": true,
    "rating": 4.5,
    "reviewCount": 128,
    "tags": ["modern", "comfortable"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Create Product
**POST** `/products`

#### Request Body
```json
{
  "name": "New Chair",
  "brand": "Furniro",
  "category": "Chair",
  "price": 2000000,
  "oldPrice": 2500000,
  "imageUrl": "https://...",
  "description": "Description here",
  "badge": {
    "type": "new",
    "text": "New"
  },
  "inStock": true,
  "rating": 4.0,
  "reviewCount": 0,
  "tags": ["modern", "new"]
}
```

### 6. Update Product
**PUT** `/products/:id`

#### Request Body
```json
{
  "name": "Updated Chair",
  "price": 2200000,
  "inStock": false
}
```

### 7. Delete Product
**DELETE** `/products/:id`

#### Response
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "id": "..."
  }
}
```

### 8. Bulk Create Products
**POST** `/products/bulk`

#### Request Body
```json
{
  "products": [
    {
      "name": "Product 1",
      "brand": "Furniro",
      "category": "Chair",
      "price": 2000000,
      "imageUrl": "https://..."
    },
    {
      "name": "Product 2",
      "brand": "Furniro",
      "category": "Table",
      "price": 3000000,
      "imageUrl": "https://..."
    }
  ]
}
```

## Sorting Options

### Available Sort Fields
- `name` - Product name (alphabetical)
- `brand` - Brand name (alphabetical)
- `price` - Price (numerical)
- `rating` - Average rating (numerical)
- `createdAt` - Creation date (chronological)
- `updatedAt` - Last update date (chronological)

### Sort Orders
- `asc` - Ascending order
- `desc` - Descending order

### Default Sorting
- If no `sortBy` is specified, products are sorted by `createdAt` in descending order (newest first)
- When sorting by `name` or `brand`, a secondary sort by `price` (ascending) is applied

## Filtering Options

### Brand Filtering
- Single brand: `?brand=Furniro`
- Multiple brands: `?brand=Furniro&brand=IKEA`

### Category Filtering
- Single category: `?category=Chair`
- Multiple categories: `?category=Chair&category=Table`

### Price Range Filtering
- Minimum price: `?minPrice=1000000`
- Maximum price: `?maxPrice=5000000`
- Range: `?minPrice=1000000&maxPrice=5000000`

### Search Functionality
- Searches across: name, description, brand, category
- Case-insensitive partial matching
- Example: `?search=chair` will find "Chair", "Cafe Chair", etc.

### Stock Filtering
- In stock only: `?inStock=true`
- Out of stock only: `?inStock=false`

### Badge Filtering
- Filter by badge type: `?badge=discount`
- Available types: `discount`, `new`, `sale`

### Tag Filtering
- Single tag: `?tags=modern`
- Multiple tags: `?tags=modern&tags=comfortable`

### Rating Filtering
- Minimum rating: `?rating=4` (finds products with 4+ stars)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Database Seeding

To populate the database with sample furniture data:

```bash
npm run seed
```

This will:
1. Clear existing products
2. Insert 20+ furniture products across different categories
3. Display seeding summary

## Environment Variables

Create a `.env` file in the Backend directory:

```
MONGO_URI=mongodb://localhost:27017/furniro
PORT=4000
```

## Running the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

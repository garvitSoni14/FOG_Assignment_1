// Quick API Test Script
const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000/api';

async function testAPI() {
  console.log('🧪 Testing Furniro API Endpoints...\n');

  try {
    // Test 1: Get all products
    console.log('1️⃣ Testing GET /api/products...');
    const productsResponse = await axios.get(`${API_BASE_URL}/products`);
    console.log(`✅ Found ${productsResponse.data.data.products.length} products`);
    console.log(`📄 Pagination: ${productsResponse.data.data.pagination.showing}\n`);

    // Test 2: Get filter options
    console.log('2️⃣ Testing GET /api/products/filters...');
    const filtersResponse = await axios.get(`${API_BASE_URL}/products/filters`);
    console.log(`✅ Brands: ${filtersResponse.data.data.brands.join(', ')}`);
    console.log(`✅ Categories: ${filtersResponse.data.data.categories.join(', ')}\n`);

    // Test 3: Get pagination options
    console.log('3️⃣ Testing GET /api/products/pagination-options...');
    const paginationResponse = await axios.get(`${API_BASE_URL}/products/pagination-options`);
    console.log(`✅ Total products: ${paginationResponse.data.data.totalProducts}`);
    console.log(`✅ Page size options: ${paginationResponse.data.data.pageSizeOptions.map(opt => opt.label).join(', ')}\n`);

    // Test 4: Test filtering by category
    console.log('4️⃣ Testing filtering by category...');
    const chairResponse = await axios.get(`${API_BASE_URL}/products?category=Chair`);
    console.log(`✅ Found ${chairResponse.data.data.products.length} chairs\n`);

    // Test 5: Test sorting by price
    console.log('5️⃣ Testing sorting by price...');
    const sortedResponse = await axios.get(`${API_BASE_URL}/products?sortBy=price&sortOrder=asc&limit=3`);
    console.log(`✅ Cheapest products:`);
    sortedResponse.data.data.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ₹${product.price.toLocaleString()}`);
    });
    console.log('');

    // Test 6: Test pagination
    console.log('6️⃣ Testing pagination...');
    const pageResponse = await axios.get(`${API_BASE_URL}/products?page=1&limit=8`);
    console.log(`✅ Page 1: ${pageResponse.data.data.pagination.showing}`);
    console.log(`✅ Total pages: ${pageResponse.data.data.pagination.totalPages}\n`);

    // Test 7: Get single product
    if (productsResponse.data.data.products.length > 0) {
      console.log('7️⃣ Testing GET single product...');
      const firstProduct = productsResponse.data.data.products[0];
      const singleResponse = await axios.get(`${API_BASE_URL}/products/${firstProduct._id}`);
      console.log(`✅ Retrieved: ${singleResponse.data.data.name}\n`);
    }

    // Test 8: Test product statistics
    console.log('8️⃣ Testing product statistics...');
    const statsResponse = await axios.get(`${API_BASE_URL}/products/stats`);
    console.log(`✅ Total products: ${statsResponse.data.data.totalProducts}`);
    console.log(`✅ In stock: ${statsResponse.data.data.inStockProducts}`);
    console.log(`✅ Out of stock: ${statsResponse.data.data.outOfStockProducts}\n`);

    console.log('🎉 All API tests passed successfully!');
    console.log('🚀 Your Furniro backend is fully functional!');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testAPI();

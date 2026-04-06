# Backend Test Plan for Royals Decording E-commerce Platform

## 1. Test Environment Setup

### 1.1 Prerequisites
- Node.js v16+
- MongoDB instance running
- Environment variables configured
- Test database setup

### 1.2 Test Data
- Seed database with test products, categories, and brands
- Create test users with different roles (customer, admin)
- Prepare test orders and cart items

## 2. Authentication API Tests

### 2.1 User Registration
- [ ] POST /api/auth/register with valid data
- [ ] Verify user is created in database
- [ ] Verify JWT token is returned
- [ ] Verify password is properly hashed
- [ ] POST /api/auth/register with duplicate email
- [ ] Verify appropriate error is returned
- [ ] POST /api/auth/register with invalid data
- [ ] Verify validation errors are returned

### 2.2 User Login
- [ ] POST /api/auth/login with valid credentials
- [ ] Verify JWT token is returned
- [ ] Verify user data is returned (without password)
- [ ] POST /api/auth/login with invalid credentials
- [ ] Verify appropriate error is returned
- [ ] POST /api/auth/login with missing fields
- [ ] Verify validation errors are returned

### 2.3 Get Current User
- [ ] GET /api/auth/user with valid token
- [ ] Verify user data is returned
- [ ] GET /api/auth/user without token
- [ ] Verify guest user data is returned
- [ ] GET /api/auth/user with invalid token
- [ ] Verify appropriate error is returned

### 2.4 Update Profile
- [ ] PUT /api/auth/profile with valid token and data
- [ ] Verify profile is updated in database
- [ ] PUT /api/auth/profile without token
- [ ] Verify 401 error is returned
- [ ] PUT /api/auth/profile with invalid data
- [ ] Verify validation errors are returned

### 2.5 Change Password
- [ ] PUT /api/auth/password with valid current password
- [ ] Verify password is updated in database
- [ ] PUT /api/auth/password with invalid current password
- [ ] Verify appropriate error is returned
- [ ] PUT /api/auth/password without authentication
- [ ] Verify 401 error is returned

## 3. Product API Tests

### 3.1 Get Products
- [ ] GET /api/products
- [ ] Verify products list is returned
- [ ] GET /api/products with filters (category, brand, search)
- [ ] Verify filtered results are returned
- [ ] GET /api/products with pagination
- [ ] Verify pagination works correctly

### 3.2 Get Featured Products
- [ ] GET /api/products/featured
- [ ] Verify featured products are returned
- [ ] GET /api/products/featured with limit
- [ ] Verify correct number of products returned

### 3.3 Get Product by ID
- [ ] GET /api/products/{id} with valid ID
- [ ] Verify product details are returned
- [ ] GET /api/products/{id} with invalid ID
- [ ] Verify 404 error is returned
- [ ] GET /api/products/{id} with non-existent ID
- [ ] Verify 404 error is returned

### 3.4 Get Product by Slug
- [ ] GET /api/products/slug/{slug} with valid slug
- [ ] Verify product details are returned
- [ ] GET /api/products/slug/{slug} with invalid slug
- [ ] Verify 404 error is returned

## 4. Category and Brand API Tests

### 4.1 Get Categories
- [ ] GET /api/categories
- [ ] Verify categories list is returned
- [ ] GET /api/categories/{slug}
- [ ] Verify category details are returned

### 4.2 Get Brands
- [ ] GET /api/brands
- [ ] Verify brands list is returned
- [ ] GET /api/brands/{slug}
- [ ] Verify brand details are returned

## 5. Cart API Tests

### 5.1 Get Cart Items
- [ ] GET /api/cart with valid token
- [ ] Verify user's cart items are returned
- [ ] GET /api/cart without token
- [ ] Verify guest cart items are returned

### 5.2 Add to Cart
- [ ] POST /api/cart with valid product ID and quantity
- [ ] Verify item is added to cart
- [ ] POST /api/cart with invalid product ID
- [ ] Verify appropriate error is returned
- [ ] POST /api/cart without authentication
- [ ] Verify item is added to guest cart

### 5.3 Update Cart Item
- [ ] PATCH /api/cart/{id} with valid quantity
- [ ] Verify cart item quantity is updated
- [ ] PATCH /api/cart/{id} with invalid ID
- [ ] Verify appropriate error is returned
- [ ] PATCH /api/cart/{id} without authentication
- [ ] Verify 401 error is returned

### 5.4 Remove from Cart
- [ ] DELETE /api/cart/{id} with valid item ID
- [ ] Verify item is removed from cart
- [ ] DELETE /api/cart/{id} with invalid ID
- [ ] Verify appropriate error is returned

### 5.5 Clear Cart
- [ ] DELETE /api/cart with valid authentication
- [ ] Verify all cart items are removed
- [ ] DELETE /api/cart without authentication
- [ ] Verify 401 error is returned

## 6. Order API Tests

### 6.1 Get Orders
- [ ] GET /api/orders with valid token
- [ ] Verify user's orders are returned
- [ ] GET /api/orders without token
- [ ] Verify 401 error is returned

### 6.2 Create Order
- [ ] POST /api/orders with valid cart items and shipping info
- [ ] Verify order is created in database
- [ ] Verify order items are created
- [ ] Verify cart is cleared after order creation
- [ ] Verify confirmation emails are sent
- [ ] POST /api/orders without authentication
- [ ] Verify 401 error is returned
- [ ] POST /api/orders with missing required fields
- [ ] Verify validation errors are returned
- [ ] POST /api/orders with invalid product IDs
- [ ] Verify appropriate errors are returned

### 6.3 Get Order by ID
- [ ] GET /api/orders/{id} with valid order ID
- [ ] Verify order details are returned
- [ ] GET /api/orders/{id} with invalid ID
- [ ] Verify 404 error is returned
- [ ] GET /api/orders/{id} for another user's order
- [ ] Verify appropriate access control

## 7. Admin API Tests

### 7.1 Admin Authentication
- [ ] GET /api/admin/products without admin authentication
- [ ] Verify 401 or 403 error is returned
- [ ] GET /api/admin/products with non-admin user
- [ ] Verify 403 error is returned

### 7.2 Admin Product Management
- [ ] GET /api/admin/products with admin authentication
- [ ] Verify all products are returned
- [ ] POST /api/admin/products with valid data
- [ ] Verify product is created
- [ ] PUT /api/admin/products/{id} with valid data
- [ ] Verify product is updated
- [ ] DELETE /api/admin/products/{id}
- [ ] Verify product is deleted

### 7.3 Admin Order Management
- [ ] GET /api/admin/orders with admin authentication
- [ ] Verify all orders are returned
- [ ] PATCH /api/admin/orders/{id}/status with valid status
- [ ] Verify order status is updated
- [ ] GET /api/admin/orders/{id} with valid order ID
- [ ] Verify order details are returned

## 8. Wishlist API Tests

### 8.1 Get Wishlist
- [ ] GET /api/wishlist with valid token
- [ ] Verify user's wishlist items are returned

### 8.2 Add to Wishlist
- [ ] POST /api/wishlist with valid product ID
- [ ] Verify item is added to wishlist

### 8.3 Remove from Wishlist
- [ ] DELETE /api/wishlist/{productId} with valid product ID
- [ ] Verify item is removed from wishlist

## 9. Performance Tests

### 9.1 API Response Times
- [ ] Product listing API response under 500ms
- [ ] Product detail API response under 300ms
- [ ] Cart operations API response under 200ms
- [ ] Order creation API response under 1 second

### 9.2 Database Queries
- [ ] Verify database indexes are used for common queries
- [ ] Verify query performance for large datasets

## 10. Security Tests

### 10.1 Authentication Security
- [ ] Verify JWT tokens expire correctly
- [ ] Verify tokens cannot be tampered with
- [ ] Verify password reset flow is secure

### 10.2 Input Validation
- [ ] Verify all API endpoints validate input data
- [ ] Verify protection against injection attacks
- [ ] Verify rate limiting is implemented

### 10.3 Access Control
- [ ] Verify users cannot access other users' data
- [ ] Verify admin endpoints require admin privileges
- [ ] Verify proper error messages for unauthorized access

## 11. Error Handling Tests

### 11.1 Database Errors
- [ ] Simulate database connection failures
- [ ] Verify appropriate error responses
- [ ] Verify application recovers gracefully

### 11.2 Validation Errors
- [ ] Send invalid data to API endpoints
- [ ] Verify validation errors are returned in consistent format
- [ ] Verify error messages are helpful

## 12. Integration Tests

### 12.1 End-to-End Flows
- [ ] User registration → Login → Add to cart → Checkout → View order
- [ ] Admin login → Create product → User purchases product → Admin updates order status
- [ ] User adds items to wishlist → Moves to cart → Checkout

## 13. Test Execution Schedule

### 13.1 Unit Tests (Run on every code change)
- All individual API endpoint tests
- Authentication and authorization tests
- Data validation tests

### 13.2 Integration Tests (Run daily)
- End-to-end user flows
- Admin functionality tests
- Performance tests

### 13.3 Regression Tests (Run weekly)
- All tests in this plan
- Security tests
- Load testing

## 14. Test Data Management

### 14.1 Test Database
- Use separate test database
- Reset database state between test runs
- Seed consistent test data for reproducible tests

### 14.2 Test Cleanup
- Clean up test data after each test run
- Archive test results for analysis
- Monitor test coverage metrics
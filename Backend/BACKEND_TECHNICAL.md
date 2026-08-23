# Inventory Management System

## FastAPI Backend — Technical Guide & Architecture

---

# 1. Project Goal

We are building a production-style Inventory Management System for a small business.

The backend will provide a REST API for the frontend dashboard.

The frontend will communicate with the backend using HTTP requests and JSON.

The backend will handle:

* Authentication
* Authorization
* Users
* Products
* Categories
* Inventory
* Sales
* Dashboard statistics
* Search
* Filtering
* Pagination
* Validation
* Database operations
* Error handling
* Testing
* Deployment

The frontend should never communicate directly with PostgreSQL.

The architecture is:

```text
React Frontend
      │
      │ HTTP / JSON
      ▼
   FastAPI
      │
      ▼
  Pydantic
      │
      ▼
 Service Layer
      │
      ▼
 SQLAlchemy
      │
      ▼
 PostgreSQL
```

---

# 2. Technologies

## Core

### FastAPI

The web framework used to build the REST API.

Responsibilities:

* Define routes
* Receive HTTP requests
* Return HTTP responses
* Dependency injection
* Authentication integration
* Request handling
* OpenAPI documentation

Example:

```python
@router.get("/products")
def get_products():
    ...
```

FastAPI is the API layer.

---

### Pydantic

Used for validating and structuring API data.

Responsibilities:

* Request validation
* Response validation
* Data serialization
* Type checking

Example:

```python
class ProductCreate(BaseModel):
    name: str
    price: float
    stock: int
```

If the frontend sends invalid data, Pydantic/FastAPI can reject it before it reaches the database.

---

### SQLAlchemy

Used to communicate with the database through Python.

Responsibilities:

* Define database models
* Create queries
* Insert records
* Update records
* Delete records
* Relationships
* Transactions

Example:

```python
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    price = Column(Float)
```

SQLAlchemy is the database interaction layer.

---

### PostgreSQL

The actual production database.

It stores:

```text
users
categories
products
inventory_transactions
sales
sale_items
```

SQLAlchemy communicates with PostgreSQL.

---

### Alembic

Database migration system for SQLAlchemy.

Used when the database structure changes.

Example:

```text
Before:

Product
- id
- name
- price

After:

Product
- id
- name
- price
- minimum_stock
```

Instead of manually changing the production database, Alembic creates a migration.

Basic workflow:

```text
Change SQLAlchemy model
        ↓
Create migration
        ↓
Review migration
        ↓
Run migration
        ↓
Database updated
```

---

### Uvicorn

The ASGI server used to run the FastAPI application.

Development:

```bash
uvicorn app.main:app --reload
```

It runs the FastAPI application.

---

### JWT

Used for authentication.

Basic flow:

```text
User logs in
     ↓
Backend verifies password
     ↓
Backend creates JWT
     ↓
Frontend receives token
     ↓
Frontend sends token with requests
     ↓
Backend verifies token
     ↓
Protected endpoint executes
```

Example request:

```text
Authorization: Bearer <token>
```

JWT answers:

> "Who is making this request?"

It does NOT by itself answer:

> "Is this user allowed to do this?"

That is authorization.

---

### Password Hashing

Passwords must never be stored as plain text.

Bad:

```text
password = "mypassword123"
```

Database:

```text
mypassword123
```

Good:

```text
password = "mypassword123"
        ↓
password hash
        ↓
database
```

During login:

```text
Entered password
       ↓
Compare with stored hash
       ↓
Correct?
       ↓
Create JWT
```

For a modern project, use a dedicated password-hashing library rather than implementing hashing yourself.

---

### pytest

Used for automated backend tests.

We will test:

```text
Authentication
Products
Categories
Inventory
Sales
Permissions
Validation
```

---

### Docker

Used to make the application easier to run consistently and deploy.

Eventually:

```text
Docker
 ├── FastAPI
 └── Application dependencies
```

PostgreSQL can also run in Docker during development.

---

# 3. What We Already Know

From previous Flask/SQLAlchemy work, the following concepts should already be familiar:

```text
Python
HTTP basics
Routes
CRUD
SQLAlchemy
Models
Database
Relationships
Environment variables
Git/GitHub
```

We do NOT need to relearn these from zero.

Instead, we need to understand how they fit into FastAPI.

---

# 4. What Is New in FastAPI

The important new concepts are:

```text
FastAPI application
Routers
Pydantic schemas
Dependency Injection
Depends()
Request/Response models
Authentication dependencies
OpenAPI
Async/await
API error handling
```

These are the areas we should focus on.

---

# 5. FastAPI vs Flask + Jinja

Previous Flask architecture:

```text
Browser
   ↓
Flask
   ↓
SQLAlchemy
   ↓
Database

Flask
   ↓
Jinja
   ↓
HTML
```

Our new architecture:

```text
React
   ↓
HTTP
   ↓
FastAPI
   ↓
SQLAlchemy
   ↓
PostgreSQL
```

There is no Jinja.

FastAPI returns JSON instead of rendering HTML pages.

Example:

```json
{
    "id": 1,
    "name": "Keyboard",
    "price": 120,
    "stock": 15
}
```

---

# 6. SQLAlchemy vs Pydantic

This distinction is extremely important.

## SQLAlchemy Model

Describes how data is stored in the database.

```python
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    price = Column(Float)
    stock = Column(Integer)
```

Meaning:

> This is a database table.

---

## Pydantic Schema

Describes how API data should look.

```python
class ProductCreate(BaseModel):
    name: str
    price: float
    stock: int
```

Meaning:

> This is the data the API accepts.

Another schema:

```python
class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    stock: int
```

Meaning:

> This is the data the API returns.

Therefore:

```text
SQLAlchemy Model
      =
Database structure

Pydantic Schema
      =
API data structure
```

They may contain similar fields, but they have different responsibilities.

---

# 7. Request → Backend → Database → Response

Example:

The frontend wants to create a product.

```text
POST /api/products
```

Frontend sends:

```json
{
    "name": "Keyboard",
    "price": 120,
    "stock": 50,
    "minimum_stock": 10
}
```

FastAPI receives the request.

```text
FastAPI
   ↓
Pydantic validation
```

If valid:

```text
Pydantic
   ↓
Service
```

The service performs business logic.

```text
Service
   ↓
SQLAlchemy
```

SQLAlchemy creates the database record.

```text
SQLAlchemy
   ↓
PostgreSQL
```

Database returns the created product.

Then:

```text
PostgreSQL
   ↓
SQLAlchemy
   ↓
Service
   ↓
FastAPI
   ↓
Pydantic Response
   ↓
JSON
```

Frontend receives:

```json
{
    "id": 1,
    "name": "Keyboard",
    "price": 120,
    "stock": 50,
    "minimum_stock": 10
}
```

---

# 8. Project Architecture

The backend will use a layered structure.

```text
backend/
│
├── app/
│   │
│   ├── main.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── dependencies.py
│   │
│   ├── database/
│   │   ├── database.py
│   │   └── models/
│   │       ├── user.py
│   │       ├── category.py
│   │       ├── product.py
│   │       ├── inventory.py
│   │       ├── sale.py
│   │       └── sale_item.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── category.py
│   │   ├── product.py
│   │   ├── inventory.py
│   │   ├── sale.py
│   │   └── dashboard.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── categories.py
│   │   ├── products.py
│   │   ├── inventory.py
│   │   ├── sales.py
│   │   └── dashboard.py
│   │
│   └── services/
│       ├── auth.py
│       ├── products.py
│       ├── inventory.py
│       ├── sales.py
│       └── dashboard.py
│
├── tests/
│   ├── test_auth.py
│   ├── test_products.py
│   ├── test_inventory.py
│   └── test_sales.py
│
├── alembic/
│
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
├── Dockerfile
└── README.md
```

---

# 9. What Each Folder Does

## app/main.py

Application entry point.

Responsibilities:

* Create FastAPI app
* Register routers
* Configure middleware
* Configure CORS
* Register startup configuration if necessary

It should NOT contain all application logic.

---

# 10. core/

Application-wide configuration and security.

## config.py

Loads environment variables and application configuration.

Examples:

```text
DATABASE_URL
JWT_SECRET_KEY
JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES
```

Never hard-code secrets.

---

## security.py

Security-related functionality.

Examples:

```text
Password hashing
Password verification
JWT creation
JWT decoding
```

---

## dependencies.py

Reusable FastAPI dependencies.

Examples:

```text
get_db()
get_current_user()
require_admin()
```

This is where FastAPI's dependency injection becomes important.

---

# 11. database/

Database-specific code.

## database.py

Responsible for:

```text
Database engine
Session
Base
Database connection
```

Conceptually:

```text
FastAPI
   ↓
get_db()
   ↓
SQLAlchemy Session
   ↓
PostgreSQL
```

---

# 12. database/models/

These are SQLAlchemy models.

Examples:

```text
User
Category
Product
InventoryTransaction
Sale
SaleItem
```

These describe database tables and relationships.

---

# 13. schemas/

These are Pydantic models.

For Product, we may have:

```text
ProductCreate
ProductUpdate
ProductResponse
ProductListResponse
```

Different API operations can require different schemas.

Example:

Creating:

```json
{
    "name": "Keyboard",
    "price": 120,
    "stock": 50
}
```

Updating:

```json
{
    "price": 110
}
```

Response:

```json
{
    "id": 1,
    "name": "Keyboard",
    "price": 110,
    "stock": 50
}
```

---

# 14. routers/

Routers define API endpoints.

Example:

```text
routers/products.py
```

contains:

```text
GET    /products
GET    /products/{id}
POST   /products
PATCH  /products/{id}
DELETE /products/{id}
```

Routers should handle HTTP concerns.

They should not become giant files containing all business logic.

---

# 15. services/

Services contain business logic.

Example:

Creating a sale is more than:

```text
INSERT sale
```

We may need to:

```text
Check product exists
        ↓
Check stock
        ↓
Calculate total
        ↓
Create sale
        ↓
Create sale items
        ↓
Decrease inventory
        ↓
Create inventory transaction
        ↓
Commit transaction
```

That logic belongs in a service.

Example:

```text
routers/sales.py
        ↓
services/sales.py
        ↓
database
```

This keeps the router clean.

---

# 16. Dependency Injection

FastAPI's dependency system allows reusable logic to be injected into endpoints.

Example:

```python
@router.get("/products")
def get_products(
    db: Session = Depends(get_db)
):
    ...
```

Conceptually:

```text
Endpoint needs database
        ↓
FastAPI calls get_db()
        ↓
Database session is provided
        ↓
Endpoint executes
```

Later:

```python
@router.post("/products")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    ...
```

Now the endpoint receives:

```text
validated product
database session
authenticated user
```

without manually creating them inside the function.

---

# 17. Authentication vs Authorization

These are different.

## Authentication

Question:

> Who are you?

Example:

```text
Login
 ↓
Email + password
 ↓
JWT
```

---

## Authorization

Question:

> What are you allowed to do?

Example:

```text
ADMIN
 ├── create product
 ├── delete product
 ├── manage users
 └── view dashboard

STAFF
 ├── view products
 ├── create sales
 └── update inventory
```

Authentication:

```text
User is Esmira
```

Authorization:

```text
Esmira is ADMIN
```

---

# 18. JWT Flow

```text
POST /api/auth/login
        ↓
Verify email
        ↓
Verify password
        ↓
Create access token
        ↓
Return token
```

Frontend sends:

```text
Authorization: Bearer <token>
```

Protected endpoint:

```text
Request
   ↓
Extract token
   ↓
Decode token
   ↓
Find user
   ↓
Check permissions
   ↓
Execute endpoint
```

---

# 19. Roles

Initial roles:

```text
ADMIN
STAFF
```

We can expand this later if needed.

Example:

```text
require_admin()
```

can protect administrative operations.

---

# 20. Database Design

Initial entities:

```text
User
Category
Product
InventoryTransaction
Sale
SaleItem
```

Relationships:

```text
Category
   │
   └── Product
          │
          ├── InventoryTransaction
          │
          └── SaleItem
                    │
                    └── Sale
```

---

# 21. Product

Important fields:

```text
id
name
description
price
stock_quantity
minimum_stock
category_id
created_at
updated_at
```

Low-stock condition:

```text
stock_quantity <= minimum_stock
```

Example:

```text
stock = 5
minimum_stock = 10

LOW STOCK
```

---

# 22. Inventory

Do not only store the current stock.

We should also keep inventory history.

Example:

```text
InventoryTransaction

id
product_id
type
quantity
created_at
user_id
```

Types:

```text
STOCK_IN
STOCK_OUT
SALE
```

Example history:

```text
Keyboard

+50 STOCK_IN
-3  SALE
+20 STOCK_IN
-2  STOCK_OUT
```

Current stock can be maintained on Product while transactions provide an audit history.

---

# 23. Sales

A sale can contain multiple products.

Example:

```text
Sale #1001

Keyboard × 2
Mouse × 1
Monitor × 1
```

Therefore:

```text
Sale
  ↓
SaleItem
  ↓
Product
```

A SaleItem contains information such as:

```text
sale_id
product_id
quantity
unit_price
```

The unit price should be stored on the sale item so historical sales do not change when the product's current price changes.

---

# 24. API Structure

Base URL:

```text
/api
```

Authentication:

```text
POST /api/auth/login
GET  /api/auth/me
```

Users:

```text
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PATCH  /api/users/{id}
DELETE /api/users/{id}
```

Categories:

```text
GET    /api/categories
GET    /api/categories/{id}
POST   /api/categories
PATCH  /api/categories/{id}
DELETE /api/categories/{id}
```

Products:

```text
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PATCH  /api/products/{id}
DELETE /api/products/{id}
```

Inventory:

```text
GET  /api/inventory
POST /api/inventory/in
POST /api/inventory/out
GET  /api/inventory/low-stock
```

Sales:

```text
GET  /api/sales
GET  /api/sales/{id}
POST /api/sales
```

Dashboard:

```text
GET /api/dashboard/summary
GET /api/dashboard/sales
GET /api/dashboard/top-products
GET /api/dashboard/low-stock
```

---

# 25. Search, Filtering and Pagination

The frontend dashboard will need more than:

```text
GET /products
```

Eventually:

```text
GET /products?search=keyboard
```

Filtering:

```text
GET /products?category_id=3
```

Low stock:

```text
GET /products?low_stock=true
```

Pagination:

```text
GET /products?page=1&limit=20
```

Combined:

```text
GET /products?search=keyboard&category_id=3&page=1&limit=20
```

These should be implemented after the basic product endpoints work.

---

# 26. Dashboard Statistics

The dashboard may display:

```text
Total Products
Total Stock
Low Stock Products
Total Sales
Today's Sales
Revenue
Top Products
Recent Sales
```

These should come from backend endpoints rather than being calculated manually by the frontend from thousands of records.

Example:

```text
GET /api/dashboard/summary
```

Response:

```json
{
    "total_products": 120,
    "low_stock_products": 8,
    "total_sales": 350,
    "revenue": 24500
}
```

---

# 27. HTTP Status Codes

We should understand the important status codes.

```text
200 OK
```

Successful request.

```text
201 Created
```

Successfully created something.

```text
204 No Content
```

Successful operation with no response body.

```text
400 Bad Request
```

Invalid request.

```text
401 Unauthorized
```

User is not authenticated.

```text
403 Forbidden
```

User is authenticated but does not have permission.

```text
404 Not Found
```

Resource does not exist.

```text
409 Conflict
```

Request conflicts with existing data.

```text
422 Unprocessable Entity
```

Validation failed.

```text
500 Internal Server Error
```

Unexpected server error.

---

# 28. Error Handling

API errors should be predictable.

Example:

```json
{
    "detail": "Product not found"
}
```

Frontend should be able to handle errors consistently.

We should not expose internal database errors or secrets to users.

---

# 29. Environment Variables

Secrets and environment-specific configuration belong in `.env`.

Example:

```text
DATABASE_URL=...
JWT_SECRET_KEY=...
JWT_ALGORITHM=...
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

`.env` must NOT be committed to Git.

`.env.example` should contain placeholders:

```text
DATABASE_URL=
JWT_SECRET_KEY=
JWT_ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
```

---

# 30. CORS

The frontend and backend may run on different origins during development.

Example:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:8000
```

The backend needs CORS configuration to allow the frontend to communicate with it.

In production, allowed origins should be restricted to the actual frontend domain.

Do not blindly allow every origin in production.

---

# 31. Transactions

Some operations require multiple database changes to succeed together.

Example:

Creating a sale:

```text
Create Sale
Create SaleItems
Decrease Product Stock
Create InventoryTransaction
```

If one operation fails, we should avoid leaving the database half-updated.

Conceptually:

```text
BEGIN
 ↓
Create sale
 ↓
Create items
 ↓
Update stock
 ↓
Create transaction
 ↓
COMMIT
```

If something fails:

```text
ROLLBACK
```

This is especially important for inventory and sales.

---

# 32. Testing Strategy

Tests should cover behavior, not just whether functions execute.

Examples:

```text
Authentication

✓ valid login
✓ invalid password
✓ nonexistent user
✓ protected endpoint without token
✓ protected endpoint with valid token
✓ staff cannot access admin endpoint
```

Products:

```text
✓ create product
✓ get product
✓ update product
✓ delete product
✓ invalid product
✓ nonexistent product
```

Inventory:

```text
✓ add stock
✓ remove stock
✓ insufficient stock
✓ low-stock detection
```

Sales:

```text
✓ create sale
✓ stock decreases after sale
✓ insufficient stock prevents sale
✓ sale total calculated correctly
```

---

# 33. Deployment Architecture

Final architecture:

```text
                 INTERNET
                     │
                     ▼
              React Frontend
                     │
                  HTTPS
                     │
                     ▼
              FastAPI Backend
                     │
             ┌───────┴───────┐
             │               │
             ▼               ▼
        PostgreSQL        External
         Database          Services
```

The backend should be configured through environment variables.

Production should use:

```text
PostgreSQL
HTTPS
Environment secrets
Production server
Docker
Database migrations
CORS restrictions
```

---

# 34. Development Order

We should NOT build everything randomly.

Use this order:

## Phase 1 — Foundation

```text
FastAPI project
Application structure
Routers
Configuration
Environment variables
CORS
Health endpoint
Swagger/OpenAPI
```

---

## Phase 2 — Database

```text
PostgreSQL
SQLAlchemy
Database connection
Models
Relationships
Alembic
Migrations
```

---

## Phase 3 — Pydantic

```text
Request schemas
Response schemas
Validation
Serialization
```

---

## Phase 4 — Products

```text
Create product
Get products
Get product
Update product
Delete product
Categories
Search
Filtering
Pagination
```

---

## Phase 5 — Authentication

```text
User model
Password hashing
Login
JWT
Current user
Protected routes
Roles
Authorization
```

---

## Phase 6 — Inventory

```text
Stock in
Stock out
Inventory transactions
Low-stock detection
Transactions
```

---

## Phase 7 — Sales

```text
Create sale
Sale items
Stock reduction
Transaction handling
Sales history
```

---

## Phase 8 — Dashboard

```text
Statistics
Revenue
Top products
Recent sales
Low-stock products
```

---

## Phase 9 — Testing

```text
Authentication tests
Product tests
Inventory tests
Sales tests
Authorization tests
```

---

## Phase 10 — Production

```text
Docker
Production environment
PostgreSQL
Alembic migrations
CORS
Deployment
Monitoring/logging
README
```

---

# 35. What We Need to Learn Before Coding

We do NOT need to study everything first.

Before writing the actual application, understand these concepts:

```text
1. FastAPI application
2. APIRouter
3. Pydantic BaseModel
4. Request vs Response schema
5. Dependency Injection
6. Depends()
7. SQLAlchemy Session
8. SQLAlchemy models
9. Relationships
10. Alembic migrations
11. Authentication
12. JWT
13. Password hashing
14. Authorization
15. HTTP status codes
16. CORS
17. Transactions
18. Environment variables
19. Testing
20. Docker
```

We can learn them while implementing.

---

# 36. The Most Important Mental Model

When you see a feature, break it into layers.

Example:

> Create Product

```text
Frontend
   ↓
POST /api/products
   ↓
Router
   ↓
Pydantic validation
   ↓
Authentication dependency
   ↓
Service
   ↓
SQLAlchemy
   ↓
PostgreSQL
   ↓
Response schema
   ↓
JSON
   ↓
Frontend
```

Example:

> Create Sale

```text
Frontend
   ↓
POST /api/sales
   ↓
Router
   ↓
Pydantic validation
   ↓
Authentication
   ↓
Authorization
   ↓
Sales Service
   ↓
Check products
   ↓
Check stock
   ↓
Create sale
   ↓
Create sale items
   ↓
Decrease stock
   ↓
Create inventory transaction
   ↓
Commit transaction
   ↓
Response
```

This is how we should think about backend development.

---

# 37. What We Should NOT Do

Do not create:

```text
main.py
```

with 1,500 lines.

Do not put:

```text
database queries
authentication
business logic
validation
routes
```

all inside one file.

Do not store passwords in plain text.

Do not commit `.env`.

Do not let the frontend access PostgreSQL directly.

Do not trust frontend validation alone.

Do not calculate important business rules only on the frontend.

Do not manually modify production database tables.

Do not deploy without testing important business logic.

---

# 38. Our Learning Philosophy

We will learn each concept because the project needs it.

Instead of:

```text
Study FastAPI for 5 days
↓
Build project
```

we use:

```text
Need authentication
↓
Learn JWT + dependencies
↓
Implement authentication
↓
Test authentication
↓
Continue
```

Or:

```text
Need product validation
↓
Learn Pydantic
↓
Implement schemas
↓
Test validation
↓
Continue
```

This means learning and building happen simultaneously.

---

# 39. First Implementation Target

The first working version should be:

```text
FastAPI
   ↓
Application
   ↓
Router
   ↓
Health endpoint
   ↓
Swagger documentation
```

Then:

```text
FastAPI
   ↓
Database
   ↓
SQLAlchemy
   ↓
PostgreSQL
   ↓
Product model
```

Then:

```text
Product API
   ↓
Pydantic
   ↓
SQLAlchemy
   ↓
PostgreSQL
```

Then authentication.

Then inventory.

Then sales.

Then dashboard.

---

# 40. Final Backend Goal

The finished system should look like:

```text
                    ┌───────────────────┐
                    │   React Dashboard │
                    └─────────┬─────────┘
                              │
                         REST API
                              │
                    ┌─────────▼─────────┐
                    │      FastAPI      │
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
          Auth/AuthZ       Services       Validation
              │               │               │
              └───────────────┼───────────────┘
                              │
                        SQLAlchemy
                              │
                         PostgreSQL
                              │
              ┌───────────────┼───────────────┐
              │               │               │
           Products        Inventory         Sales
              │               │               │
              └───────────────┼───────────────┘
                              │
                        Dashboard Data
```

The final backend should be:

```text
Secure
Validated
Tested
Documented
Modular
Deployable
```
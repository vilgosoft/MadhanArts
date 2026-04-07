# Madhan Arts — REST API Endpoints

Base URL: `/api`

---

## Authentication

| Method | Endpoint               | Description                        | Auth     |
|--------|------------------------|------------------------------------|----------|
| POST   | `/auth/admin/login`    | Admin login (email + password)     | Public   |
| POST   | `/auth/otp/send`       | Send OTP to email or phone         | Public   |
| POST   | `/auth/otp/verify`     | Verify OTP and get JWT token       | Public   |
| GET    | `/auth/me`             | Get current logged-in user profile | User/Admin |

---

## Categories (Public + Admin)

| Method | Endpoint               | Description                        | Auth     |
|--------|------------------------|------------------------------------|----------|
| GET    | `/categories`          | List all active categories         | Public   |
| GET    | `/categories/:slug`    | Get single category by slug        | Public   |
| POST   | `/categories`          | Create a new category              | Admin    |
| PUT    | `/categories/:id`      | Update a category                  | Admin    |
| DELETE | `/categories/:id`      | Delete a category                  | Admin    |

---

## Gallery (Public + Admin)

| Method | Endpoint                        | Description                          | Auth     |
|--------|---------------------------------|--------------------------------------|----------|
| GET    | `/gallery`                      | List gallery items (filterable)      | Public   |
| GET    | `/gallery/category/:categoryId` | Get gallery items for a category     | Public   |
| POST   | `/gallery`                      | Upload a gallery image               | Admin    |
| PUT    | `/gallery/:id`                  | Update gallery item metadata         | Admin    |
| DELETE | `/gallery/:id`                  | Delete a gallery image               | Admin    |

---

## Sizes (Public + Admin)

| Method | Endpoint        | Description                  | Auth     |
|--------|-----------------|------------------------------|----------|
| GET    | `/sizes`        | List all active sizes        | Public   |
| POST   | `/sizes`        | Create a new size            | Admin    |
| PUT    | `/sizes/:id`    | Update a size                | Admin    |
| DELETE | `/sizes/:id`    | Delete a size                | Admin    |

---

## Pricing (Public + Admin)

| Method | Endpoint                          | Description                                  | Auth     |
|--------|-----------------------------------|----------------------------------------------|----------|
| GET    | `/pricing`                        | List all pricing rules                       | Admin    |
| GET    | `/pricing/category/:categoryId`   | Get prices for a category (all sizes)        | Public   |
| GET    | `/pricing/calculate`              | Get price for category + size combo          | Public   |
| POST   | `/pricing`                        | Create a pricing rule                        | Admin    |
| PUT    | `/pricing/:id`                    | Update a pricing rule                        | Admin    |
| DELETE | `/pricing/:id`                    | Delete a pricing rule                        | Admin    |

---

## Orders (User + Admin)

| Method | Endpoint                    | Description                              | Auth     |
|--------|-----------------------------|------------------------------------------|----------|
| POST   | `/orders`                   | Create a new order (with photo upload)   | User     |
| GET    | `/orders`                   | List all orders (admin) or user's orders | User/Admin |
| GET    | `/orders/:id`               | Get order details                        | User/Admin |
| PUT    | `/orders/:id/status`        | Update order status                      | Admin    |
| GET    | `/orders/:id/photo`         | Download reference photo                 | Admin    |

---

## Payments

| Method | Endpoint                       | Description                             | Auth     |
|--------|--------------------------------|-----------------------------------------|----------|
| POST   | `/payments/create-intent`      | Create Stripe/Razorpay payment intent   | User     |
| POST   | `/payments/webhook`            | Payment gateway webhook callback        | Public   |
| GET    | `/payments/:orderId/status`    | Check payment status for an order       | User/Admin |

---

## File Uploads

| Method | Endpoint           | Description                        | Auth     |
|--------|--------------------|------------------------------------|----------|
| POST   | `/upload/photo`    | Upload a reference photo           | User     |
| POST   | `/upload/gallery`  | Upload a gallery image             | Admin    |

---

## Query Parameters (common)

- `page` — Pagination page number (default: 1)
- `limit` — Items per page (default: 20)
- `sort` — Sort field (e.g., `created_at`)
- `order` — Sort direction: `asc` or `desc`
- `category_id` — Filter by category
- `status` — Filter by order/payment status

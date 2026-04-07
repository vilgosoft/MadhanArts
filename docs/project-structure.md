# Madhan Arts — Project Structure

```
MadhanArts/
├── database/
│   └── schema.sql                    # MySQL schema + seed data
│
├── docs/
│   ├── api-endpoints.md              # REST API documentation
│   └── project-structure.md          # This file
│
├── backend/                          # PHP REST API
│   ├── public/
│   │   └── index.php                 # Entry point — routes all requests
│   │
│   ├── config/
│   │   ├── database.php              # DB connection config
│   │   └── app.php                   # App-level constants (JWT secret, upload paths, etc.)
│   │
│   ├── src/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php        # Admin login + OTP send/verify
│   │   │   ├── CategoryController.php    # CRUD for categories
│   │   │   ├── GalleryController.php     # CRUD for gallery items
│   │   │   ├── SizeController.php        # CRUD for sizes
│   │   │   ├── PricingController.php     # CRUD for pricing rules
│   │   │   ├── OrderController.php       # Order creation + management
│   │   │   ├── PaymentController.php     # Payment intent + webhook
│   │   │   └── UploadController.php      # File upload handling
│   │   │
│   │   ├── Models/
│   │   │   ├── Admin.php
│   │   │   ├── User.php
│   │   │   ├── OtpToken.php
│   │   │   ├── Category.php
│   │   │   ├── GalleryItem.php
│   │   │   ├── Size.php
│   │   │   ├── PricingRule.php
│   │   │   └── Order.php
│   │   │
│   │   ├── Middleware/
│   │   │   ├── AuthMiddleware.php        # JWT verification
│   │   │   ├── AdminMiddleware.php       # Admin-only route guard
│   │   │   └── CorsMiddleware.php        # CORS headers
│   │   │
│   │   ├── Services/
│   │   │   ├── OtpService.php            # OTP generation + sending
│   │   │   ├── PaymentService.php        # Stripe/Razorpay integration
│   │   │   └── FileUploadService.php     # Photo upload + validation
│   │   │
│   │   ├── Helpers/
│   │   │   ├── Response.php              # JSON response helper
│   │   │   └── Validator.php             # Input validation helper
│   │   │
│   │   └── Router.php                    # Simple request router
│   │
│   ├── uploads/                          # Uploaded files (gitignored)
│   │   ├── gallery/
│   │   └── references/
│   │
│   ├── composer.json
│   └── .htaccess
│
├── frontend/                         # React + TypeScript
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx
│   │   │   │
│   │   │   ├── Gallery/
│   │   │   │   ├── GalleryGrid.tsx
│   │   │   │   ├── GalleryCard.tsx
│   │   │   │   └── CategoryFilter.tsx
│   │   │   │
│   │   │   ├── OrderFlow/
│   │   │   │   ├── OrderWizard.tsx       # Multi-step order form
│   │   │   │   ├── PhotoUpload.tsx       # Step 1: Upload photo
│   │   │   │   ├── SizeSelector.tsx      # Step 2: Select size
│   │   │   │   ├── PriceSummary.tsx      # Step 3: Price display
│   │   │   │   └── PaymentStep.tsx       # Step 4: Payment
│   │   │   │
│   │   │   ├── Auth/
│   │   │   │   ├── OtpLogin.tsx
│   │   │   │   └── AdminLogin.tsx
│   │   │   │
│   │   │   └── common/
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       └── Loader.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── CategoryPage.tsx
│   │   │   ├── OrderPage.tsx
│   │   │   ├── MyOrdersPage.tsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.tsx
│   │   │       ├── ManageCategories.tsx
│   │   │       ├── ManageGallery.tsx
│   │   │       ├── ManagePricing.tsx
│   │   │       └── ManageOrders.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts                    # Axios instance + API calls
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useOrders.ts
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── types/
│   │   │   └── index.ts                  # TypeScript interfaces
│   │   │
│   │   ├── styles/
│   │   │   ├── _variables.scss
│   │   │   ├── _mixins.scss
│   │   │   ├── global.scss
│   │   │   └── components/
│   │   │       ├── _header.scss
│   │   │       ├── _gallery.scss
│   │   │       ├── _order-flow.scss
│   │   │       └── _admin.scss
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

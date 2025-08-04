wow-marketplace/
├── 📁 public/                          ← BUYER INTERFACE (Customer-facing)
│   ├── index.html                      ← Main store homepage
│   ├── products.html                   ← Product catalog
│   ├── product-detail.html             ← Single product page
│   ├── cart.html                       ← Shopping cart
│   ├── checkout.html                   ← Checkout process
│   ├── orders.html                     ← Order history
│   ├── login.html                      ← Buyer login/register
│   │
│   ├── 📁 css/
│   │   ├── main.css                    ← Buyer interface styles
│   │   └── responsive.css              ← Mobile responsive
│   │
│   ├── 📁 js/
│   │   ├── main.js                     ← Buyer functionality
│   │   ├── cart.js                     ← Cart management
│   │   ├── checkout.js                 ← Checkout process
│   │   └── products.js                 ← Product browsing
│   │
│   └── 📁 images/
│       ├── logo.png
│       └── products/
│
├── 📁 public/seller/                   ← SELLER INTERFACE (Vendor dashboard)
│   ├── index.html                      ← Seller dashboard homepage
│   ├── login.html                      ← Seller login
│   ├── register.html                   ← Seller registration
│   ├── products.html                   ← Manage products
│   ├── add-product.html                ← Add new product
│   ├── orders.html                     ← Seller's orders
│   ├── analytics.html                  ← Sales analytics
│   ├── profile.html                    ← Seller profile
│   ├── payouts.html                    ← Earnings & payouts
│   │
│   ├── 📁 css/
│   │   ├── seller-dashboard.css        ← Seller interface styles
│   │   └── seller-responsive.css       ← Mobile responsive
│   │
│   ├── 📁 js/
│   │   ├── seller-main.js              ← Seller dashboard functionality
│   │   ├── product-management.js       ← Product CRUD operations
│   │   ├── order-management.js         ← Order handling
│   │   └── analytics.js                ← Sales analytics
│   │
│   └── 📁 components/
│       ├── sidebar.html                ← Seller navigation
│       └── header.html                 ← Seller header
│
├── 📁 public/admin/                    ← ADMIN INTERFACE (Platform management)
│   ├── index.html                      ← Admin dashboard
│   ├── sellers.html                    ← Manage sellers
│   ├── products.html                   ← Review products
│   ├── orders.html                     ← All orders
│   ├── analytics.html                  ← Platform analytics
│   ├── settings.html                   ← Platform settings
│   │
│   ├── 📁 css/
│   │   └── admin-dashboard.css         ← Admin interface styles
│   │
│   └── 📁 js/
│       ├── admin-main.js               ← Admin functionality
│       ├── seller-management.js        ← Manage sellers
│       └── platform-analytics.js       ← Platform insights
│
├── 📁 src/                            ← BACKEND (Shared by all interfaces)
│   ├── 📁 modules/
│   │   ├── 📁 catalog/                ← Product management
│   │   │   ├── productController.js
│   │   │   ├── productService.js
│   │   │   └── routes.js
│   │   │
│   │   ├── 📁 sellers/                ← Seller management
│   │   │   ├── sellerController.js
│   │   │   ├── sellerService.js
│   │   │   ├── sellerAuth.js          ← Seller authentication
│   │   │   └── routes.js
│   │   │
│   │   ├── 📁 buyers/                 ← Buyer management
│   │   │   ├── buyerController.js
│   │   │   ├── buyerAuth.js           ← Buyer authentication
│   │   │   └── routes.js
│   │   │
│   │   ├── 📁 orders/                 ← Order management
│   │   │   ├── orderController.js
│   │   │   ├── orderService.js
│   │   │   └── routes.js
│   │   │
│   │   ├── 📁 admin/                  ← Admin functions
│   │   │   ├── adminController.js
│   │   │   ├── adminAuth.js
│   │   │   └── routes.js
│   │   │
│   │   └── 📁 analytics/              ← Analytics & reporting
│   │       ├── analyticsController.js
│   │       └── routes.js
│   │
│   ├── 📁 middleware/
│   │   ├── auth.js                    ← General authentication
│   │   ├── sellerAuth.js              ← Seller-specific auth
│   │   ├── buyerAuth.js               ← Buyer-specific auth
│   │   ├── adminAuth.js               ← Admin-specific auth
│   │   └── roleGuard.js               ← Role-based access control
│   │
│   └── 📁 config/
│       ├── database.js
│       └── auth.js                    ← Authentication configuration
│
├── server.js                          ← Main server (handles all routes)
├── package.json
└── .env

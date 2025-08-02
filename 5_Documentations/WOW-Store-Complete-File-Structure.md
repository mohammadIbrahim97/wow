# WOW Store - Complete File Structure

```
wow/
├── 📁 public/                          ← Frontend files (Static files served by Express)
│   ├── index.html                      ← Main store homepage
│   ├── admin.html                      ← Admin panel interface
│   ├── cart.html                       ← Shopping cart page
│   ├── checkout.html                   ← Checkout form
│   ├── 📁 css/
│   │   ├── main.css                    ← Custom styles
│   │   └── admin.css                   ← Admin-specific styles
│   ├── 📁 js/
│   │   ├── main.js                     ← Frontend JavaScript
│   │   ├── cart.js                     ← Cart functionality
│   │   ├── admin.js                    ← Admin panel JS
│   │   └── checkout.js                 ← Checkout functionality
│   └── 📁 images/
│       ├── logo.png
│       └── products/                   ← Product images
│
├── 📁 src/
│   ├── 📁 modules/
│   │   ├── 📁 catalog/
│   │   │   ├── productController.js    ← Product CRUD operations
│   │   │   ├── productModel.js         ← Product data model
│   │   │   ├── routes.js               ← Product API routes
│   │   │   └── productService.js       ← Business logic
│   │   │
│   │   ├── 📁 cart/
│   │   │   ├── cartController.js       ← Cart operations
│   │   │   ├── cartService.js          ← Cart business logic
│   │   │   └── routes.js               ← Cart API routes
│   │   │
│   │   ├── 📁 checkout/
│   │   │   ├── orderController.js      ← Order processing
│   │   │   ├── orderModel.js           ← Order data model
│   │   │   ├── orderService.js         ← Order business logic
│   │   │   └── routes.js               ← Order API routes
│   │   │
│   │   ├── 📁 admin/
│   │   │   ├── adminController.js      ← Admin operations
│   │   │   ├── authController.js       ← Admin authentication
│   │   │   ├── routes.js               ← Admin API routes
│   │   │   └── middleware.js           ← Admin auth middleware
│   │   │
│   │   └── 📁 notifications/
│   │       ├── whatsappService.js      ← WhatsApp integration
│   │       ├── smsService.js           ← SMS notifications
│   │       ├── emailService.js         ← Email notifications
│   │       └── notificationController.js
│   │
│   ├── 📁 config/
│   │   ├── database.js                 ← Database connection
│   │   ├── config.js                   ← App configuration
│   │   └── constants.js                ← App constants
│   │
│   ├── 📁 middleware/
│   │   ├── auth.js                     ← Authentication middleware
│   │   ├── validation.js               ← Input validation
│   │   ├── errorHandler.js             ← Error handling
│   │   └── session.js                  ← Session management
│   │
│   ├── 📁 utils/
│   │   ├── logger.js                   ← Logging utility
│   │   ├── helpers.js                  ← Helper functions
│   │   └── validators.js               ← Data validation
│   │
│   └── 📁 database/
│       ├── migrations/                 ← Database migrations
│       ├── seeds/                      ← Sample data
│       └── schema.sql                  ← Database schema
│
├── 📁 uploads/                         ← File uploads (product images)
│   └── products/
│
├── 📁 logs/                           ← Application logs
│   ├── error.log
│   └── access.log
│
├── 📁 tests/                          ← Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── 📁 Documentation/                   ← Your existing docs
│   └── prerequesties.md
│
├── server.js                          ← Main server entry point
├── package.json                       ← Dependencies and scripts
├── package-lock.json                  ← Dependency lock file
├── .env                              ← Environment variables
├── .env.example                      ← Environment template
├── .gitignore                        ← Git ignore rules
├── README.md                         ← Project documentation
└── docker-compose.yml                ← Docker configuration (optional)
```

## Key Points About File Placement:

### **Frontend Files (public/ directory):**
- `index.html` goes in `public/` - This is your main store homepage
- Express serves this directory as static files
- Customers access: `yourstore.com/` → serves `public/index.html`
- Admin access: `yourstore.com/admin.html` → serves `public/admin.html`

### **Backend Files (src/ directory):**
- All your Node.js/Express code
- API endpoints, business logic, database operations
- Not directly accessible by browsers

### **Static Assets:**
- CSS, JavaScript, images go in `public/`
- Product images can be uploaded to `uploads/products/`

### **Configuration:**
- `server.js` is your main entry point
- `.env` contains secrets (database passwords, API keys)
- `package.json` defines your project dependencies

## URL Structure:
```
yourstore.com/              → public/index.html (main store)
yourstore.com/cart.html     → public/cart.html (shopping cart)
yourstore.com/admin.html    → public/admin.html (admin panel)
yourstore.com/api/products  → API endpoint (backend)
yourstore.com/api/cart      → API endpoint (backend)
```

## Why `public/` for Frontend?
1. **Express Static Middleware** serves files from `public/` automatically
2. **Security** - Only files in `public/` are accessible via browser
3. **Organization** - Clear separation between frontend and backend
4. **Standard Practice** - Most Node.js apps use this structure
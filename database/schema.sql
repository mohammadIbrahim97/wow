-- ==========================================
-- WOW Marketplace Database Schema
-- ==========================================

-- ==========================================
-- 1. SELLERS TABLE (Vendors/Merchants)
-- ==========================================
CREATE TABLE sellers (
    id SERIAL PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    
    -- Business Details
    business_type VARCHAR(50), -- 'cosmetics', 'electronics', 'fashion', etc.
    business_license VARCHAR(100),
    tax_id VARCHAR(50),
    
    -- Address
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    governorate VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'Syria',
    
    -- Platform Details
    commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Platform commission %
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, suspended, blocked
    is_verified BOOLEAN DEFAULT false,
    
    -- Financial
    bank_account VARCHAR(100),
    bank_name VARCHAR(100),
    
    -- Profile
    logo_url VARCHAR(500),
    description TEXT,
    website VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- ==========================================
-- 2. BUYERS TABLE (Customers)
-- ==========================================
CREATE TABLE buyers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    whatsapp VARCHAR(20),
    
    -- Address (Default shipping address)
    address TEXT,
    city VARCHAR(100),
    governorate VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Syria',
    
    -- Preferences
    preferred_language VARCHAR(10) DEFAULT 'ar',
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT true,
    
    -- Profile
    date_of_birth DATE,
    gender VARCHAR(10), -- 'male', 'female', 'other'
    profile_picture VARCHAR(500),
    
    -- Platform Data
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    loyalty_points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- ==========================================
-- 3. PRODUCTS TABLE (Marketplace Products)
-- ==========================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    
    -- Basic Product Info
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    sku VARCHAR(100) UNIQUE, -- Stock Keeping Unit
    
    -- Categories
    category VARCHAR(50) NOT NULL, -- 'cosmetics', 'electronics', 'fashion'
    subcategory VARCHAR(50), -- 'lipstick', 'smartphone', 'shoes'
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    cost_price DECIMAL(10,2), -- Seller's cost (for commission calculation)
    
    -- Description & Details
    description TEXT,
    short_description TEXT,
    specifications JSONB, -- Flexible product specs
    
    -- Cosmetics Specific (when category = 'cosmetics')
    color VARCHAR(50),
    shade_code VARCHAR(20),
    skin_type TEXT[], -- ['oily', 'dry', 'sensitive']
    ingredients TEXT,
    size VARCHAR(50), -- '30ml', '3.5g'
    
    -- Electronics Specific (when category = 'electronics')
    -- warranty_period INTEGER, -- months
    -- technical_specs JSONB,
    
    -- Fashion Specific (when category = 'fashion')
    -- sizes TEXT[], -- ['S', 'M', 'L', 'XL']
    -- material VARCHAR(100),
    
    -- Inventory
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock_alert INTEGER DEFAULT 5,
    
    -- Media
    images TEXT[] DEFAULT '{}', -- Array of image URLs
    video_url VARCHAR(500),
    
    -- SEO & Marketing
    slug VARCHAR(255) UNIQUE, -- URL-friendly name
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags TEXT[], -- ['beauty', 'makeup', 'red-lipstick']
    
    -- Platform Management
    status VARCHAR(20) DEFAULT 'draft', -- draft, pending, approved, rejected, inactive
    is_featured BOOLEAN DEFAULT false,
    featured_until TIMESTAMP,
    
    -- Shipping
    weight DECIMAL(8,2), -- in grams
    dimensions JSONB, -- {length: 10, width: 5, height: 3} in cm
    shipping_required BOOLEAN DEFAULT true,
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 4. ORDERS TABLE
-- ==========================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES buyers(id),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- WOW-20240804-001
    
    -- Financial
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_fee DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Payment
    payment_method VARCHAR(20) DEFAULT 'cod', -- cod, bank_transfer, whatsapp_pay
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
    
    -- Shipping
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_governorate VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_notes TEXT,
    
    -- Order Management
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
    priority VARCHAR(10) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- Tracking
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    actual_delivery TIMESTAMP,
    
    -- Communication
    customer_notes TEXT,
    admin_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 5. ORDER_ITEMS TABLE (Order Details)
-- ==========================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    seller_id INTEGER NOT NULL REFERENCES sellers(id),
    
    -- Item Details
    product_name VARCHAR(255) NOT NULL, -- Snapshot at time of order
    product_sku VARCHAR(100),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL, -- Price at time of order
    total_price DECIMAL(10,2) NOT NULL, -- quantity * unit_price
    
    -- Commission Tracking
    commission_rate DECIMAL(5,2), -- Platform commission at time of order
    commission_amount DECIMAL(10,2), -- Commission owed to platform
    seller_amount DECIMAL(10,2), -- Amount owed to seller
    
    -- Status per item (useful for multi-seller orders)
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, returned
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 6. ADDITIONAL TABLES (Optional but Recommended)
-- ==========================================

-- Product Reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    buyer_id INTEGER NOT NULL REFERENCES buyers(id),
    order_id INTEGER REFERENCES orders(id), -- Ensure buyer actually bought the product
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT[] DEFAULT '{}',
    
    is_verified BOOLEAN DEFAULT false, -- Verified purchase
    is_approved BOOLEAN DEFAULT false, -- Admin approval
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seller Earnings/Payouts
CREATE TABLE seller_payouts (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES sellers(id),
    
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    total_sales DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL, -- total_sales - commission
    
    status VARCHAR(20) DEFAULT 'pending', -- pending, processed, paid
    payout_method VARCHAR(50), -- bank_transfer, cash, etc.
    payout_reference VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);

-- ==========================================
-- INDEXES for Performance
-- ==========================================
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_seller_id ON order_items(seller_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
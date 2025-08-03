// Global cart variable
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = []; // Store all products for filtering

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupCategoryFilters();
    setupNavbarEffects();
});

// Handle image loading errors
function handleImageError(img) {
    // Prevent infinite loop by checking if we already tried the placeholder
    if (!img.dataset.errorHandled) {
        img.dataset.errorHandled = 'true';
        img.src = '/images/placeholder.svg';
    }
}

async function loadProducts() {
    try {
        // Hide loading indicator initially
        document.getElementById('loading-indicator').style.display = 'block';
        
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
            allProducts = data.products;
            displayProducts(allProducts);
        }
        
        // Hide loading indicator
        document.getElementById('loading-indicator').style.display = 'none';
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('loading-indicator').style.display = 'none';
    }
}

// Setup category filtering
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-filter');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Filter products
            const category = e.target.dataset.category;
            if (category === 'all') {
                displayProducts(allProducts);
            } else {
                const filteredProducts = allProducts.filter(product => product.category === category);
                displayProducts(filteredProducts);
            }
        });
    });
}

// Setup navbar scroll effects
function setupNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove shadow based on scroll position
        if (scrollTop > 10) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Add currency formatting function
function formatPrice(priceInSYP, priceInUSD) {
    const sypFormatted = new Intl.NumberFormat('ar-SY', {
        style: 'currency',
        currency: 'SYP',
        minimumFractionDigits: 0
    }).format(priceInSYP);
    
    return `
        <div class="price-container">
            <div class="price-syp">${sypFormatted}</div>
            <div class="price-usd text-muted">($${priceInUSD})</div>
        </div>
    `;
}

// Add stock status function
function getStockStatus(stock) {
    if (stock > 10) {
        return '<span class="badge bg-success">متوفر</span>';
    } else if (stock > 0) {
        return `<span class="badge bg-warning text-dark">متبقي ${stock}</span>`;
    } else {
        return '<span class="badge bg-danger">نفد المخزون</span>';
    }
}

// Otto-style price formatting
function formatPriceOtto(priceInSYP, priceInUSD) {
    const sypFormatted = new Intl.NumberFormat('ar-SY', {
        style: 'currency',
        currency: 'SYP',
        minimumFractionDigits: 0
    }).format(priceInSYP);
    
    return `
        <span>${sypFormatted}</span>
        <div class="otto-price-usd">($${priceInUSD})</div>
    `;
}

// Otto-style stock status
function getStockStatusOtto(stock) {
    if (stock > 10) {
        return '<span class="otto-stock-badge otto-stock-available">متوفر</span>';
    } else if (stock > 0) {
        return `<span class="otto-stock-badge otto-stock-low">متبقي ${stock}</span>`;
    } else {
        return '<span class="otto-stock-badge otto-stock-out">نفد المخزون</span>';
    }
}

// Get brand name from category
function getBrandFromCategory(category) {
    const brandMap = {
        'العناية بالبشرة': 'GARNIER',
        'مكياج العيون': 'MAYBELLINE', 
        'أحمر الشفاه': 'L\'OREAL',
        'العطور': 'CHANEL',
        'العناية بالشعر': 'PANTENE'
    };
    return brandMap[category] || 'WOW';
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <h5>لا توجد منتجات في هذه الفئة</h5>
                    <p>جربي البحث في فئة أخرى</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const isOutOfStock = product.stock === 0;
        const isPopular = product.stock > 15; // Assume popular if high stock
        const isOnSale = product.priceUSD < 20; // Simple sale logic
        
        const productCard = `
            <div class="otto-product-card ${isOutOfStock ? 'out-of-stock' : ''}">
                <div class="otto-product-image">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="handleImageError(this)">
                    ${isOutOfStock ? '<div class="out-of-stock-overlay">نفد المخزون</div>' : ''}
                    ${isPopular ? '<div class="otto-badge-popular">مشهور</div>' : ''}
                    ${isOnSale ? '<div class="otto-badge-sale">تخفيض</div>' : ''}
                </div>
                
                <div class="otto-product-info">
                    <div class="otto-product-brand">${getBrandFromCategory(product.category)}</div>
                    <h6 class="otto-product-title">${product.name}</h6>
                    <p class="otto-product-description">${product.description}</p>
                    
                    <div class="otto-price-container">
                        <div class="otto-price-current">
                            ${formatPriceOtto(product.price, product.priceUSD)}
                        </div>
                    </div>
                </div>
                
                <div class="otto-product-actions">
                    <div class="otto-stock-status">
                        ${getStockStatusOtto(product.stock)}
                    </div>
                    <button class="otto-btn-add-cart" 
                            onclick="addToCart(${product.id})"
                            ${isOutOfStock ? 'disabled' : ''}>
                        ${isOutOfStock ? 'غير متوفر' : 'أضف للسلة'}
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

function addToCart(productId) {
    // Simple cart logic for now
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show success toast instead of alert
    showToast('تم إضافة المنتج للسلة!', 'success');
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

async function viewCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) {
        createCartModal();
    }
    
    await loadCartItems();
    showCartModal();
}

function createCartModal() {
    const modalHTML = `
        <div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="cartModalLabel">🛒 سلة التسوق</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="cart-items-container">
                            <!-- Cart items will be loaded here -->
                        </div>
                        <div id="cart-total" class="mt-3">
                            <!-- Total will be displayed here -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                        <button type="button" class="btn btn-primary" onclick="checkout()">إتمام الشراء</button>
                        <button type="button" class="btn btn-danger" onclick="clearCart()">إفراغ السلة</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function loadCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalContainer = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">السلة فارغة</p>';
        totalContainer.innerHTML = '';
        return;
    }
    
    let cartHTML = '';
    let totalSYP = 0;
    let totalUSD = 0;
    
    // Load product details for each cart item
    for (const cartItem of cart) {
        try {
            const response = await fetch(`/api/products/${cartItem.productId}`);
            const data = await response.json();
            
            if (data.success) {
                const product = data.product;
                const itemTotalSYP = product.price * cartItem.quantity;
                const itemTotalUSD = product.priceUSD * cartItem.quantity;
                totalSYP += itemTotalSYP;
                totalUSD += itemTotalUSD;
                
                cartHTML += `
                    <div class="row cart-item mb-3 p-3 border rounded" data-product-id="${product.id}">
                        <div class="col-md-2">
                            <img src="${product.image}" class="img-fluid rounded" alt="${product.name}" 
                                 onerror="handleImageError(this)" style="max-height: 80px;">
                        </div>
                        <div class="col-md-4">
                            <h6>${product.name}</h6>
                            <p class="text-muted small">${product.description}</p>
                        </div>
                        <div class="col-md-2">
                            ${formatPrice(product.price, product.priceUSD)}
                        </div>
                        <div class="col-md-2">
                            <div class="quantity-controls d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${product.id})">-</button>
                                <span class="mx-2">${cartItem.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${product.id})">+</button>
                            </div>
                        </div>
                        <div class="col-md-2">
                            ${formatPrice(itemTotalSYP, itemTotalUSD)}
                            <button class="btn btn-sm btn-danger mt-1" onclick="removeFromCart(${product.id})">حذف</button>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading product details:', error);
        }
    }
    
    container.innerHTML = cartHTML;
    
    const sypTotal = new Intl.NumberFormat('ar-SY', {
        style: 'currency',
        currency: 'SYP',
        minimumFractionDigits: 0
    }).format(totalSYP);
    
    totalContainer.innerHTML = `
        <div class="text-end">
            <h5>المجموع الكلي: <span class="text-success">${sypTotal}</span></h5>
            <p class="text-muted">($${totalUSD})</p>
        </div>
    `;
}

function showCartModal() {
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
}

// Update cart count on page load
updateCartCount();

// Add smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Toast notification function
// Enhanced toast notification positioning (account for fixed navbar)
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed p-3';
        // Position below fixed navbar
        toastContainer.style.top = '90px';
        toastContainer.style.right = '15px';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : 'primary'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Show toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Cart management functions
function increaseQuantity(productId) {
    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem) {
        cartItem.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems(); // Refresh cart display
    }
}

function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems(); // Refresh cart display
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems(); // Refresh cart display
}

function clearCart() {
    if (confirm('هل أنت متأكد من إفراغ السلة؟')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems(); // Refresh cart display
    }
}

function checkout() {
    if (cart.length === 0) {
        showToast('السلة فارغة!', 'warning');
        return;
    }
    
    // For now, just show a success message
    showToast('تم إرسال الطلب بنجاح! سيتم التواصل معك قريباً.', 'success');
    
    // Clear cart after successful checkout
    setTimeout(() => {
        clearCart();
        // Close modal
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        cartModal.hide();
    }, 2000);
}
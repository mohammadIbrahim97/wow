// Global cart variable
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load products on page load
document.addEventListener('DOMContentLoaded', loadProducts);

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
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
            displayProducts(data.products);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
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

function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        const isOutOfStock = product.stock === 0;
        const productCard = `
            <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div class="card product-card h-100 ${isOutOfStock ? 'out-of-stock' : ''}">
                    <div class="image-container">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}" 
                             onerror="handleImageError(this)">
                        ${isOutOfStock ? '<div class="out-of-stock-overlay">نفد المخزون</div>' : ''}
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="product-category">
                            <small class="text-muted">${product.category}</small>
                        </div>
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text flex-grow-1">${product.description}</p>
                        <div class="product-price mb-2">
                            ${formatPrice(product.price, product.priceUSD)}
                        </div>
                        <div class="stock-status mb-3">
                            ${getStockStatus(product.stock)}
                        </div>
                        <button class="btn btn-add-cart w-100 mt-auto" 
                                onclick="addToCart(${product.id})"
                                ${isOutOfStock ? 'disabled' : ''}>
                            ${isOutOfStock ? 'غير متوفر' : 'أضف للسلة'}
                        </button>
                    </div>
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

// Toast notification function
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
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
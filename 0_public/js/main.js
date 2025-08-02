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

function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = `
            <div class="col-md-4">
                <div class="card product-card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" 
                         onerror="handleImageError(this)">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="price">$${product.price}</p>
                        <p class="text-muted">متوفر: ${product.stock}</p>
                        <button class="btn btn-add-cart w-100" onclick="addToCart(${product.id})">
                            أضف للسلة
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
    let total = 0;
    
    // Load product details for each cart item
    for (const cartItem of cart) {
        try {
            const response = await fetch(`/api/products/${cartItem.productId}`);
            const data = await response.json();
            
            if (data.success) {
                const product = data.product;
                const itemTotal = product.price * cartItem.quantity;
                total += itemTotal;
                
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
                            <p class="mb-0">$${product.price}</p>
                        </div>
                        <div class="col-md-2">
                            <div class="quantity-controls d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${product.id})">-</button>
                                <span class="mx-2">${cartItem.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${product.id})">+</button>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <p class="mb-0 fw-bold">$${itemTotal}</p>
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
    totalContainer.innerHTML = `
        <div class="text-end">
            <h5>المجموع الكلي: <span class="text-success">$${total}</span></h5>
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
 // Embedded data for hosting compatibility
const embeddedUsers = [
    {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "password": "admin123",
        "accountType": "seller",
        "fullName": "مدير النظام",
        "phone": "01234567890",
        "address": "القاهرة، مصر",
        "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
        "id": 2,
        "username": "buyer1",
        "email": "buyer@example.com",
        "password": "buyer123",
        "accountType": "buyer",
        "fullName": "مشتري تجريبي",
        "phone": "01987654321",
        "address": "الإسكندرية، مصر",
        "createdAt": "2024-01-02T00:00:00.000Z"
    },
    {
        "id": 3,
        "username": "seller1",
        "email": "seller@example.com",
        "password": "seller123",
        "accountType": "seller",
        "fullName": "بائع تجريبي",
        "phone": "01555555555",
        "address": "الجيزة، مصر",
        "createdAt": "2024-01-03T00:00:00.000Z"
    }
];

// Load products from all sellers
async function loadProducts() {
    try {
        // Load embedded products as fallback
        const embeddedProducts = [
            {
                "id": 1,
                "name": "هاتف ذكي سامسونج جالاكسي A54",
                "price": 4500,
                "image": "https://picsum.photos/250/200?random=1",
                "stock": 15,
                "description": "هاتف ذكي سامسونج جالاكسي A54 مع كاميرا 50 ميجا بكسل وشاشة AMOLED 6.4 بوصة وبطارية 5000 مللي أمبير.",
                "category": "الإلكترونيات",
                "specifications": "معالج: Exynos 1380\nذاكرة: 8 جيجا رام\nتخزين: 128 جيجا\nكاميرا: 50MP رئيسية",
                "color": "أسود",
                "weight": "202 جرام",
                "sizes": [],
                "status": "متاح",
                "discountType": null,
                "discountValue": 0,
                "createdAt": "2024-01-15T10:00:00.000Z"
            },
            {
                "id": 2,
                "name": "لابتوب ديل إكسبيريشن 15",
                "price": 12000,
                "image": "https://picsum.photos/250/200?random=2",
                "stock": 8,
                "description": "لابتوب ديل إكسبيريشن 15 مع معالج Intel Core i5 وذاكرة 16 جيجا رام وتخزين SSD 512 جيجا.",
                "category": "الإلكترونيات",
                "specifications": "معالج: Intel Core i5\nذاكرة: 16 جيجا رام\nتخزين: 512 جيجا SSD\nشاشة: 15.6 بوصة Full HD",
                "color": "رمادي",
                "weight": "2.1 كيلو",
                "sizes": [],
                "status": "متاح",
                "discountType": null,
                "discountValue": 0,
                "createdAt": "2024-01-16T14:30:00.000Z"
            },
            {
                "id": 3,
                "name": "سماعات بلوتوث سوني WH-1000XM4",
                "price": 2200,
                "image": "https://picsum.photos/250/200?random=3",
                "stock": 12,
                "description": "سماعات بلوتوث سوني WH-1000XM4 مع إلغاء الضوضاء النشط وصوت عالي الجودة وبطارية تدوم 30 ساعة.",
                "category": "الإلكترونيات",
                "specifications": "إلغاء ضوضاء: نشط\nبطارية: 30 ساعة\nاتصال: بلوتوث 5.0\nوزن: 250 جرام",
                "color": "أسود",
                "weight": "250 جرام",
                "sizes": [],
                "status": "متاح",
                "discountType": null,
                "discountValue": 0,
                "createdAt": "2024-01-17T09:15:00.000Z"
            },
            {
                "id": 4,
                "name": "ساعة ذكية أبل ووتش سيريس 8",
                "price": 3500,
                "image": "https://picsum.photos/250/200?random=4",
                "stock": 6,
                "description": "ساعة ذكية أبل ووتش سيريس 8 مع تتبع اللياقة البدنية وشاشة دائماً نشطة ومقاومة للماء.",
                "category": "الإلكترونيات",
                "specifications": "شاشة: Retina دائماً نشطة\nتتبع: قلب، نوم، رياضة\nبطارية: 18 ساعة\nمقاومة ماء: 50 متر",
                "color": "فضي",
                "weight": "32 جرام",
                "sizes": ["41mm", "45mm"],
                "status": "متاح",
                "discountType": null,
                "discountValue": 0,
                "createdAt": "2024-01-18T16:45:00.000Z"
            },
            {
                "id": 5,
                "name": "كاميرا كانون EOS R50",
                "price": 8500,
                "image": "https://picsum.photos/250/200?random=5",
                "stock": 4,
                "description": "كاميرا كانون EOS R50 مع مستشعر 24.2 ميجا بكسل وشاشة متحركة وتسجيل فيديو 4K.",
                "category": "الإلكترونيات",
                "specifications": "مستشعر: 24.2 ميجا بكسل\nفيديو: 4K\nشاشة: متحركة 3 بوصة\nبطارية: LP-E17",
                "color": "أسود",
                "weight": "375 جرام",
                "sizes": [],
                "status": "متاح",
                "discountType": null,
                "discountValue": 0,
                "createdAt": "2024-01-19T11:20:00.000Z"
            },
            {
                "id": 6,
                "name": "طابعة ليزر HP LaserJet Pro M182nw",
                "price": 1800,
                "image": "https://picsum.photos/250/200?random=6",
                "stock": 10,
                "description": "طابعة ليزر HP LaserJet Pro M182nw مع طباعة لاسلكية وسرعة 28 صفحة في الدقيقة.",
                "category": "الإلكترونيات",
                "specifications": "سرعة: 28 ppm\nاتصال: WiFi، USB\nدقة: 1200 x 1200 dpi\nشهرة: 800 صفحة",
                "color": "أبيض",
                "weight": "5.4 كيلو",
                "sizes": [],
                "status": "متاح",
                "discountType": null,
                "discountValue": 0,
                "createdAt": "2024-01-20T13:10:00.000Z"
            }
        ];

        // Load products from all sellers stored in localStorage
        const allSellerProducts = [];
        const sellerKeys = Object.keys(localStorage).filter(key => key.startsWith('sellerProducts_'));

        sellerKeys.forEach(key => {
            try {
                const sellerProducts = JSON.parse(localStorage.getItem(key)) || [];
                allSellerProducts.push(...sellerProducts);
            } catch (error) {
                console.error('Error loading seller products from localStorage:', error);
            }
        });

        // Also check for general sellerProducts key
        const generalSellerProducts = JSON.parse(localStorage.getItem('sellerProducts')) || [];
        allSellerProducts.push(...generalSellerProducts);

        // Combine embedded products with seller products
        products = [...embeddedProducts, ...allSellerProducts];

        // Remove duplicates based on id
        const uniqueProducts = products.filter((product, index, self) =>
            index === self.findIndex(p => p.id === product.id)
        );

        products = uniqueProducts;

        console.log('Products loaded from sellers:', products);
        displayProducts();
        return products;

    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to embedded products
        products = [
            {
                "id": 1,
                "name": "هاتف ذكي سامسونج جالاكسي A54",
                "price": 4500,
                "image": "https://picsum.photos/250/200?random=1",
                "stock": 15,
                "description": "هاتف ذكي سامسونج جالاكسي A54 مع كاميرا 50 ميجا بكسل وشاشة AMOLED 6.4 بوصة وبطارية 5000 مللي أمبير.",
                "category": "الإلكترونيات",
                "specifications": "معالج: Exynos 1380\nذاكرة: 8 جيجا رام\nتخزين: 128 جيجا\nكاميرا: 50MP رئيسية",
                "color": "أسود",
                "weight": "202 جرام",
                "sizes": [],
                "status": "متاح",
                "discountType": null,
                "discountValue": 0,
                "createdAt": "2024-01-15T10:00:00.000Z"
            }
        ];
        displayProducts();
        return products;
    }
}

// Display products in the grid
function displayProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x200?text=صورة+غير+متاحة'">
            <h3>${product.name}</h3>
            <p class="price">${product.price.toLocaleString('ar-EG')} جنيه</p>
            <p class="stock">المخزون: ${product.stock}</p>
            <button class="add-to-cart-btn" onclick="showProductModal(${product.id})">عرض التفاصيل</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Initialize the app
function initializeApp() {
    loadProducts();
    updateCartCount();
    loadCategories();
    updateUserUI();
}

// Product modal functionality
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // Store current product ID
    window.currentProductId = productId;

    // Update modal content
    document.getElementById('product-modal-title').textContent = product.name;

    // Stock status
    const stockStatus = document.getElementById('product-status');
    if (product.stock > 0) {
        stockStatus.innerHTML = `<span style="color: #28a745; font-weight: bold;">✅ متاح (${product.stock} قطعة)</span>`;
    } else {
        stockStatus.innerHTML = `<span style="color: #dc3545; font-weight: bold;">❌ غير متاح</span>`;
    }

    // Product details
    const productDetails = document.getElementById('product-details');
    let priceDisplay = `${product.price.toLocaleString('ar-EG')} جنيه`;
    if (product.discountType && product.discountValue > 0) {
        let discountedPrice = product.price;
        if (product.discountType === 'percentage') {
            discountedPrice = product.price * (1 - product.discountValue / 100);
        } else {
            discountedPrice = product.price - product.discountValue;
        }
        discountedPrice = Math.max(0, discountedPrice);
        priceDisplay = `<span style="text-decoration: line-through; color: #999;">${product.price.toLocaleString('ar-EG')} جنيه</span> <span style="color: #d32f2f; font-weight: bold; font-size: 1.2em;">${discountedPrice.toLocaleString('ar-EG')} جنيه</span>`;
    }

    productDetails.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="${product.image}" alt="${product.name}" style="max-width: 100%; height: 250px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        </div>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #1e3a8a; margin: 0 0 10px 0;">${product.name}</h3>
            <p style="font-size: 1.1em; font-weight: bold; color: #2c3e50; margin: 5px 0;">السعر: ${priceDisplay}</p>
            <p style="margin: 5px 0;"><strong>الفئة:</strong> ${product.category}</p>
            ${product.color ? `<p style="margin: 5px 0;"><strong>اللون:</strong> ${product.color}</p>` : ''}
            ${product.weight ? `<p style="margin: 5px 0;"><strong>الوزن:</strong> ${product.weight}</p>` : ''}
        </div>
        ${product.description ? `<div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-right: 4px solid #ffc107;"><h4 style="color: #856404; margin: 0 0 10px 0;">الوصف:</h4><p style="margin: 0; color: #856404;">${product.description}</p></div>` : ''}
        ${product.specifications ? `<div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-right: 4px solid #17a2b8;"><h4 style="color: #0c5460; margin: 0 0 10px 0;">المواصفات:</h4><p style="margin: 0; color: #0c5460; white-space: pre-line;">${product.specifications}</p></div>` : ''}
    `;

    // Size selection
    const sizeSelect = document.getElementById('size');
    sizeSelect.innerHTML = '<option value="">-- اختر المقاس المناسب --</option>';
    if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach(size => {
            sizeSelect.innerHTML += `<option value="${size}">${size}</option>`;
        });
    } else {
        sizeSelect.innerHTML += '<option value="واحد">واحد</option>';
    }

    // Reset quantity
    document.getElementById('quantity').value = 1;
    updateQuantityButtons();

    // Show modal
    document.getElementById('product-modal').style.display = 'block';
}

// Quantity control functions
function updateQuantityButtons() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const currentQuantity = parseInt(quantityInput.value) || 1;

    // Get current product stock
    const productId = getCurrentProductId();
    const product = products.find(p => p.id === productId);

    if (product) {
        decreaseBtn.disabled = currentQuantity <= 1;
        increaseBtn.disabled = currentQuantity >= product.stock;
    }
}

function getCurrentProductId() {
    // This is a helper function to get the current product ID from the modal
    // We'll need to store it when opening the modal
    return window.currentProductId || null;
}

document.getElementById('decrease-qty').addEventListener('click', function() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value) || 1;
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
        updateQuantityButtons();
    }
});

document.getElementById('increase-qty').addEventListener('click', function() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value) || 1;
    const productId = getCurrentProductId();
    const product = products.find(p => p.id === productId);

    if (product && currentValue < product.stock) {
        quantityInput.value = currentValue + 1;
        updateQuantityButtons();
    }
});

// Cart management functions
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.textContent = `العربة (${totalItems})`;
    }
}

function loadCategories() {
    // Load categories from products
    const categories = [...new Set(products.map(p => p.category))];
    console.log('Categories loaded:', categories);
}

// User UI update
function updateUserUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const orderHistoryBtn = document.getElementById('order-history-btn');
    const sellerLink = document.getElementById('seller-link');

    if (currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (orderHistoryBtn) orderHistoryBtn.style.display = 'block';
        if (sellerLink) sellerLink.style.display = 'block';

        // Add user profile display
        const userProfile = document.getElementById('user-profile');
        if (userProfile) {
            userProfile.textContent = `مرحباً ${currentUser.fullName}`;
            userProfile.style.display = 'block';
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (orderHistoryBtn) orderHistoryBtn.style.display = 'none';
        if (sellerLink) sellerLink.style.display = 'none';

        const userProfile = document.getElementById('user-profile');
        if (userProfile) {
            userProfile.style.display = 'none';
        }
    }
}

// Modal close functionality
document.addEventListener('DOMContentLoaded', function() {
    // Close modals when clicking on close button
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Product form submission
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addToCart();
        });
    }

    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim().toLowerCase();
            if (query) {
                const filteredProducts = products.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query)
                );
                displayFilteredProducts(filteredProducts);
            } else {
                displayProducts();
            }
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    // Navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.trim();
            filterByCategory(category);
        });
    });

    // Cart modal
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCartModal();
        });
    }

    // Checkout buttons
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'checkout.html';
        });
    }

    const checkoutFromCartBtn = document.getElementById('checkout-from-cart-btn');
    if (checkoutFromCartBtn) {
        checkoutFromCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('cart-modal').style.display = 'none';
            window.location.href = 'checkout.html';
        });
    }

    // Order history
    const orderHistoryBtn = document.getElementById('order-history-btn');
    if (orderHistoryBtn) {
        orderHistoryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showOrderHistoryModal();
        });
    }

    // Seller link
    const sellerLink = document.getElementById('seller-link');
    if (sellerLink) {
        sellerLink.addEventListener('click', function(e) {
            e.preventDefault();
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.accountType === 'seller') {
                window.location.href = 'seller.html';
            } else {
                alert('يجب أن تكون مسجلاً كبائع للوصول إلى لوحة التحكم');
                window.location.href = 'login.html';
            }
        });
    }

    // Auth buttons
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }

    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }
});

function displayFilteredProducts(filteredProducts) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 50px; font-size: 1.2em;">لا توجد منتجات تطابق البحث</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x200?text=صورة+غير+متاحة'">
            <h3>${product.name}</h3>
            <p class="price">${product.price.toLocaleString('ar-EG')} جنيه</p>
            <p class="stock">المخزون: ${product.stock}</p>
            <button class="add-to-cart-btn" onclick="showProductModal(${product.id})">عرض التفاصيل</button>
        `;
        productGrid.appendChild(productCard);
    });
}

function filterByCategory(category) {
    if (category === 'العروض') {
        const discountedProducts = products.filter(product =>
            product.discountType && product.discountValue > 0
        );
        displayFilteredProducts(discountedProducts);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayFilteredProducts(filteredProducts);
    }
}

function showCartModal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');

    cartItemsDiv.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">العربة فارغة</p>';
        cartTotalDiv.innerHTML = '<p><strong>المجموع: 0 جنيه</strong></p>';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartItemsDiv.innerHTML += `
                <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                    <h4>${item.name}</h4>
                    <p>السعر: ${item.price.toLocaleString('ar-EG')} جنيه</p>
                    <p>الكمية: ${item.quantity}</p>
                    <p>المقاس: ${item.size || 'غير محدد'}</p>
                    ${item.description ? `<p>ملاحظات: ${item.description}</p>` : ''}
                    <p><strong>المجموع: ${itemTotal.toLocaleString('ar-EG')} جنيه</strong></p>
                    <button onclick="removeFromCart(${index})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">إزالة</button>
                </div>
            `;
        });

        cartTotalDiv.innerHTML = `<p><strong>المجموع: ${total.toLocaleString('ar-EG')} جنيه</strong></p>`;
    }

    document.getElementById('cart-modal').style.display = 'block';
}

function addToCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('يرجى تسجيل الدخول أولاً لإضافة المنتجات للعربة');
        window.location.href = 'login.html';
        return;
    }

    const productId = getCurrentProductId();
    const product = products.find(p => p.id === productId);
    if (!product) {
        alert('المنتج غير موجود');
        return;
    }

    const size = document.getElementById('size').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const description = document.getElementById('description').value.trim();

    if (!size) {
        alert('يرجى اختيار المقاس');
        return;
    }

    if (quantity > product.stock) {
        alert('الكمية المطلوبة أكبر من المخزون المتاح');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item =>
        item.id === product.id && item.size === size
    );

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            size: size,
            quantity: quantity,
            description: description,
            image: product.image
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Close modal and show success message
    document.getElementById('product-modal').style.display = 'none';
    alert('تم إضافة المنتج للعربة بنجاح!');

    // Clear form
    document.getElementById('product-form').reset();
    document.getElementById('quantity').value = 1;
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCartModal(); // Refresh the modal
}

function showOrderHistoryModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('يرجى تسجيل الدخول أولاً');
        window.location.href = 'login.html';
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.customer.email === currentUser.email);

    const orderHistoryList = document.getElementById('order-history-list');
    orderHistoryList.innerHTML = '';

    if (userOrders.length === 0) {
        orderHistoryList.innerHTML = '<p style="text-align: center; color: #666; padding: 50px; font-size: 1.2em;">لا توجد طلبات سابقة</p>';
    } else {
        userOrders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-item';

            let statusText = order.status;
            let statusColor = '';
            if (order.status === 'pending') {
                statusText = 'قيد المراجعة';
                statusColor = '#ffc107';
            } else if (order.status === 'shipped') {
                statusText = 'تم الشحن';
                statusColor = '#17a2b8';
            } else if (order.status === 'delivered') {
                statusText = 'تم التسليم';
                statusColor = '#28a745';
            } else if (order.status === 'cancelled') {
                statusText = 'ملغي';
                statusColor = '#dc3545';
            }

            let itemsHTML = '<table class="order-table"><thead><tr><th>المنتج</th><th>المقاس</th><th>الكمية</th><th>السعر</th></tr></thead><tbody>';
            order.items.forEach(item => {
                itemsHTML += `<tr><td>${item.name}</td><td>${item.size || '-'}</td><td>${item.quantity}</td><td>${item.price} جنيه</td></tr>`;
            });
            itemsHTML += '</tbody></table>';

            orderDiv.innerHTML = `
                <h3>طلب رقم: ${order.id}</h3>
                <p><strong>التاريخ:</strong> ${new Date(order.date).toLocaleDateString('ar-EG')}</p>
                <p><strong>الحالة:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
                ${itemsHTML}
                <p class="order-total"><strong>المجموع: ${order.total} جنيه</strong></p>
            `;

            orderHistoryList.appendChild(orderDiv);
        });
    }

    document.getElementById('order-history-modal').style.display = 'block';
}

// Store current product ID when opening modal - this is already handled in the main function above

// Call initialization
initializeApp();

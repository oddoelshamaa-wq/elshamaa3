// Check if user is logged in on buyer.html load and is a buyer
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.accountType !== 'buyer') {
    window.location.href = 'index.html';
}

// Delivery prices object - loaded from localStorage or use defaults
let deliveryPrices = JSON.parse(localStorage.getItem('deliveryPrices')) || {
    governorates: {
        'القاهرة': 20,
        'الإسكندرية': 30,
        'الجيزة': 25,
        'الشرقية': 35,
        'الدقهلية': 40,
        'البحيرة': 35,
        'المنوفية': 30,
        'كفر الشيخ': 35,
        'الغربية': 30,
        'القليوبية': 20,
        'الفيوم': 45,
        'بني سويف': 50,
        'المنيا': 55,
        'أسيوط': 60,
        'سوهاج': 65,
        'قنا': 70,
        'الأقصر': 75,
        'أسوان': 80,
        'البحر الأحمر': 85,
        'الوادي الجديد': 90,
        'مطروح': 95,
        'شمال سيناء': 100,
        'جنوب سيناء': 105,
        'الإسماعيلية': 40,
        'بور سعيد': 45,
        'السويس': 35,
        'دمياط': 40
    }
};

// Products data - will be loaded from Firebase
let products = [];

// Load products from Firebase
async function loadProducts() {
    try {
        const result = await dbService.getAllProducts();
        if (result.success) {
            products = result.products;
        } else {
            console.error('Failed to load products:', result.error);
            // Fallback to sample products if Firebase fails
            products = [
                { id: 1, name: 'هاتف ذكي سامسونج', price: 5000, image: 'https://picsum.photos/250/200?random=1', stock: 10, description: 'هاتف ذكي عالي الجودة مع كاميرا ممتازة وأداء سريع.' },
                { id: 2, name: 'لابتوب ديل', price: 15000, image: 'https://picsum.photos/250/200?random=2', stock: 5, description: 'لابتوب قوي مناسب للعمل والألعاب مع شاشة كبيرة.' },
                { id: 3, name: 'سماعات بلوتوث', price: 500, image: 'https://picsum.photos/250/200?random=3', stock: 20, description: 'سماعات بلوتوث مريحة مع صوت عالي الجودة.' },
                { id: 4, name: 'ساعة ذكية', price: 2000, image: 'https://picsum.photos/250/200?random=4', stock: 15, description: 'ساعة ذكية تتبع اللياقة البدنية وتدعم الإشعارات.' },
                { id: 5, name: 'كاميرا DSLR', price: 8000, image: 'https://picsum.photos/250/200?random=5', stock: 3, description: 'كاميرا احترافية للتصوير الفوتوغرافي.' },
                { id: 6, name: 'طابعة ليزر', price: 3000, image: 'https://picsum.photos/250/200?random=6', stock: 8, description: 'طابعة ليزر سريعة وموفرة للحبر.' }
            ];
        }
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to sample products
        products = [
            { id: 1, name: 'هاتف ذكي سامسونج', price: 5000, image: 'https://picsum.photos/250/200?random=1', stock: 10, description: 'هاتف ذكي عالي الجودة مع كاميرا ممتازة وأداء سريع.' },
            { id: 2, name: 'لابتوب ديل', price: 15000, image: 'https://picsum.photos/250/200?random=2', stock: 5, description: 'لابتوب قوي مناسب للعمل والألعاب مع شاشة كبيرة.' },
            { id: 3, name: 'سماعات بلوتوث', price: 500, image: 'https://picsum.photos/250/200?random=3', stock: 20, description: 'سماعات بلوتوث مريحة مع صوت عالي الجودة.' },
            { id: 4, name: 'ساعة ذكية', price: 2000, image: 'https://picsum.photos/250/200?random=4', stock: 15, description: 'ساعة ذكية تتبع اللياقة البدنية وتدعم الإشعارات.' },
            { id: 5, name: 'كاميرا DSLR', price: 8000, image: 'https://picsum.photos/250/200?random=5', stock: 3, description: 'كاميرا احترافية للتصوير الفوتوغرافي.' },
            { id: 6, name: 'طابعة ليزر', price: 3000, image: 'https://picsum.photos/250/200?random=6', stock: 8, description: 'طابعة ليزر سريعة وموفرة للحبر.' }
        ];
    }
}

// Function to reload/sync products from seller updates
function reloadProductsFromLocalStorage() {
    // Get base products (from initial setup)
    const baseProducts = [

    ];

    // Get seller products from localStorage
    const sellerProducts = JSON.parse(localStorage.getItem('sellerProducts')) || [];

    // Merge: base products + seller products (seller products override if same ID)
    const productMap = new Map();

    // Add base products
    baseProducts.forEach(p => productMap.set(p.id, p));

    // Add/override with seller products
    sellerProducts.forEach(p => {
        p.stock = p.stock || p.quantity || 0; // Standardize to use stock
        delete p.quantity; // Remove quantity to avoid confusion
        productMap.set(p.id, p);
    });

    // Convert back to array
    products = Array.from(productMap.values());
    localStorage.setItem('products', JSON.stringify(products));
}

// Load categories and update nav
function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('categories')) || ['الإلكترونيات', 'الملابس', 'المنزل والمطبخ', 'الصحة والجمال'];
    const navUl = document.querySelector('nav ul');
    if (navUl) {
        navUl.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" onclick="filterByCategory('${category}')">${category}</a>`;
            navUl.appendChild(li);
        });
        // Add العروض
        const offersLi = document.createElement('li');
        offersLi.innerHTML = '<a href="#">العروض</a>';
        navUl.appendChild(offersLi);
    }
}

// Filter products by category
function filterByCategory(category) {
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

// Initialize products on page load
loadProducts();

// Offers management - Load from localStorage
let offers = JSON.parse(localStorage.getItem('offers')) || [];

function reloadOffers() {
    offers = JSON.parse(localStorage.getItem('offers')) || [];
}

// Function to calculate discounted price
function getProductPrice(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return { original: 0, discounted: 0, hasDiscount: false };

    const today = new Date();
    const dayOfWeek = today.getDay();

    // First check for direct product discounts (from seller)
    if (product.discountType && product.discountValue > 0) {
        let discountedPrice = product.price;
        if (product.discountType === 'percentage') {
            discountedPrice = product.price * (1 - product.discountValue / 100);
        } else {
            discountedPrice = product.price - product.discountValue;
        }

        discountedPrice = Math.max(0, discountedPrice);
        return { original: product.price, discounted: discountedPrice, hasDiscount: true };
    }

    // Then check for offers (from offers array)
    const applicableOffer = offers.find(offer => offer.productId === productId);

    if (!applicableOffer) {
        return { original: product.price, discounted: product.price, hasDiscount: false };
    }

    let discountedPrice = product.price;
    if (applicableOffer.discountType === 'percentage') {
        discountedPrice = product.price * (1 - applicableOffer.discountValue / 100);
    } else {
        discountedPrice = product.price - applicableOffer.discountValue;
    }

    discountedPrice = Math.max(0, discountedPrice);

    return { original: product.price, discounted: discountedPrice, hasDiscount: true };
}



// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.textContent = `العربة (${cartCount})`;
    }
}

function addToCart(productId, quantity = 1, description = '', size = '') {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if there's enough stock
    if (quantity > product.stock) {
        alert(`الكمية المطلوبة (${quantity}) أكبر من المتوفر في المخزون (${product.stock}). يرجى تقليل الكمية.`);
        return;
    }

    const pricing = getProductPrice(productId); // Get current pricing including discounts
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    if (existingItem) {
        // Check if adding this quantity would exceed stock
        if (existingItem.quantity + quantity > product.stock) {
            alert(`لا يمكن إضافة هذه الكمية. الكمية الإجمالية (${existingItem.quantity + quantity}) ستتجاوز المخزون المتوفر (${product.stock}).`);
            return;
        }
        existingItem.quantity += quantity;
        if (description) existingItem.description = description;
    } else {
        cart.push({ ...product, quantity, description, size, price: pricing.discounted }); // Store discounted price at time of adding to cart
    }

    // Do not reduce stock here - stock will be reduced only at checkout
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayProducts(); // Update UI to reflect current stock
    alert('تم إضافة المنتج إلى العربة!');
}

// Checkout functionality
function showCheckout() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('يجب تسجيل الدخول أولاً!');
        window.location.href = 'login.html';
        return;
    }

    // Reload products to get latest stock from localStorage
    reloadProductsFromLocalStorage();

    // Adjust cart quantities to match available stock
    let adjusted = false;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product && product.stock < item.quantity) {
            const originalQty = item.quantity;
            item.quantity = product.stock; // Adjust to available stock
            alert(`تم تعديل كمية "${item.name}" من ${originalQty} إلى ${product.stock} لأن هذه هي الكمية المتاحة في المخزون.`);
            adjusted = true;
        }
    });

    // Update cart in localStorage if adjusted
    if (adjusted) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // If cart is empty after adjustment, prevent checkout
    if (cart.length === 0 || cart.every(item => item.quantity === 0)) {
        alert('لا توجد منتجات متاحة في العربة. يرجى إضافة منتجات أخرى.');
        return;
    }

    const checkoutModal = document.createElement('div');
    checkoutModal.className = 'checkout-modal';
    checkoutModal.innerHTML = `
        <div class="checkout-content">
            <span class="close">&times;</span>
            <h2>إتمام الشراء</h2>
            <div id="cart-items">
                <!-- Cart items will be displayed here -->
            </div>
            <div id="checkout-form">
                <h3>معلومات الشحن</h3>
                <form id="shipping-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="full-name">الاسم الكامل</label>
                            <input type="text" id="full-name" placeholder="الاسم الكامل" value="${currentUser.name}" required readonly>
                        </div>
                        <div class="form-group">
                            <label for="address">العنوان</label>
                            <input type="text" id="address" placeholder="العنوان" value="${currentUser.address}" required readonly>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="phone">رقم الهاتف</label>
                            <input type="tel" id="phone" placeholder="رقم الهاتف" value="${currentUser.phone}" required readonly>
                        </div>
                    </div>

                    <h3>معلومات التوصيل</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="governorate">المحافظة</label>
                            <select id="governorate" required>
                                <option value="">اختر المحافظة</option>
                                <option value="القاهرة">القاهرة</option>
                                <option value="الإسكندرية">الإسكندرية</option>
                                <option value="الجيزة">الجيزة</option>
                                <option value="الشرقية">الشرقية</option>
                                <option value="الدقهلية">الدقهلية</option>
                                <option value="البحيرة">البحيرة</option>
                                <option value="المنوفية">المنوفية</option>
                                <option value="كفر الشيخ">كفر الشيخ</option>
                                <option value="الغربية">الغربية</option>
                                <option value="القليوبية">القليوبية</option>
                                <option value="الفيوم">الفيوم</option>
                                <option value="بني سويف">بني سويف</option>
                                <option value="المنيا">المنيا</option>
                                <option value="أسيوط">أسيوط</option>
                                <option value="سوهاج">سوهاج</option>
                                <option value="قنا">قنا</option>
                                <option value="الأقصر">الأقصر</option>
                                <option value="أسوان">أسوان</option>
                                <option value="البحر الأحمر">البحر الأحمر</option>
                                <option value="الوادي الجديد">الوادي الجديد</option>
                                <option value="مطروح">مطروح</option>
                                <option value="شمال سيناء">شمال سيناء</option>
                                <option value="جنوب سيناء">جنوب سيناء</option>
                                <option value="الإسماعيلية">الإسماعيلية</option>
                                <option value="بور سعيد">بور سعيد</option>
                                <option value="السويس">السويس</option>
                                <option value="دمياط">دمياط</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="region">المنطقة/المدينة</label>
                            <select id="region" required disabled>
                                <option value="">اختر المنطقة أولاً</option>
                            </select>
                        </div>
                    </div>
                    <div id="delivery-cost-display" style="display: none; background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p style="margin: 0; font-weight: bold;">تكلفة التوصيل: <span id="delivery-cost">0</span> جنيه</p>
                    </div>

                    <h3>طريقة الدفع</h3>
                    <div class="payment-methods">
                        <div class="payment-option">
                            <input type="radio" name="payment-method" value="cash" id="cash-method" checked>
                            <label for="cash-method" class="payment-label">
                                <div class="payment-icon">💵</div>
                                <div class="payment-text">
                                    <strong>دفع نقدي عند الاستلام</strong>
                                    <span>ادفع عند استلام الطلب</span>
                                </div>
                            </label>
                        </div>
                        <div class="payment-option">
                            <input type="radio" name="payment-method" value="card" id="card-method">
                            <label for="card-method" class="payment-label">
                                <div class="payment-icon">💳</div>
                                <div class="payment-text">
                                    <strong>دفع بالبطاقة الائتمانية</strong>
                                    <span>آمن وسريع</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div id="card-details" class="card-details-section" style="display: none;">
                        <h4>بيانات البطاقة الائتمانية</h4>
                        <div class="card-preview">
                            <div class="card-front">
                                <div class="card-chip"></div>
                                <div class="card-number-display">•••• •••• •••• ••••</div>
                                <div class="card-info">
                                    <span class="card-holder">اسم صاحب البطاقة</span>
                                    <span class="card-expiry">MM/YY</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="card-number">رقم البطاقة</label>
                                <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" pattern="[0-9\\s]{13,19}">
                                <div class="error-message" id="card-number-error"></div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="card-name">اسم صاحب البطاقة</label>
                                <input type="text" id="card-name" placeholder="كما هو مكتوب على البطاقة">
                                <div class="error-message" id="card-name-error"></div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="card-expiry">تاريخ الانتهاء</label>
                                <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" pattern="(0[1-9]|1[0-2])\/[0-9]{2}">
                                <div class="error-message" id="card-expiry-error"></div>
                            </div>
                            <div class="form-group">
                                <label for="card-cvv">CVV</label>
                                <input type="text" id="card-cvv" placeholder="123" maxlength="3" pattern="[0-9]{3}">
                                <div class="error-message" id="card-cvv-error"></div>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button type="button" id="show-invoice-btn" class="invoice-btn" style="flex: 1; padding: 15px; background: linear-gradient(135deg, #28a745, #20c997); color: white; border: none; border-radius: 8px; font-size: 1.1em; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">عرض الفاتورة</button>
                        <button type="submit" class="submit-btn" style="flex: 1;">إتمام الطلب</button>
                    </div>

                    <div id="invoice-section" class="invoice-section">
                        <h3>📄 فاتورة الطلب</h3>
                        <p class="invoice-subtitle">مراجعة تفصيلية للطلب قبل الدفع</p>
                        <div class="invoice-body">
                            <div class="invoice-section">
                                <h4>📦 تفاصيل المنتجات</h4>
                                <table class="invoice-table">
                                    <thead>
                                        <tr>
                                            <th>المنتج</th>
                                            <th>الكمية</th>
                                            <th>السعر الأصلي</th>
                                            <th>السعر بعد الخصم</th>
                                            <th>المجموع</th>
                                        </tr>
                                    </thead>
                                    <tbody id="invoice-items">
                                        <!-- Invoice items will be populated here -->
                                    </tbody>
                                </table>
                            </div>

                            <div class="invoice-summary">
                                <div class="summary-row">
                                    <span class="summary-label">المجموع الفرعي للمنتجات:</span>
                                    <span class="summary-value" id="invoice-subtotal">0 جنيه</span>
                                </div>
                                <div class="summary-row" id="delivery-row" style="display: none;">
                                    <span class="summary-label">تكلفة التوصيل:</span>
                                    <span class="summary-value" id="invoice-delivery">0 جنيه</span>
                                </div>
                                <div class="summary-row total-row">
                                    <span class="summary-label">المجموع الكلي:</span>
                                    <span class="summary-value total-amount" id="invoice-total">0 جنيه</span>
                                </div>
                            </div>

                            <div class="invoice-notice">
                                <p>⚠️ يرجى مراجعة التفاصيل بعناية قبل إتمام الدفع</p>
                                <p>💡 يمكنك تعديل الكميات أو إزالة منتجات من العربة إذا لزم الأمر</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(checkoutModal);
    checkoutModal.style.display = 'block';

    // Add event listener for show invoice button
    const showInvoiceBtn = checkoutModal.querySelector('#show-invoice-btn');
    const invoiceSection = checkoutModal.querySelector('#invoice-section');
    if (showInvoiceBtn && invoiceSection) {
        showInvoiceBtn.addEventListener('click', () => {
            invoiceSection.classList.toggle('show');
            if (invoiceSection.classList.contains('show')) {
                populateInvoice();
            }
        });
    }

    // Function to populate invoice
    function populateInvoice() {
        const invoiceItems = checkoutModal.querySelector('#invoice-items');
        const invoiceSubtotal = checkoutModal.querySelector('#invoice-subtotal');
        const invoiceDelivery = checkoutModal.querySelector('#invoice-delivery');
        const invoiceTotal = checkoutModal.querySelector('#invoice-total');
        const deliveryRow = checkoutModal.querySelector('#delivery-row');

        if (!invoiceItems || !invoiceSubtotal || !invoiceDelivery || !invoiceTotal || !deliveryRow) return;

        // Populate items with detailed information
        invoiceItems.innerHTML = cart.map(item => {
            const pricing = getProductPrice(item.id);
            const itemTotal = item.quantity * pricing.discounted;
            const originalTotal = item.quantity * pricing.original;
            const discount = originalTotal - itemTotal;
            const product = products.find(p => p.id === item.id);

            // Build detailed product info with image
            let productDetails = `
                <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                    <img src="${product ? product.image : item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-left: 10px; border: 1px solid #ddd;">
                    <div style="flex: 1;">
                        <div style="margin-bottom: 4px;"><strong style="font-size: 16px; color: #2c3e50;">${item.name}</strong></div>`;
            if (item.size && item.size !== 'بدون مقاس') {
                productDetails += `<div style="margin-bottom: 2px;"><small>المقاس: ${item.size}</small></div>`;
            }
            if (product && product.specifications) {
                productDetails += `<div style="margin-bottom: 2px;"><small>المواصفات: ${product.specifications}</small></div>`;
            }
            if (product && product.color) {
                productDetails += `<div style="margin-bottom: 2px;"><small>اللون: ${product.color}</small></div>`;
            }
            if (product && product.weight) {
                productDetails += `<div style="margin-bottom: 2px;"><small>الوزن: ${product.weight}</small></div>`;
            }
            if (item.description) {
                productDetails += `<div style="margin-bottom: 2px;"><small>ملاحظة العميل: ${item.description}</small></div>`;
            }
            productDetails += `
                    </div>
                </div>`;

            return `
                <tr>
                    <td class="product-name" style="text-align: right;">${productDetails}</td>
                    <td class="quantity">${item.quantity}</td>
                    <td class="original-price ${pricing.hasDiscount ? 'strikethrough' : ''}">${pricing.original.toLocaleString('ar-EG')} جنيه</td>
                    <td class="discounted-price">${pricing.discounted.toLocaleString('ar-EG')} جنيه</td>
                    <td class="item-total">${itemTotal.toLocaleString('ar-EG')} جنيه</td>
                </tr>
            `;
        }).join('');

        // Update totals
        invoiceSubtotal.textContent = subtotal.toLocaleString('ar-EG') + ' جنيه';
        if (deliveryCost > 0) {
            invoiceDelivery.textContent = deliveryCost.toLocaleString('ar-EG') + ' جنيه';
            deliveryRow.style.display = 'block';
        } else {
            deliveryRow.style.display = 'none';
        }
        invoiceTotal.textContent = (subtotal + deliveryCost).toLocaleString('ar-EG') + ' جنيه';
    }

    // Display cart items in a table
    const cartItems = document.getElementById('cart-items');
    let tableHTML = '<h3>محتويات العربة</h3><table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;"><thead style="background-color: #f5f5f5;"><tr style="border-bottom: 2px solid #ddd;"><th style="padding: 10px; text-align: right;">المنتج</th><th style="padding: 10px; text-align: right;">السعر الأصلي</th><th style="padding: 10px; text-align: right;">السعر بعد الخصم</th><th style="padding: 10px; text-align: right;">الكمية</th><th style="padding: 10px; text-align: right;">المجموع</th></tr></thead><tbody>';

    let totalDiscount = 0;
    cart.forEach(item => {
        const pricing = getProductPrice(item.id);
        const itemTotal = item.quantity * pricing.discounted;
        const originalTotal = item.quantity * pricing.original;
        const discount = originalTotal - itemTotal;
        totalDiscount += discount;

        let discountInfo = '';
        if (pricing.hasDiscount) {
            discountInfo = ` <span style="color: #d32f2f; font-weight: bold;">(-${discount.toLocaleString('ar-EG')} جنيه)</span>`;
        }

        const priceOriginal = pricing.hasDiscount ? `${pricing.original}` : '-';
        tableHTML += `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px;">${item.name}${item.size ? ' (' + item.size + ')' : ''}${item.description ? ' - ' + item.description : ''}</td><td style="padding: 10px; text-align: center; ${pricing.hasDiscount ? 'text-decoration: line-through; color: #999;' : ''}">${priceOriginal}</td><td style="padding: 10px; text-align: center; font-weight: bold; ${pricing.hasDiscount ? 'color: #d32f2f;' : ''}">${pricing.discounted.toLocaleString('ar-EG')}</td><td style="padding: 10px; text-align: center;">${item.quantity}</td><td style="padding: 10px; text-align: center;">${itemTotal.toLocaleString('ar-EG')}${discountInfo}</td></tr>`;
    });

    const subtotal = cart.reduce((sum, item) => {
        const pricing = getProductPrice(item.id);
        return sum + item.quantity * pricing.discounted;
    }, 0);

    tableHTML += '</tbody></table>';
    if (totalDiscount > 0) {
        tableHTML += `<div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 15px; border-radius: 4px;"><p style="margin: 0; font-weight: bold; color: #856404;">✓ توفير إجمالي: <span style="font-size: 1.1em; color: #d32f2f;">${totalDiscount.toLocaleString('ar-EG')} جنيه</span></p></div>`;
    }
    tableHTML += `<p style="text-align: center; font-size: 1.2em; font-weight: bold; padding: 15px; background-color: #f0f0f0; border-radius: 4px;">المجموع الفرعي: <span style="color: #2196F3;">${subtotal.toLocaleString('ar-EG')} جنيه</span></p>`;

    cartItems.innerHTML = tableHTML;

    // Delivery selection logic
    let deliveryCost = 0;
    const governorateSelect = checkoutModal.querySelector('#governorate');
    const regionSelect = checkoutModal.querySelector('#region');
    const deliveryCostDisplay = checkoutModal.querySelector('#delivery-cost-display');
    const deliveryCostSpan = checkoutModal.querySelector('#delivery-cost');

    // Function to populate regions based on selected governorate
    function populateRegions() {
        const selectedGovernorate = governorateSelect.value;
        regionSelect.innerHTML = '<option value="">اختر المنطقة أولاً</option>';

        if (selectedGovernorate) {
            // Enable region select
            regionSelect.disabled = false;

            // Get regions for this governorate (you can customize this logic)
            const governorateRegions = getGovernorateRegions(selectedGovernorate);
            governorateRegions.forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                regionSelect.appendChild(option);
            });
        } else {
            regionSelect.disabled = true;
        }
    }

    // Function to get regions for a governorate (customize as needed)
    function getGovernorateRegions(governorate) {
        // This is a simplified mapping - you can expand this based on actual regions
        const regionMapping = {
            'القاهرة': ['وسط البلد', 'مدينة نصر', 'هليوبوليس', 'المعادي', 'الزمالك', 'الدقي', 'شبرا', 'الهرم', '6 أكتوبر', 'الشروق', 'العبور', 'العبور الجديدة', 'مدينة بدر', 'مدينة العبور', 'مدينة الشروق', 'مدينة المستقبل', 'مدينة الرحاب', 'مدينة الواحة'],
            'الإسكندرية': ['وسط الإسكندرية', 'العجمي', 'المنتزه', 'سيدي بشر', 'الجمرك', 'اللبان', 'فلمنج', 'ستانلي', 'مينا البصل', 'العامرية', 'برج العرب', 'أبو قير'],
            'الجيزة': ['الجيزة', '6 أكتوبر', 'الشيخ زايد', 'الحوامدية', 'البدرشين', 'الصف', 'أطفيح', 'العياط', 'الباويطي', 'منشأة القناطر'],
            'الشرقية': ['الزقازيق', 'العبور', 'العبور الجديدة', 'مدينة بدر', 'مدينة العبور', 'مدينة الشروق', 'أبو حماد', 'منيا القمح', 'ههيا', 'ديرب نجم', 'كفر صقر', 'فاقوس', 'الإبراهيمية', 'القنايات'],
            'الدقهلية': ['المنصورة', 'طلخا', 'ميت غمر', 'دكرنس', 'أجا', 'منية النصر', 'السنبلاوين', 'تمي الأمديد', 'الكردي', 'بني عبيد', 'المنزلة', 'شربين', 'قرقرة', 'بلقاس'],
            'البحيرة': ['دمنهور', 'كفر الدوار', 'رشيد', 'إدكو', 'أبو المطامير', 'أبو حمص', 'الدلنجات', 'المحمودية', 'الرحمانية', 'إيتاي البارود', 'حوش عيسى', 'شبراخيت', 'كوم حمادة', 'بدر', 'وادي النطرون'],
            'المنوفية': ['شبين الكوم', 'مدينة السادات', 'منوف', 'أشمون', 'الباجور', 'قويسنا', 'بركة السبع', 'تلا', 'الشهداء'],
            'كفر الشيخ': ['كفر الشيخ', 'دسوق', 'فوه', 'مطوبس', 'برج البرلس', 'بلطيم', 'الحامول', 'بيلا', 'الرياض', 'سيدي سالم', 'قلين', 'سيدي غازي'],
            'الغربية': ['طنطا', 'المحلة الكبرى', 'كفر الزيات', 'زفتى', 'السنطة', 'قطور', 'بسيون', 'سمنود'],
            'القليوبية': ['بنها', 'قليوب', 'شبرا الخيمة', 'القناطر الخيرية', 'الخانكة', 'كفر شكر', 'طوخ', 'العبور', 'الخصوص', 'شبين القناطر'],
            'الفيوم': ['الفيوم', 'سنورس', 'إطسا', 'إبشواي', 'طامية', 'الفكرية', 'يوسف الصديق'],
            'بني سويف': ['بني سويف', 'الواسطى', 'ناصر', 'إهناسيا', 'ببا', 'سمسطا', 'الفشن'],
            'المنيا': ['المنيا', 'العدوة', 'مغاغة', 'بني مزار', 'مطاي', 'سمالوط', 'أبو قرقاص', 'مالوي'],
            'أسيوط': ['أسيوط', 'ديروط', 'منفلوط', 'القوصية', 'أبنوب', 'أبو تيج', 'الغنايم', 'ساحل سليم', 'البداري', 'صدفا'],
            'سوهاج': ['سوهاج', 'أخميم', 'البلينا', 'المراغة', 'المنشأة', 'دار السلام', 'جرجا', 'جهينة', 'ساقلتة', 'طما', 'طهطا'],
            'قنا': ['قنا', 'نجع حمادي', 'دشنا', 'الوقف', 'قفط', 'نقادة', 'فرشوط', 'قوص'],
            'الأقصر': ['الأقصر', 'الطود', 'أرمنت', 'الزينية', 'البياضية', 'القرنة', 'إسنا'],
            'أسوان': ['أسوان', 'دراو', 'كوم أمبو', 'نصر النوبة', 'كلابشة', 'إدفو', 'السباعية', 'صحارى'],
            'البحر الأحمر': ['الغردقة', 'الجونة', 'سفاجا', 'مرسى علم', 'القصير', 'رأس غارب', 'شلاتين', 'حلايب'],
            'الوادي الجديد': ['الخارجة', 'الداخلة', 'الفرافرة', 'باريس'],
            'مطروح': ['مرسى مطروح', 'الحمام', 'العلمين', 'سيوة', 'الضبعة', 'النجيلة'],
            'شمال سيناء': ['العريش', 'الشيخ زويد', 'رفح', 'بئر العبد', 'حسنة', 'نخل'],
            'جنوب سيناء': ['شرم الشيخ', 'دهب', 'نويبع', 'طابا', 'سانت كاترين', 'أبو رديس', 'أبو زنيمة'],
            'بورسعيد': ['بور سعيد', 'المناخ', 'الزهور', 'الضواحي', 'الشرق', 'الجنوب', 'المنتزه', 'المناخ الجديدة'],
            'السويس': ['السويس', 'الجناين', 'عتاقة', 'الفيوم', 'الأربعين', 'فيصل'],
            'دمياط': ['دمياط', 'كفر سعد', 'فارسكور', 'الزرقا', 'الروضة', 'ميت أبو غالب'],
            'الإسماعيلية': ['الإسماعيلية', 'فايد', 'القنطرة شرق', 'القنطرة غرب', 'أبو صوير', 'التل الكبير']
        };

        return regionMapping[governorate] || [];
    }

    function updateDeliveryCost() {
        const selectedGovernorate = governorateSelect.value;

        if (selectedGovernorate) {
            // Use only governorate price
            deliveryCost = deliveryPrices.governorates[selectedGovernorate] || 0;

            deliveryCostSpan.textContent = deliveryCost.toLocaleString('ar-EG');
            deliveryCostDisplay.style.display = 'block';

            // Update total display
            const total = subtotal + deliveryCost;
            const totalDisplay = checkoutModal.querySelector('p:last-child span');
            if (totalDisplay) {
                totalDisplay.textContent = total.toLocaleString('ar-EG') + ' جنيه (شامل التوصيل)';
            }

            // Update invoice if it's shown
            if (invoiceSection.classList.contains('show')) {
                populateInvoice();
            }
        } else {
            deliveryCost = 0;
            deliveryCostDisplay.style.display = 'none';
        }
    }

    // Update regions when governorate changes
    governorateSelect.addEventListener('change', () => {
        populateRegions();
        updateDeliveryCost();
    });

    // Update delivery cost when region changes
    regionSelect.addEventListener('change', updateDeliveryCost);

    // Payment method toggle
    const paymentMethods = checkoutModal.querySelectorAll('input[name="payment-method"]');
    const cardDetails = checkoutModal.querySelector('#card-details');

    paymentMethods.forEach(method => {
        method.addEventListener('change', () => {
            if (method.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });

    // Card input validation and preview
    const cardNumberInput = checkoutModal.querySelector('#card-number');
    const cardNameInput = checkoutModal.querySelector('#card-name');
    const cardExpiryInput = checkoutModal.querySelector('#card-expiry');
    const cardCvvInput = checkoutModal.querySelector('#card-cvv');
    const cardNumberDisplay = checkoutModal.querySelector('.card-number-display');
    const cardHolderDisplay = checkoutModal.querySelector('.card-holder');
    const cardExpiryDisplay = checkoutModal.querySelector('.card-expiry');

    // Format card number with spaces
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = formattedValue;
        cardNumberDisplay.textContent = formattedValue || '•••• •••• •••• ••••';
        validateCardNumber(e.target);
    });

    cardNameInput.addEventListener('input', (e) => {
        cardHolderDisplay.textContent = e.target.value || 'اسم صاحب البطاقة';
        validateCardName(e.target);
    });

    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
        cardExpiryDisplay.textContent = value || 'MM/YY';
        validateCardExpiry(e.target);
    });

    cardCvvInput.addEventListener('input', (e) => {
        validateCardCvv(e.target);
    });

    // Validation functions
    function validateCardNumber(input) {
        const errorDiv = checkoutModal.querySelector('#card-number-error');
        const value = input.value.replace(/\s+/g, '');
        const isValid = value.length >= 13 && value.length <= 19 && /^\d+$/.test(value);
        showError(errorDiv, isValid ? '' : 'رقم البطاقة يجب أن يكون بين 13-19 رقم');
        return isValid;
    }

    function validateCardName(input) {
        const errorDiv = checkoutModal.querySelector('#card-name-error');
        const isValid = input.value.trim().length >= 2;
        showError(errorDiv, isValid ? '' : 'يرجى إدخال اسم صاحب البطاقة');
        return isValid;
    }

    function validateCardExpiry(input) {
        const errorDiv = checkoutModal.querySelector('#card-expiry-error');
        const value = input.value;
        const match = value.match(/^(\d{2})\/(\d{2})$/);
        if (!match) {
            showError(errorDiv, 'يرجى إدخال التاريخ بالصيغة MM/YY');
            return false;
        }
        const month = parseInt(match[1]);
        const year = parseInt('20' + match[2]);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const isValid = month >= 1 && month <= 12 && year >= currentYear && (year > currentYear || month >= currentMonth);
        showError(errorDiv, isValid ? '' : 'تاريخ الانتهاء غير صحيح');
        return isValid;
    }

    function validateCardCvv(input) {
        const errorDiv = checkoutModal.querySelector('#card-cvv-error');
        const isValid = /^\d{3}$/.test(input.value);
        showError(errorDiv, isValid ? '' : 'CVV يجب أن يكون 3 أرقام');
        return isValid;
    }

    function showError(errorDiv, message) {
        if (message) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        } else {
            errorDiv.style.display = 'none';
        }
    }

    // Close modal
    checkoutModal.querySelector('.close').onclick = () => {
        checkoutModal.style.display = 'none';
        document.body.removeChild(checkoutModal);
    };

    // Handle form submission
    document.getElementById('shipping-form').addEventListener('submit', (e) => {
        e.preventDefault();

        // Check stock availability before processing order
        let stockError = false;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product || product.stock < item.quantity) {
                alert(`الكمية المطلوبة من "${item.name}" (${item.quantity}) غير متوفرة في المخزون. الكمية المتاحة: ${product ? product.stock : 0}. يرجى تعديل العربة.`);
                stockError = true;
            }
        });

        if (stockError) {
            return; // Stop order processing if stock is insufficient
        }

        // Validate delivery selection
        const governorate = checkoutModal.querySelector('#governorate').value;
        const region = checkoutModal.querySelector('#region').value;

        if (!governorate) {
            alert('يرجى اختيار المحافظة للتوصيل!');
            return;
        }

        if (!region) {
            alert('يرجى اختيار المنطقة/المدينة للتوصيل!');
            return;
        }

        const paymentMethod = checkoutModal.querySelector('input[name="payment-method"]:checked').value;
        let paymentInfo = { method: paymentMethod };

        if (paymentMethod === 'card') {
            const cardNumber = document.getElementById('card-number').value;
            const cardName = document.getElementById('card-name').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;

            // Validate card details
            const isCardNumberValid = validateCardNumber(document.getElementById('card-number'));
            const isCardNameValid = validateCardName(document.getElementById('card-name'));
            const isCardExpiryValid = validateCardExpiry(document.getElementById('card-expiry'));
            const isCardCvvValid = validateCardCvv(document.getElementById('card-cvv'));

            if (!isCardNumberValid || !isCardNameValid || !isCardExpiryValid || !isCardCvvValid) {
                alert('يرجى تصحيح الأخطاء في بيانات البطاقة!');
                return;
            }

            paymentInfo = {
                method: paymentMethod,
                cardNumber: cardNumber.replace(/\d(?=\d{4})/g, '*'), // Mask card number
                cardName: cardName,
                cardExpiry: cardExpiry
            };
        }

        const order = {
            id: Date.now(),
            items: cart,
            subtotal: subtotal,
            deliveryCost: deliveryCost,
            total: subtotal + deliveryCost,
            delivery: {
                governorate: governorate,
                region: region
            },
            customer: {
                name: currentUser.name,
                address: currentUser.address,
                phone: currentUser.phone,
                email: currentUser.email
            },
            payment: paymentInfo,
            status: 'pending',
            date: new Date().toISOString()
        };

        // Reduce stock for each item in the cart
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const oldStock = product.stock;
                product.stock -= item.quantity;

                // Update sellerProducts in localStorage to reflect the stock reduction
                const sellerProducts = JSON.parse(localStorage.getItem('sellerProducts')) || [];
                const sellerProduct = sellerProducts.find(p => p.id === item.id);
                if (sellerProduct) {
                    // Update both stock and quantity properties for consistency
                    sellerProduct.stock = product.stock;
                    sellerProduct.quantity = product.stock;
                    localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts));
                }

                // Create notification for seller
                const notifications = JSON.parse(localStorage.getItem('sellerNotifications')) || [];
                notifications.push({
                    id: Date.now() + Math.random(),
                    type: 'stock_deduction',
                    message: `تم خصم ${item.quantity} قطعة من منتج "${product.name}". المخزون السابق: ${oldStock}، المخزون الحالي: ${product.stock}`,
                    productId: item.id,
                    productName: product.name,
                    quantityDeducted: item.quantity,
                    oldStock: oldStock,
                    newStock: product.stock,
                    timestamp: new Date().toISOString(),
                    read: false
                });
                localStorage.setItem('sellerNotifications', JSON.stringify(notifications));
            }
        });

        // Save updated products to localStorage
        localStorage.setItem('products', JSON.stringify(products));

        // Save order
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        alert('تم إرسال الطلب بنجاح!');
        checkoutModal.style.display = 'none';
        document.body.removeChild(checkoutModal);
    });
}

// Invoice popup functionality
function showInvoicePopup(subtotal, deliveryCost, cart) {
    const invoiceModal = document.createElement('div');
    invoiceModal.className = 'invoice-modal';
    invoiceModal.innerHTML = `
        <div class="invoice-content">
            <span class="close">&times;</span>
            <div class="invoice-header">
                <h2>📄 فاتورة الطلب</h2>
                <p class="invoice-subtitle">مراجعة تفصيلية للطلب قبل الدفع</p>
            </div>
            <div class="invoice-body">
                <div class="invoice-section">
                    <h3>📦 تفاصيل المنتجات</h3>
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الكمية</th>
                                <th>السعر الأصلي</th>
                                <th>السعر بعد الخصم</th>
                                <th>المجموع</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cart.map(item => {
                                const pricing = getProductPrice(item.id);
                                const itemTotal = item.quantity * pricing.discounted;
                                const originalTotal = item.quantity * pricing.original;
                                const discount = originalTotal - itemTotal;
                                const product = products.find(p => p.id === item.id);

                                // Build detailed product info
                                let productDetails = `<strong>${item.name}</strong>`;
                                if (item.size && item.size !== 'بدون مقاس') {
                                    productDetails += `<br><small>المقاس: ${item.size}</small>`;
                                }
                                if (product && product.specifications) {
                                    productDetails += `<br><small>المواصفات: ${product.specifications}</small>`;
                                }
                                if (product && product.color) {
                                    productDetails += `<br><small>اللون: ${product.color}</small>`;
                                }
                                if (product && product.weight) {
                                    productDetails += `<br><small>الوزن: ${product.weight}</small>`;
                                }
                                if (item.description) {
                                    productDetails += `<br><small>ملاحظة العميل: ${item.description}</small>`;
                                }

                                return `
                                    <tr>
                                        <td class="product-name" style="text-align: right;">${productDetails}</td>
                                        <td class="quantity" style="text-align: center;">${item.quantity}</td>
                                        <td class="original-price ${pricing.hasDiscount ? 'strikethrough' : ''}" style="text-align: center;">${pricing.original.toLocaleString('ar-EG')} جنيه</td>
                                        <td class="discounted-price" style="text-align: center;">${pricing.discounted.toLocaleString('ar-EG')} جنيه</td>
                                        <td class="item-total" style="text-align: center; font-weight: bold;">${itemTotal.toLocaleString('ar-EG')} جنيه</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="invoice-summary">
                    <div class="summary-row">
                        <span class="summary-label">المجموع الفرعي للمنتجات:</span>
                        <span class="summary-value">${subtotal.toLocaleString('ar-EG')} جنيه</span>
                    </div>
                    ${deliveryCost > 0 ? `
                    <div class="summary-row">
                        <span class="summary-label">تكلفة التوصيل:</span>
                        <span class="summary-value">${deliveryCost.toLocaleString('ar-EG')} جنيه</span>
                    </div>
                    ` : ''}
                    <div class="summary-row total-row">
                        <span class="summary-label">المجموع الكلي:</span>
                        <span class="summary-value total-amount">${(subtotal + deliveryCost).toLocaleString('ar-EG')} جنيه</span>
                    </div>
                </div>

                <div class="invoice-notice">
                    <p>⚠️ يرجى مراجعة التفاصيل بعناية قبل إتمام الدفع</p>
                    <p>💡 يمكنك تعديل الكميات أو إزالة منتجات من العربة إذا لزم الأمر</p>
                </div>
            </div>
            <div class="invoice-footer">
                <button class="close-invoice-btn">إغلاق الفاتورة</button>
            </div>
        </div>
    `;

    document.body.appendChild(invoiceModal);
    invoiceModal.style.display = 'block';

    // Close modal functions
    const closeModal = () => {
        invoiceModal.style.display = 'none';
        document.body.removeChild(invoiceModal);
    };

    invoiceModal.querySelector('.close').onclick = closeModal;
    invoiceModal.querySelector('.close-invoice-btn').onclick = closeModal;

    window.onclick = (event) => {
        if (event.target == invoiceModal) {
            closeModal();
        }
    };
}

// Display products
function displayProducts(productList = products) {
    // Reload products from localStorage to sync with seller deletions
    reloadProductsFromLocalStorage();

    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        productGrid.innerHTML = '';
        productList.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            const stock = product.quantity || product.stock || 0;
            const stockText = `الكمية المتاحة: ${stock} قطعة`;

            // Get price with discount
            const pricing = getProductPrice(product.id);
            let priceHTML = `<p><strong>السعر:</strong> ${pricing.discounted.toLocaleString('ar-EG')} جنيه</p>`;
            if (pricing.hasDiscount) {
                priceHTML = `<p><span style="text-decoration: line-through; color: #999; font-size: 0.9em;">${pricing.original} جنيه</span> <span style="color: #d32f2f; font-weight: bold; font-size: 1.1em;">${pricing.discounted.toLocaleString('ar-EG')} جنيه</span></p>`;
            }

            const outOfStockOverlay = stock <= 0 ? '<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.2em; font-weight: bold;">غير متوفر</div>' : '';
            productCard.innerHTML = `
                <div style="position: relative; display: inline-block;">
                    <img src="${product.image}" alt="${product.name}" onclick="showProductModal(${product.id})" style="cursor: pointer;">
                    ${outOfStockOverlay}
                </div>
                <h3>${product.name}</h3>
                ${priceHTML}
                <p>${stockText}</p>
                <button onclick="showProductModal(${product.id})" style="background-color: #1e3a8a; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; width: 100%;">عرض التفاصيل والشراء</button>
            `;
            productGrid.appendChild(productCard);
        });
    }
}

// Search functionality
const searchBtn = document.getElementById('search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = document.getElementById('search-input').value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query)
        );
        displayProducts(filteredProducts);
    });
}

const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// Checkout button
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', showCheckout);
}

// Cart modal functionality
function showCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');
    const checkoutFromCartBtn = document.getElementById('checkout-from-cart-btn');

    cartItemsDiv.innerHTML = '<h3 style="text-align: center; color: #2c3e50; margin-bottom: 20px; font-size: 1.5em;">🛒 محتويات العربة</h3>';
    if (cart.length === 0) {
        cartItemsDiv.innerHTML += '<div style="text-align: center; padding: 40px; color: #666;"><p style="font-size: 1.2em;">العربة فارغة</p><p>ابدأ التسوق الآن!</p></div>';
        cartTotalDiv.innerHTML = '';
        checkoutFromCartBtn.style.display = 'none';
    } else {
        cart.forEach((item, index) => {
            const desc = item.description ? ` (${item.description})` : '';
            const sizeText = item.size ? ` - المقاس: ${item.size}` : '';
            const pricing = getProductPrice(item.id);
            const itemTotal = item.quantity * pricing.discounted;
            let priceDisplay = `${item.quantity} x ${pricing.discounted.toLocaleString('ar-EG')} جنيه`;
            if (pricing.hasDiscount) {
                priceDisplay = `${item.quantity} x ${pricing.discounted.toLocaleString('ar-EG')} جنيه <span style="text-decoration: line-through; color: #999; font-size: 0.9em;">(كان ${item.quantity} x ${pricing.original})</span>`;
            }
            const product = products.find(p => p.id === item.id);
            const availableStock = product ? (product.quantity || product.stock || 0) : 0;
            const increaseDisabled = availableStock <= 0 ? 'disabled' : '';
            cartItemsDiv.innerHTML += `
                <div class="cart-item-modern">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                    </div>
                    <div class="cart-item-details">
                        <h4 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 1.1em;">${item.name}${sizeText}${desc}</h4>
                        <p style="margin: 0; color: #666; font-size: 0.9em;">${priceDisplay}</p>
                        <p style="margin: 5px 0 0 0; font-weight: bold; color: #2196F3;">المجموع: ${itemTotal.toLocaleString('ar-EG')} جنيه</p>
                        <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #666;">الكمية المتاحة في المخزون: ${availableStock} قطعة</p>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls-modern">
                            <button onclick="decreaseQuantity(${index})" class="qty-btn">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="${availableStock}" onchange="updateQuantity(${index}, this.value)" style="width: 50px; text-align: center; border: 1px solid #ddd; border-radius: 4px; padding: 2px;">
                            <button onclick="increaseQuantity(${index})" class="qty-btn" ${increaseDisabled}>+</button>
                        </div>
                        <button onclick="removeFromCart(${index})" class="remove-btn-modern">🗑️ إزالة</button>
                    </div>
                </div>
            `;
        });
        const total = cart.reduce((sum, item) => {
            const pricing = getProductPrice(item.id);
            return sum + item.quantity * pricing.discounted;
        }, 0);
        cartTotalDiv.innerHTML = `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; font-size: 1.2em; font-weight: bold; margin: 20px 0;">المجموع الكلي: ${total.toLocaleString('ar-EG')} جنيه</div>`;
        checkoutFromCartBtn.style.display = 'block';
        checkoutFromCartBtn.onclick = () => {
            cartModal.style.display = 'none';
            showCheckout();
        };
    }

    cartModal.style.display = 'block';

    // Close modal
    cartModal.querySelector('.close').onclick = () => {
        cartModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    };
}

const cartLink = document.getElementById('cart-link');
if (cartLink) {
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        showCart();
    });
} else {
    console.error('Cart link not found');
}

// Function to increase quantity in cart
function increaseQuantity(index) {
    const item = cart[index];
    const product = products.find(p => p.id === item.id);
    if (product && product.stock > 0) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showCart(); // Refresh the cart modal
    } else {
        alert('لا توجد كمية كافية في المخزون!');
    }
}

// Function to decrease quantity in cart
function decreaseQuantity(index) {
    const item = cart[index];
    if (item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showCart(); // Refresh the cart modal
    } else {
        removeFromCart(index);
    }
}

// Function to update quantity in cart
function updateQuantity(index, newQuantity) {
    const item = cart[index];
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    newQuantity = parseInt(newQuantity);
    if (isNaN(newQuantity) || newQuantity <= 0) {
        removeFromCart(index);
        return;
    }

    if (newQuantity > product.stock) {
        alert(`الكمية المطلوبة (${newQuantity}) أكبر من المتوفر في المخزون (${product.stock}). يرجى تقليل الكمية.`);
        showCart(); // Refresh to reset the input
        return;
    }

    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCart(); // Refresh the cart modal
}

// Function to remove item from cart
function removeFromCart(index) {
    const item = cart[index];
    const product = products.find(p => p.id === item.id);
    if (product) {
        product.stock += item.quantity; // Restore stock
    }
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('products', JSON.stringify(products));
    updateCartCount();
    showCart(); // Refresh the cart modal
}

// Modal functionality for buyer.html
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const modal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginFormElement = document.getElementById('login-form-element');
const registerFormElement = document.getElementById('register-form-element');

if (loginBtn) {
    loginBtn.onclick = () => {
        modal.style.display = 'block';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    };
}

if (registerBtn) {
    registerBtn.onclick = () => {
        modal.style.display = 'block';
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    };
}

if (modal) {
    document.querySelector('.close').onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        // Authenticate user
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            alert('البريد الإلكتروني أو كلمة المرور غير صحيحة!');
            return;
        }

        // Set current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserUI();

        alert('تم تسجيل الدخول بنجاح!');
        modal.style.display = 'none';
    });

    registerFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const address = e.target[3].value;
        const phone = e.target[4].value;
        const accountType = e.target[5].value;

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            alert('البريد الإلكتروني موجود بالفعل!');
            return;
        }

        // Save new user
        const newUser = { name, email, password, address, phone, accountType };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('تم إنشاء الحساب بنجاح!');
        modal.style.display = 'none';
    });
}

// User UI update
function updateUserUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userActions = document.querySelector('.user-actions');
    if (userActions) {
        if (currentUser) {
            userActions.innerHTML = `
                <span id="user-profile">${currentUser.name}</span>
                <a href="#" id="logout-btn">تسجيل خروج</a>
                <a href="#" id="order-history-btn">سجل الطلبات</a>
                <a href="#" id="cart-link">العربة (0)</a>
                <a href="#" id="checkout-btn">الدفع</a>
            `;
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                });
            }
// Reorder function
function reorder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (order) {
        // Add items to cart
        order.items.forEach(item => {
            addToCart(item.id, item.quantity, item.description);
        });
        alert('تم إضافة المنتجات إلى العربة!');
    }
}

// Cancel order function - moved to global scope
function cancelOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        alert('الطلب غير موجود!');
        return;
    }

    // Check if order is within 24 hours
    const orderDate = new Date(order.date);
    const now = new Date();
    const hoursDiff = (now - orderDate) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
        alert('لا يمكن إلغاء الطلب بعد مرور 24 ساعة من إنشائه.');
        return;
    }

    if (confirm('هل أنت متأكد من إلغاء هذا الطلب؟ سيتم إلغاؤه نهائياً.')) {
        // Restore stock for each item
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                product.stock += item.quantity;
            }
        });

        // Update products in localStorage
        localStorage.setItem('products', JSON.stringify(products));

        // Remove order
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            orders.splice(orderIndex, 1);
            localStorage.setItem('orders', JSON.stringify(orders));
            showOrderHistory(); // Refresh the order history
            alert('تم إلغاء الطلب بنجاح! تم إعادة الكميات إلى المخزون.');
        }
    }
}

// Attach order history button event
const orderHistoryBtn = document.getElementById('order-history-btn');
if (orderHistoryBtn) {
    orderHistoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showOrderHistory();
    });
}
            // Attach cart link event
            const cartLink = document.getElementById('cart-link');
            if (cartLink) {
                cartLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    showCart();
                });
            }
            // Attach checkout button event
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', showCheckout);
            }
        } else {
            userActions.innerHTML = `
                <a href="login.html" id="login-btn">تسجيل الدخول</a>
                <a href="register.html" id="register-btn">إنشاء حساب</a>
                <a href="#" id="cart-link">العربة (0)</a>
                <a href="#" id="checkout-btn">الدفع</a>
            `;
            // Attach cart link event
            const cartLink = document.getElementById('cart-link');
            if (cartLink) {
                cartLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    showCart();
                });
            }
            // Attach checkout button event
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', showCheckout);
            }
        }
        updateCartCount();
    }
}

// Product modal functionality
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const productModal = document.getElementById('product-modal');
    const productModalTitle = document.getElementById('product-modal-title');
    const productStatus = document.getElementById('product-status');
    const productDetails = document.getElementById('product-details');
    const productForm = document.getElementById('product-form');

    productModalTitle.textContent = product.name;
    
    // Display stock status
    let statusHTML = '';
    if (product.stock > 0) {
        statusHTML = `<div style="background-color: #d4edda; color: #155724; border: 2px solid #28a745; display: inline-block; padding: 10px 20px; border-radius: 6px;">✓ متوفر - ${product.stock} قطعة متاحة</div>`;
    } else {
        statusHTML = '';
    }
    productStatus.innerHTML = statusHTML;
    
    const pricing = getProductPrice(product.id);
    let priceHTML = `<p style="margin-top: 15px;"><strong>السعر:</strong> ${pricing.discounted.toLocaleString('ar-EG')} جنيه</p>`;
    if (pricing.hasDiscount) {
        priceHTML = `<p style="margin-top: 15px;"><span style="text-decoration: line-through; color: #999; font-size: 0.9em;">${pricing.original} جنيه</span> <span style="color: #d32f2f; font-weight: bold; font-size: 1.2em;">${pricing.discounted.toLocaleString('ar-EG')} جنيه</span></p>`;
    }
    
    productDetails.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width: 100%; max-width: 300px; height: auto; margin-bottom: 15px; border-radius: 8px;">
        <p><strong>الوصف:</strong></p>
        <p style="line-height: 1.8; color: #555;">${product.description || 'لا يوجد وصف متوفر'}</p>
        ${priceHTML}
        ${product.specifications ? `<p><strong>المواصفات الفنية:</strong></p><p style="line-height: 1.6; color: #666; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">${product.specifications}</p>` : ''}
        ${product.color ? `<p><strong>اللون:</strong> ${product.color}</p>` : ''}
        ${product.weight ? `<p><strong>الوزن:</strong> ${product.weight}</p>` : ''}
    `;

    // Populate size dropdown
    const sizeSelect = document.getElementById('size');
    sizeSelect.innerHTML = '<option value="">اختر المقاس</option>';
    if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    } else {
        const option = document.createElement('option');
        option.value = 'بدون مقاس';
        option.textContent = 'بدون مقاس';
        sizeSelect.appendChild(option);
    }

    // Disable form if out of stock
    const addBtn = document.getElementById('add-to-cart-btn');
    const quantityInput = document.getElementById('quantity');
    const descriptionInput = document.getElementById('description');

    if (product.stock <= 0) {
        sizeSelect.disabled = true;
        quantityInput.disabled = true;
        descriptionInput.disabled = true;
        addBtn.disabled = true;
        addBtn.style.backgroundColor = '#ccc';
        addBtn.style.cursor = 'not-allowed';
        addBtn.textContent = 'غير متوفر';
    } else {
        sizeSelect.disabled = false;
        quantityInput.disabled = false;
        descriptionInput.disabled = false;
        addBtn.disabled = false;
        addBtn.style.backgroundColor = '#ff5722';
        addBtn.style.cursor = 'pointer';
        addBtn.textContent = 'أضف إلى العربة';

        // Set max quantity to available stock
        quantityInput.max = product.stock;
        quantityInput.setAttribute('max', product.stock);
    }

    // Reset form
    document.getElementById('quantity').value = product.stock;
    document.getElementById('description').value = '';
    sizeSelect.value = '';

    // Quantity controls
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');

    if (product.stock <= 0) {
        decreaseBtn.disabled = true;
        increaseBtn.disabled = true;
        decreaseBtn.style.opacity = '0.5';
        increaseBtn.style.opacity = '0.5';
    } else {
        decreaseBtn.disabled = false;
        increaseBtn.disabled = false;
        decreaseBtn.style.opacity = '1';
        increaseBtn.style.opacity = '1';

        decreaseBtn.addEventListener('click', () => {
            let currentQty = parseInt(quantityInput.value);
            if (currentQty > 0) {
                quantityInput.value = currentQty - 1;
            }
        });

        increaseBtn.addEventListener('click', () => {
            let currentQty = parseInt(quantityInput.value);
            if (currentQty < product.stock) {
                quantityInput.value = currentQty + 1;
            } else {
                alert('لا يمكن زيادة الكمية أكثر من المتوفر في المخزون!');
            }
        });
    }

    productModal.style.display = 'block';

    // Close modal
    productModal.querySelector('.close').onclick = () => {
        productModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == productModal) {
            productModal.style.display = 'none';
        }
    };

    // Handle form submission
    productForm.onsubmit = (e) => {
        e.preventDefault();
        const quantity = parseInt(document.getElementById('quantity').value);
        const description = document.getElementById('description').value.trim();
        const size = document.getElementById('size').value;

        if (!size) {
            alert('يرجى اختيار المقاس!');
            return;
        }

        if (quantity > product.stock) {
            alert('الكمية المطلوبة أكبر من المتوفر!');
            return;
        }

        addToCart(product.id, quantity, description, size);
        productModal.style.display = 'none';
    };
}

// Order history functionality
function showOrderHistory() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('يجب تسجيل الدخول أولاً!');
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.customer.email === currentUser.email);

    const orderHistoryModal = document.getElementById('order-history-modal');
    const orderHistoryList = document.getElementById('order-history-list');

    if (userOrders.length === 0) {
        orderHistoryList.innerHTML = '<p>لا توجد طلبات سابقة</p>';
    } else {
        orderHistoryList.innerHTML = '';
        userOrders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-item';
            const paymentMethodText = order.payment ? (order.payment.method === 'cash' ? 'دفع نقدي عند الاستلام' : 'دفع بالبطاقة الائتمانية') : 'غير محدد';
            const daysLeft = order.tracking ? Math.ceil((new Date(order.tracking.estimatedDelivery) - new Date()) / (1000 * 60 * 60 * 24)) : 'غير محدد';
            const trackingInfo = order.tracking ? `
                <h4>تتبع الطلب:</h4>
                <p><strong>الحالة:</strong> ${order.tracking.status}</p>
                <p><strong>الموقع الحالي:</strong> ${order.tracking.currentLocation}</p>
                <p><strong>السائق:</strong> ${order.tracking.driverName} (${order.tracking.driverPhone})</p>
                <p><strong>الأيام المتبقية للتسليم:</strong> ${daysLeft > 0 ? daysLeft : 'تم التسليم'}</p>
            ` : '';

            const statusIcon = order.status === 'pending' ? '⏳' : order.status === 'shipped' ? '🚚' : order.status === 'delivered' ? '✅' : '❓';
                orderDiv.innerHTML = `
                    <div class="order-header">
                        <div class="order-summary">
                            <div>
                                <h3>طلب رقم: ${order.id}</h3>
                                <p><strong>التاريخ:</strong> ${new Date(order.date).toLocaleDateString('ar-EG')}</p>
                                <p><strong>الحالة:</strong> ${statusIcon} ${order.status === 'pending' ? 'قيد المراجعة' : order.status === 'shipped' ? 'تم الشحن' : order.status === 'delivered' ? 'تم التسليم' : order.status}</p>
                            </div>
                            <div style="text-align: left;">
                                <p><strong>المجموع:</strong> ${order.total.toLocaleString('ar-EG')} جنيه</p>
                                <p><strong>طريقة الدفع:</strong> ${paymentMethodText}</p>
                            </div>
                        </div>
                    </div>
                    <div class="delivery-section">
                        <h4>معلومات التسليم:</h4>
                        <div class="customer-info">
                            <p><strong>الاسم:</strong> ${order.customer.name}</p>
                            <p><strong>العنوان:</strong> ${order.customer.address}</p>
                            <p><strong>رقم الهاتف:</strong> ${order.customer.phone}</p>
                        </div>
                        ${trackingInfo}
                    </div>
                    <div class="products-section">
                        <h4>المنتجات:</h4>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
                            <thead>
                                <tr style="background-color: #007bff; color: white;">
                                    <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">المنتج</th>
                                    <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">الكمية</th>
                                    <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">السعر</th>
                                    <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">المجموع</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.items.map(item => {
                                    const desc = item.description ? ` (${item.description})` : '';
                                    return `<tr style="background-color: #ffffff;">
                                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${item.name}${desc}</td>
                                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${item.quantity}</td>
                                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${item.price.toLocaleString('ar-EG')} جنيه</td>
                                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold;">${(item.quantity * item.price).toLocaleString('ar-EG')} جنيه</td>
                                    </tr>`;
                                }).join('')}
                                <tr style="background-color: #e9ecef; font-weight: bold;">
                                    <td colspan="3" style="border: 1px solid #ddd; padding: 12px; text-align: right;">المجموع الكلي</td>
                                    <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: #28a745;">${order.total.toLocaleString('ar-EG')} جنيه</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="actions-section">
                        <div class="order-actions">
                            <button class="reorder-btn" onclick="reorder(${order.id})">إعادة الطلب</button>
                            <button class="receipt-btn" onclick="showReceipt(${order.id})">عرض الإيصال</button>
                            ${order.status === 'pending' ? `<button class="cancel-btn" onclick="cancelOrder(${order.id})">إلغاء الطلب</button>` : ''}
                        </div>
                    </div>
                `;
            orderHistoryList.appendChild(orderDiv);
        });
    }

    orderHistoryModal.style.display = 'block';

    // Close modal
    orderHistoryModal.querySelector('.close').onclick = () => {
        orderHistoryModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == orderHistoryModal) {
            orderHistoryModal.style.display = 'none';
        }
    };

    // Filter and sort functionality
    const statusFilter = document.getElementById('status-filter');
    const sortNewest = document.getElementById('sort-newest');
    const sortOldest = document.getElementById('sort-oldest');

    function displayFilteredOrders(orders) {
        const selectedStatus = statusFilter.value;
        let filteredOrders = selectedStatus ? orders.filter(order => order.status === selectedStatus) : orders;

        // Sort orders
        if (sortNewest.classList.contains('active')) {
            filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortOldest.classList.contains('active')) {
            filteredOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        orderHistoryList.innerHTML = '';
        if (filteredOrders.length === 0) {
            orderHistoryList.innerHTML = '<p>لا توجد طلبات مطابقة للفلاتر المحددة</p>';
        } else {
            filteredOrders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.className = 'order-item';
                const paymentMethodText = order.payment ? (order.payment.method === 'cash' ? 'دفع نقدي عند الاستلام' : 'دفع بالبطاقة الائتمانية') : 'غير محدد';
                const daysLeft = order.tracking ? Math.ceil((new Date(order.tracking.estimatedDelivery) - new Date()) / (1000 * 60 * 60 * 24)) : 'غير محدد';
                const trackingInfo = order.tracking ? `
                    <div class="tracking-info">
                        <h4>تتبع الطلب:</h4>
                        <p><strong>الحالة:</strong> ${order.tracking.status}</p>
                        <p><strong>الموقع الحالي:</strong> ${order.tracking.currentLocation}</p>
                        <p><strong>السائق:</strong> ${order.tracking.driverName} (${order.tracking.driverPhone})</p>
                        <p><strong>الأيام المتبقية للتسليم:</strong> ${daysLeft > 0 ? daysLeft : 'تم التسليم'}</p>
                    </div>
                ` : '';

                const statusIcon = order.status === 'pending' ? '⏳' : order.status === 'shipped' ? '🚚' : order.status === 'delivered' ? '✅' : '❓';
                orderDiv.innerHTML = `
                    <div class="order-summary">
                        <div>
                            <h3>طلب رقم: ${order.id}</h3>
                            <p><strong>التاريخ:</strong> ${new Date(order.date).toLocaleDateString('ar-EG')}</p>
                            <p><strong>الحالة:</strong> ${statusIcon} ${order.status === 'pending' ? 'قيد المراجعة' : order.status === 'shipped' ? 'تم الشحن' : order.status === 'delivered' ? 'تم التسليم' : order.status}</p>
                        </div>
                        <div style="text-align: left;">
                            <p><strong>المجموع:</strong> ${order.total.toLocaleString('ar-EG')} جنيه</p>
                            <p><strong>طريقة الدفع:</strong> ${paymentMethodText}</p>
                        </div>
                    </div>
                    <h4>معلومات التسليم:</h4>
                    <p><strong>الاسم:</strong> ${order.customer.name}</p>
                    <p><strong>العنوان:</strong> ${order.customer.address}</p>
                    <p><strong>رقم الهاتف:</strong> ${order.customer.phone}</p>
                    ${trackingInfo}
                    <h4>المنتجات:</h4>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">المنتج</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">الكمية</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">السعر</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">المجموع</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => {
                                const desc = item.description ? ` (${item.description})` : '';
                                return `<tr style="background-color: #ffffff;">
                                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${item.name}${desc}</td>
                                    <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${item.quantity}</td>
                                    <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${item.price.toLocaleString('ar-EG')} جنيه</td>
                                    <td style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold;">${(item.quantity * item.price).toLocaleString('ar-EG')} جنيه</td>
                                </tr>`;
                            }).join('')}
                            <tr style="background-color: #e9ecef; font-weight: bold;">
                                <td colspan="3" style="border: 1px solid #ddd; padding: 12px; text-align: right;">المجموع الكلي</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: #28a745;">${order.total.toLocaleString('ar-EG')} جنيه</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="order-actions">
                        <button class="reorder-btn" onclick="reorder(${order.id})">إعادة الطلب</button>
                        <button class="receipt-btn" onclick="showReceipt(${order.id})">عرض الإيصال</button>
                        ${order.status === 'pending' ? `<button class="cancel-btn" onclick="cancelOrder(${order.id})">إلغاء الطلب</button>` : ''}
                    </div>
                `;
                orderHistoryList.appendChild(orderDiv);
            });
        }
    }

    // Event listeners for filters and sorting
    statusFilter.addEventListener('change', () => displayFilteredOrders(userOrders));
    sortNewest.addEventListener('click', () => {
        sortNewest.classList.add('active');
        sortOldest.classList.remove('active');
        displayFilteredOrders(userOrders);
    });
    sortOldest.addEventListener('click', () => {
        sortOldest.classList.add('active');
        sortNewest.classList.remove('active');
        displayFilteredOrders(userOrders);
    });

    // Initial display
    displayFilteredOrders(userOrders);
    sortNewest.classList.add('active'); // Default to newest first
}

// Receipt functionality
function showReceipt(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        alert('الطلب غير موجود!');
        return;
    }

    const receiptModal = document.createElement('div');
    receiptModal.className = 'receipt-modal';
    receiptModal.innerHTML = `
        <div class="receipt-content">
            <span class="close">&times;</span>
            <div class="receipt-header">
                <h2>إيصال الطلب</h2>
                <p class="receipt-subtitle">رقم الطلب: ${order.id}</p>
            </div>
            <div class="receipt-body">
                <div class="receipt-section">
                    <h3>معلومات الطلب</h3>
                    <p><strong>تاريخ الطلب:</strong> ${new Date(order.date).toLocaleDateString('ar-EG')}</p>
                    <p><strong>حالة الطلب:</strong> ${order.status === 'pending' ? 'قيد المراجعة' : order.status === 'shipped' ? 'تم الشحن' : order.status === 'delivered' ? 'تم التسليم' : order.status}</p>
                    <p><strong>طريقة الدفع:</strong> ${order.payment.method === 'cash' ? 'دفع نقدي عند الاستلام' : 'دفع بالبطاقة الائتمانية'}</p>
                </div>
                <div class="receipt-section">
                    <h3>معلومات العميل</h3>
                    <p><strong>الاسم:</strong> ${order.customer.name}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${order.customer.email}</p>
                    <p><strong>رقم الهاتف:</strong> ${order.customer.phone}</p>
                    <p><strong>العنوان:</strong> ${order.customer.address}</p>
                </div>
                ${order.delivery ? `
                <div class="receipt-section">
                    <h3>معلومات التوصيل</h3>
                    <p><strong>المحافظة:</strong> ${order.delivery.governorate}</p>
                    <p><strong>المنطقة:</strong> ${order.delivery.region}</p>
                </div>
                ` : ''}
                <div class="receipt-section">
                    <h3>المنتجات</h3>
                    <table class="receipt-table">
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الكمية</th>
                                <th>السعر</th>
                                <th>المجموع</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.price.toLocaleString('ar-EG')} جنيه</td>
                                    <td>${(item.quantity * item.price).toLocaleString('ar-EG')} جنيه</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="receipt-totals">
                    <p><strong>المجموع الفرعي:</strong> ${order.subtotal.toLocaleString('ar-EG')} جنيه</p>
                    ${order.deliveryCost ? `<p><strong>تكلفة التوصيل:</strong> ${order.deliveryCost.toLocaleString('ar-EG')} جنيه</p>` : ''}
                    <div class="total-amount">
                        <p><strong>المجموع الكلي:</strong> ${order.total.toLocaleString('ar-EG')} جنيه</p>
                    </div>
                </div>
            </div>
            <div class="receipt-footer">
                <p>شكراً لك على التسوق معنا!</p>
                <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</p>
                <button class="print-btn" onclick="window.print()">طباعة الإيصال</button>
            </div>
        </div>
    `;

    document.body.appendChild(receiptModal);
    receiptModal.style.display = 'block';

    // Close modal
    receiptModal.querySelector('.close').onclick = () => {
        receiptModal.style.display = 'none';
        document.body.removeChild(receiptModal);
    };

    window.onclick = (event) => {
        if (event.target == receiptModal) {
            receiptModal.style.display = 'none';
            document.body.removeChild(receiptModal);
        }
    };
}

// Attach order history button event
const orderHistoryBtn = document.getElementById('order-history-btn');
if (orderHistoryBtn) {
    orderHistoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showOrderHistory();
    });
}

// Initialize
reloadOffers(); // Load latest offers from localStorage
reloadProductsFromLocalStorage(); // Reload products from localStorage
displayProducts();
updateCartCount();
loadCategories();
updateUserUI();

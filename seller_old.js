// Firebase imports - commented out until proper config is provided
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
// import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, getDoc, query, where, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Firebase Configuration - Replace with your actual Firebase project config
// const firebaseConfig = {
//     apiKey: "your-actual-api-key",
//     authDomain: "your-project.firebaseapp.com",
//     projectId: "your-project-id",
//     storageBucket: "your-project.appspot.com",
//     messagingSenderId: "123456789",
//     appId: "your-app-id"
// };

// Initialize Firebase - commented out until proper config is provided
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// Collections references - commented out until Firebase is properly configured
// const productsRef = collection(db, 'products');
// const ordersRef = collection(db, 'orders');
// const categoriesRef = collection(db, 'categories');
// const driversRef = collection(db, 'drivers');
// const offersRef = collection(db, 'offers');
// const deliveryPricesRef = collection(db, 'deliveryPrices');
// const notificationsRef = collection(db, 'notifications');

// Firebase availability flag
const firebaseAvailable = false;

// Seller products storage (will be loaded from Firebase)
let sellerProducts = [];
let currentEditingProductId = null;

// Seller notifications
let sellerNotifications = [];

// Categories management
let categories = ['الإلكترونيات', 'الملابس', 'المنزل والمطبخ', 'الصحة والجمال'];

// Drivers management
let drivers = [];

// Orders management
let orders = [];

// Offers management
let offers = [];

// Add sample drivers if none exist
if (drivers.length === 0) {
    drivers = [
        {
            id: 1,
            name: 'علي أحمد',
            phone: '0123456789',
            vehicle: 'سيارة صغيرة'
        },
        {
            id: 2,
            name: 'حسن محمد',
            phone: '0987654321',
            vehicle: 'دراجة نارية'
        }
    ];
    localStorage.setItem('drivers', JSON.stringify(drivers));
}



// Function to add product
function addProduct(name, price, image, category, quantity, description, sizes, status = 'متاح', discountType = null, discountValue = 0, specifications = '', color = '', weight = '') {
    const newProduct = {
        id: Date.now(),
        name,
        price: parseFloat(price),
        image,
        category,
        quantity: parseInt(quantity) || 0,
        description: description || '',
        specifications: specifications || '',
        color: color || '',
        weight: weight || '',
        sizes: Array.isArray(sizes) ? sizes : [],
        status: status,
        discountType: discountType,
        discountValue: parseFloat(discountValue) || 0,
        createdAt: new Date().toISOString()
    };

    // Add to local array
    sellerProducts.push(newProduct);

    // Save to localStorage
    localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts));

    displaySellerProducts();
    populateOfferProducts(); // Update offer product options
    displayOffers(); // Update offers display
    displayFeaturedProducts(); // Update featured products display
    alert('تم إضافة المنتج بنجاح!');
}

// Function to load products from Firebase
async function loadProductsFromFirebase() {
    try {
        const querySnapshot = await getDocs(productsRef);
        sellerProducts = [];
        querySnapshot.forEach((doc) => {
            sellerProducts.push({ id: doc.id, ...doc.data() });
        });
        return sellerProducts;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Function to display seller products
function displaySellerProducts() {
    // Load products from localStorage
    sellerProducts = JSON.parse(localStorage.getItem('sellerProducts')) || [];

    const sellerProductsDiv = document.getElementById('seller-products');
    if (sellerProductsDiv) {
        sellerProductsDiv.innerHTML = '';
        sellerProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            const qty = product.quantity || 0;
            const status = product.status || 'متاح';
            let statusColor = '';
            if (status === 'غير متاح') statusColor = 'color: #dc3545;';
            else if (status === 'مخزن مؤقتاً') statusColor = 'color: #ffc107;';
            else statusColor = 'color: #28a745;';

            let priceDisplay = `${product.price} جنيه`;
            if (product.discountType && product.discountValue > 0) {
                let discountedPrice = product.price;
                if (product.discountType === 'percentage') {
                    discountedPrice = product.price * (1 - product.discountValue / 100);
                } else {
                    discountedPrice = product.price - product.discountValue;
                }
                discountedPrice = Math.max(0, discountedPrice);
                priceDisplay = `<span style="text-decoration: line-through; color: #999;">${product.price} جنيه</span> <span style="color: #d32f2f; font-weight: bold;">${discountedPrice.toFixed(2)} جنيه</span>`;
            }

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${priceDisplay}</p>
                <p>الفئة: ${product.category}</p>
                <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                    <label><strong>الكمية المتاحة:</strong></label>
                    <button onclick="adjustQuantity('${product.id}', -1)" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">-</button>
                    <span style="font-weight: bold; font-size: 1.1em;">${qty}</span>
                    <button onclick="adjustQuantity('${product.id}', 1)" style="padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">+</button>
                </div>
                <p><strong>الحالة:</strong> <span style="${statusColor}">${status}</span></p>
                <button onclick="editProduct('${product.id}')">تعديل</button>
                <button onclick="deleteProduct('${product.id}')">حذف المنتج</button>
            `;
            sellerProductsDiv.appendChild(productCard);
        });
    }
}

// Function to delete product
function deleteProduct(productId) {
    sellerProducts = sellerProducts.filter(product => product.id !== productId);
    localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts));
    displaySellerProducts();
    populateOfferProducts(); // Update offer product options
    // Also remove any offers for this product
    offers = offers.filter(offer => offer.productId !== productId);
    localStorage.setItem('offers', JSON.stringify(offers));
    displayOffers();
    alert('تم حذف المنتج!');
}

// Add category form
document.getElementById('add-category-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('category-name').value;

    if (!categories.includes(name)) {
        categories.push(name);
        localStorage.setItem('categories', JSON.stringify(categories));
        displayCategories();
        updateProductCategoryOptions();
        e.target.reset();
        alert('تم إضافة الفئة بنجاح!');
    } else {
        alert('الفئة موجودة بالفعل!');
    }
});

// Add driver form
document.getElementById('add-driver-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('driver-name').value;
    const phone = document.getElementById('driver-phone').value;
    const vehicle = document.getElementById('driver-vehicle').value;

    const newDriver = {
        id: Date.now(),
        name,
        phone,
        vehicle
    };

    drivers.push(newDriver);
    localStorage.setItem('drivers', JSON.stringify(drivers));
    displayDrivers();
    e.target.reset();
    alert('تم إضافة الطيار بنجاح!');
});

// Display categories
function displayCategories() {
    const sellerCategoriesDiv = document.getElementById('seller-categories');
    if (sellerCategoriesDiv) {
        sellerCategoriesDiv.innerHTML = '';
        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category-item';
            categoryDiv.innerHTML = `
                <span>${category}</span>
                <button onclick="deleteCategory('${category}')">حذف</button>
            `;
            sellerCategoriesDiv.appendChild(categoryDiv);
        });
    }
}

// Display drivers
function displayDrivers() {
    const sellerDriversDiv = document.getElementById('seller-drivers');
    if (sellerDriversDiv) {
        sellerDriversDiv.innerHTML = '';
        drivers.forEach(driver => {
            const driverDiv = document.createElement('div');
            driverDiv.className = 'driver-item';
            driverDiv.innerHTML = `
                <h4>${driver.name}</h4>
                <p>الهاتف: ${driver.phone}</p>
                <p>المركبة: ${driver.vehicle}</p>
                <button onclick="deleteDriver(${driver.id})">حذف</button>
            `;
            sellerDriversDiv.appendChild(driverDiv);
        });
    }
}

// Display orders
function displayOrders() {
    const sellerOrdersDiv = document.getElementById('seller-orders');
    if (sellerOrdersDiv) {
        sellerOrdersDiv.innerHTML = '';

        // Add status filter
        const filterDiv = document.createElement('div');
        filterDiv.className = 'order-filters';
        filterDiv.innerHTML = `
            <select id="order-status-filter" onchange="filterOrdersByStatus()">
                <option value="">جميع الحالات</option>
                <option value="pending">قيد المراجعة</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التسليم</option>
                <option value="cancelled">ملغي</option>
            </select>
        `;
        sellerOrdersDiv.appendChild(filterDiv);

        orders.forEach(order => {
            const assignedDriver = order.driver ? drivers.find(d => d.id === order.driver) : null;
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-item';

            // Status with color and icon
            let statusText = order.status;
            let statusClass = '';
            let statusIcon = '';
            if (order.status === 'pending') {
                statusText = 'قيد المراجعة';
                statusClass = 'status-pending';
                statusIcon = '⏳';
            } else if (order.status === 'shipped') {
                statusText = 'تم الشحن';
                statusClass = 'status-shipped';
                statusIcon = '🚚';
            } else if (order.status === 'delivered') {
                statusText = 'تم التسليم';
                statusClass = 'status-delivered';
                statusIcon = '✅';
            } else if (order.status === 'cancelled') {
                statusText = 'ملغي';
                statusClass = 'status-cancelled';
                statusIcon = '❌';
            } else if (order.status === 'still_delivering') {
                statusText = 'لسه هيطع علي طيار';
                statusClass = 'status-still-delivering';
                statusIcon = '🚛';
            } else if (order.status === 'returned') {
                statusText = 'رجع';
                statusClass = 'status-returned';
                statusIcon = '↩️';
            } else if (order.status === 'received') {
                statusText = 'استلام';
                statusClass = 'status-received';
                statusIcon = '📦';
            }

            // Build items table with descriptions
            let itemsHTML = '<table class="order-table"><thead><tr><th>المنتج</th><th>وصف العميل</th><th>المقاس</th><th>الكمية</th><th>السعر</th></tr></thead><tbody>';
            order.items.forEach(item => {
                const desc = item.description ? `<strong>${item.description}</strong>` : '-';
                const size = item.size || '-';
                itemsHTML += `<tr><td>${item.name}</td><td>${desc}</td><td>${size}</td><td>${item.quantity}</td><td>${item.price} جنيه</td></tr>`;
            });
            itemsHTML += '</tbody></table>';

            orderDiv.innerHTML = `
                <div class="order-header">
                    <h4>طلب رقم: ${order.id}</h4>
                    <div class="status-badge ${statusClass}">${statusIcon} ${statusText}</div>
                </div>
                <div class="order-details">
                    <p><strong>العميل:</strong> ${order.customer.name}</p>
                    <p><strong>الهاتف:</strong> ${order.customer.phone}</p>
                    <p><strong>العنوان:</strong> ${order.customer.address}</p>
                    <p><strong>التاريخ:</strong> ${new Date(order.date).toLocaleDateString('ar-EG')}</p>
                    ${itemsHTML}
                    <p class="order-total"><strong>المجموع: ${order.total} جنيه</strong></p>
                    ${assignedDriver ? `<p class="assigned-driver"><strong>الطيار:</strong> ${assignedDriver.name}</p>` : ''}
                </div>
                <div class="order-actions">
                    <select id="driver-select-${order.id}" onchange="assignDriver(${order.id}, this.value)">
                        <option value="">اختر طيار</option>
                        ${drivers.map(driver => `<option value="${driver.id}" ${order.driver === driver.id ? 'selected' : ''}>${driver.name}</option>`).join('')}
                    </select>
                    <select id="status-select-${order.id}" onchange="updateOrderStatus(${order.id}, this.value)">
                        <option value="${order.status}" selected>${statusText}</option>
                        <option value="pending">قيد المراجعة</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="delivered">تم التسليم</option>
                        <option value="cancelled">ملغي</option>
                        <option value="still_delivering">لسه هيطع علي طيار</option>
                        <option value="returned">رجع</option>
                        <option value="received">استلام</option>
                    </select>
                </div>
            `;
            sellerOrdersDiv.appendChild(orderDiv);
        });
    }
}

// Function to filter orders by status
function filterOrdersByStatus() {
    const filterValue = document.getElementById('order-status-filter').value;
    const orderItems = document.querySelectorAll('#seller-orders .order-item');

    orderItems.forEach(item => {
        const statusBadge = item.querySelector('.status-badge');
        if (!statusBadge) return;

        const statusText = statusBadge.textContent.trim();
        let statusValue = '';

        if (statusText.includes('قيد المراجعة')) statusValue = 'pending';
        else if (statusText.includes('تم الشحن')) statusValue = 'shipped';
        else if (statusText.includes('تم التسليم')) statusValue = 'delivered';
        else if (statusText.includes('ملغي')) statusValue = 'cancelled';
        else if (statusText.includes('لسه هيطع علي طيار')) statusValue = 'still_delivering';
        else if (statusText.includes('رجع')) statusValue = 'returned';
        else if (statusText.includes('استلام')) statusValue = 'received';

        if (!filterValue || statusValue === filterValue) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Display orders log
function displayOrdersLog() {
    const sellerOrdersLogDiv = document.getElementById('seller-orders-log');
    if (sellerOrdersLogDiv) {
        sellerOrdersLogDiv.innerHTML = '';
        orders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-log-item';
            
            // Build items table with descriptions
            let itemsHTML = '<table class="order-table"><thead><tr><th>المنتج</th><th>وصف العميل</th><th>المقاس</th><th>الكمية</th><th>السعر</th></tr></thead><tbody>';
            order.items.forEach(item => {
                const desc = item.description ? `<strong>${item.description}</strong>` : '-';
                const size = item.size || '-';
                itemsHTML += `<tr><td>${item.name}</td><td>${desc}</td><td>${size}</td><td>${item.quantity}</td><td>${item.price} جنيه</td></tr>`;
            });
            itemsHTML += '</tbody></table>';
            
            orderDiv.innerHTML = `
                <h4>طلب رقم: ${order.id}</h4>
                <p>التاريخ: ${new Date(order.date).toLocaleDateString('ar-EG')}</p>
                <p>العميل: ${order.customer.name}</p>
                ${itemsHTML}
                <p><strong>المجموع: ${order.total} جنيه</strong></p>
                <p>الحالة: ${order.status === 'pending' ? 'قيد المراجعة' : order.status === 'shipped' ? 'تم الشحن' : order.status === 'delivered' ? 'تم التسليم' : order.status === 'cancelled' ? 'ملغي' : order.status}</p>
            `;
            sellerOrdersLogDiv.appendChild(orderDiv);
        });
    }
}

// Update product category options
function updateProductCategoryOptions() {
    const categorySelect = document.getElementById('product-category');
    if (categorySelect) {
        categorySelect.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}

// Delete category
function deleteCategory(categoryName) {
    categories = categories.filter(cat => cat !== categoryName);
    localStorage.setItem('categories', JSON.stringify(categories));
    displayCategories();
    updateProductCategoryOptions();
}

// Delete driver
function deleteDriver(driverId) {
    drivers = drivers.filter(driver => driver.id !== driverId);
    localStorage.setItem('drivers', JSON.stringify(drivers));
    displayDrivers();
}

// Function to edit product
function editProduct(productId) {
    const product = sellerProducts.find(p => p.id === productId);
    if (product) {
        currentEditingProductId = productId;
        document.getElementById('edit-product-name').value = product.name;
        document.getElementById('edit-product-price').value = product.price;
        document.getElementById('edit-product-image').value = product.image;
        document.getElementById('edit-product-category').value = product.category;
        document.getElementById('edit-product-quantity').value = product.quantity || 0;
        document.getElementById('edit-product-description').value = product.description || '';
        document.getElementById('edit-product-status').value = product.status || 'متاح';
        document.getElementById('edit-product-discount-type').value = product.discountType || '';
        document.getElementById('edit-product-discount-value').value = product.discountValue || '';

        // Check the appropriate size checkboxes
        const sizeCheckboxes = document.querySelectorAll('#edit-product-form .sizes-checkboxes input');
        sizeCheckboxes.forEach(cb => {
            cb.checked = product.sizes && product.sizes.includes(cb.value);
        });

        switchTab('edit-product');
    }
}

// Function to cancel edit
function cancelEdit() {
    currentEditingProductId = null;
    switchTab('manage-products');
}

// Assign driver to order
function assignDriver(orderId, driverId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.driver = driverId ? parseInt(driverId) : null;
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
    }
}

// Update order status
function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        const oldStatus = order.status;
        order.status = status;
        
        // Track delivery date when order is delivered
        if (status === 'delivered' && oldStatus !== 'delivered') {
            if (!order.deliveredDate) {
                order.deliveredDate = new Date().toISOString();
            }
        }
        
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
        displayOrdersLog();
        
        // Update profit display when order is delivered
        if (status === 'delivered') {
            displayNetProfit();
        }
    }
}

// Event listener for add product form
document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const image = document.getElementById('product-image').value;
    const category = document.getElementById('product-category').value;
    const quantity = document.getElementById('product-quantity').value;
    const description = document.getElementById('product-description').value;
    const discountType = document.getElementById('product-discount-type').value;
    const discountValue = parseFloat(document.getElementById('product-discount-value').value) || 0;

    // Validate discount
    if (discountType && discountValue <= 0) {
        alert('يرجى إدخال قيمة الخصم أكبر من صفر!');
        return;
    }

    if (!discountType && discountValue > 0) {
        alert('يرجى اختيار نوع الخصم!');
        return;
    }

    // Get selected sizes
    const sizeCheckboxes = document.querySelectorAll('#add-product-form .sizes-checkboxes input:checked');
    const sizes = Array.from(sizeCheckboxes).map(cb => cb.value);

    if (sizes.length === 0) {
        alert('يرجى اختيار مقاس واحد على الأقل!');
        return;
    }

    addProduct(name, price, image, category, quantity, description, sizes, 'متاح', discountType || null, discountValue);

    // Clear form
    document.getElementById('add-product-form').reset();
});

// Event listener for edit product form
document.getElementById('edit-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentEditingProductId) return;

    const name = document.getElementById('edit-product-name').value;
    const price = document.getElementById('edit-product-price').value;
    const image = document.getElementById('edit-product-image').value;
    const category = document.getElementById('edit-product-category').value;
    const quantity = document.getElementById('edit-product-quantity').value;
    const description = document.getElementById('edit-product-description').value;
    const discountType = document.getElementById('edit-product-discount-type').value;
    const discountValue = document.getElementById('edit-product-discount-value').value;

    // Get selected sizes
    const sizeCheckboxes = document.querySelectorAll('#edit-product-form .sizes-checkboxes input:checked');
    const sizes = Array.from(sizeCheckboxes).map(cb => cb.value);

    if (sizes.length === 0) {
        alert('يرجى اختيار مقاس واحد على الأقل!');
        return;
    }

    const product = sellerProducts.find(p => p.id === currentEditingProductId);
    if (product) {
        product.name = name;
        product.price = parseFloat(price);
        product.image = image;
        product.category = category;
        product.quantity = parseInt(quantity) || 0;
        product.description = description || '';
        product.sizes = sizes;
        product.discountType = discountType || null;
        product.discountValue = parseFloat(discountValue) || 0;
        localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts));

        // Update any offers for this product with the new name
        offers.forEach(offer => {
            if (offer.productId === currentEditingProductId) {
                offer.productName = name;
            }
        });
        localStorage.setItem('offers', JSON.stringify(offers));

        displaySellerProducts();
        populateOfferProducts();
        displayOffers();
        displayFeaturedProducts();
        currentEditingProductId = null;
        switchTab('manage-products');
        alert('تم تحديث المنتج بنجاح!');
    }
});

// Tab switching functionality
function switchTab(targetId) {
    // Hide all tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.style.display = 'none';
        pane.classList.remove('active');
    });

    // Show the target tab pane
    const targetPane = document.getElementById(targetId);
    if (targetPane) {
        targetPane.style.display = 'block';
        targetPane.classList.add('active');
    }

    // Update nav links active state
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${targetId}`) {
            link.classList.add('active');
        }
    });

    // Initialize content for specific tabs
    if (targetId === 'delivery-prices') {
        displayDeliveryPrices();
    } else if (targetId === 'notifications') {
        displaySellerNotifications();
    }
}

// Add event listeners to nav links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            switchTab(targetId);
        });
    });

    // Set default active tab
    switchTab('delivery-prices');

    // Initialize offers section
    populateOfferProducts();
    displayOffers();
});

// Function to calculate and display net profit
function calculateNetProfit() {
    let totalEarnings = 0;
    let totalCosts = 0; // Assuming costs are 20% of earnings for simplicity, or you can adjust
    let productSales = {};

    orders.forEach(order => {
        totalEarnings += order.total;
        totalCosts += order.total * 0.2; // Example: 20% cost

        // Track product sales
        order.items.forEach(item => {
            if (productSales[item.name]) {
                productSales[item.name] += item.quantity;
            } else {
                productSales[item.name] = item.quantity;
            }
        });
    });

    const netProfit = totalEarnings - totalCosts;

    // Find most popular product
    let mostPopularProduct = 'لا توجد بيانات';
    let maxSales = 0;
    for (const [product, sales] of Object.entries(productSales)) {
        if (sales > maxSales) {
            maxSales = sales;
            mostPopularProduct = product;
        }
    }

    document.getElementById('total-earnings').textContent = totalEarnings.toFixed(2);
    document.getElementById('total-costs').textContent = totalCosts.toFixed(2);
    document.getElementById('net-profit-amount').textContent = netProfit.toFixed(2);
    document.getElementById('most-popular-product').textContent = mostPopularProduct;
}

// Check if user is logged in and is seller
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.accountType !== 'seller') {
    window.location.href = 'index.html';
}

// Logout functionality
const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// Initialize - Load data from localStorage
sellerProducts = JSON.parse(localStorage.getItem('sellerProducts')) || [];
sellerNotifications = JSON.parse(localStorage.getItem('sellerNotifications')) || [];
categories = JSON.parse(localStorage.getItem('categories')) || ['الإلكترونيات', 'الملابس', 'المنزل والمطبخ', 'الصحة والجمال'];
drivers = JSON.parse(localStorage.getItem('drivers')) || [
    {
        id: 1,
        name: 'علي أحمد',
        phone: '0123456789',
        vehicle: 'سيارة صغيرة'
    },
    {
        id: 2,
        name: 'حسن محمد',
        phone: '0987654321',
        vehicle: 'دراجة نارية'
    }
];
orders = JSON.parse(localStorage.getItem('orders')) || [];
offers = JSON.parse(localStorage.getItem('offers')) || [];

displaySellerProducts();
displayCategories();
displayDrivers();
displayOrders();
displayOrdersLog();
updateProductCategoryOptions();
calculateNetProfit();
populateYearFilter();
populateOfferProducts();
displayOffers();
displayFeaturedProducts();
displayDeliveryPrices();

// Function to populate year filter
function populateYearFilter() {
    const yearSelect = document.getElementById('filter-year');
    if (yearSelect) {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= currentYear - 10; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }
}

// Function to filter orders log
function filterOrdersLog() {
    const yearFilter = document.getElementById('filter-year').value;
    const monthFilter = document.getElementById('filter-month').value;
    const dayFilter = document.getElementById('filter-day').value;

    const sellerOrdersLogDiv = document.getElementById('seller-orders-log');
    if (sellerOrdersLogDiv) {
        sellerOrdersLogDiv.innerHTML = '';
        orders.forEach(order => {
            const orderDate = new Date(order.date);
            const orderYear = orderDate.getFullYear();
            const orderMonth = orderDate.getMonth() + 1; // getMonth() returns 0-11
            const orderDay = orderDate.getDate();

            const matchesYear = !yearFilter || orderYear == yearFilter;
            const matchesMonth = !monthFilter || orderMonth == monthFilter;
            const matchesDay = !dayFilter || orderDay == dayFilter;

            if (matchesYear && matchesMonth && matchesDay) {
                const orderDiv = document.createElement('div');
                orderDiv.className = 'order-log-item';
                
                // Build items table with descriptions
                let itemsHTML = '<table class="order-table"><thead><tr><th>المنتج</th><th>وصف العميل</th><th>المقاس</th><th>الكمية</th><th>السعر</th></tr></thead><tbody>';
                order.items.forEach(item => {
                    const desc = item.description ? `<strong>${item.description}</strong>` : '-';
                    const size = item.size || '-';
                    itemsHTML += `<tr><td>${item.name}</td><td>${desc}</td><td>${size}</td><td>${item.quantity}</td><td>${item.price} جنيه</td></tr>`;
                });
                itemsHTML += '</tbody></table>';
                
                orderDiv.innerHTML = `
                    <h4>طلب رقم: ${order.id}</h4>
                    <p>التاريخ: ${orderDate.toLocaleDateString('ar-EG')}</p>
                    <p>العميل: ${order.customer.name}</p>
                    ${itemsHTML}
                    <p><strong>المجموع: ${order.total} جنيه</strong></p>
                <p>الحالة: ${order.status === 'pending' ? 'قيد المراجعة' : order.status === 'shipped' ? 'تم الشحن' : order.status === 'delivered' ? 'تم التسليم' : order.status === 'cancelled' ? 'ملغي' : order.status}</p>
                `;
                sellerOrdersLogDiv.appendChild(orderDiv);
            }
        });
    }
}

// Add event listeners for filters
document.getElementById('filter-year').addEventListener('change', filterOrdersLog);
document.getElementById('filter-month').addEventListener('change', filterOrdersLog);
document.getElementById('filter-day').addEventListener('change', filterOrdersLog);

// Function to populate offer product options
function populateOfferProducts() {
    const offerProductSelect = document.getElementById('offer-product');
    if (offerProductSelect) {
        offerProductSelect.innerHTML = '';
        sellerProducts.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            offerProductSelect.appendChild(option);
        });
    }
}

// Function to add offer
function addOffer(productId, discountType, discountValue, days) {
    const product = sellerProducts.find(p => p.id === productId);
    if (!product) {
        alert('المنتج غير موجود!');
        return;
    }

    // Check if an offer already exists for this product
    const existingOffer = offers.find(o => o.productId === productId);
    if (existingOffer) {
        alert('يوجد عرض بالفعل لهذا المنتج! يرجى حذفه أولاً إذا كنت تريد تعديله.');
        return;
    }

    const newOffer = {
        id: Date.now(),
        productId,
        productName: product.name,
        discountType,
        discountValue: parseFloat(discountValue),
        days: days.map(d => parseInt(d))
    };

    offers.push(newOffer);
    localStorage.setItem('offers', JSON.stringify(offers));
    displayOffers();
    displayFeaturedProducts(); // Update featured products list
    alert('تم إضافة العرض بنجاح!');
}

// Function to display offers
function displayOffers() {
    const sellerOffersDiv = document.getElementById('seller-offers');
    if (sellerOffersDiv) {
        sellerOffersDiv.innerHTML = '';

        // Get products with discounts
        const productsWithDiscounts = sellerProducts.filter(product => product.discountType && product.discountValue > 0);

        // Combine offers and products with discounts
        const allOffers = [...offers];

        // Add products with discounts as offers
        productsWithDiscounts.forEach(product => {
            allOffers.push({
                id: `product-${product.id}`,
                productId: product.id,
                productName: product.name,
                discountType: product.discountType,
                discountValue: product.discountValue,
                days: [], // No specific days for product discounts
                isProductDiscount: true
            });
        });

        if (allOffers.length === 0) {
            sellerOffersDiv.innerHTML = '<p>لا توجد عروض حالياً.</p>';
            return;
        }

        allOffers.forEach(offer => {
            const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
            const selectedDays = offer.days && offer.days.length > 0 ? offer.days.map(d => dayNames[d]).join(', ') : 'جميع الأيام';

            // Find the product to get original price
            const product = sellerProducts.find(p => p.id === offer.productId);
            let originalPrice = product ? product.price : 0;
            let discountedPrice = originalPrice;
            if (offer.discountType === 'percentage') {
                discountedPrice = originalPrice * (1 - offer.discountValue / 100);
            } else {
                discountedPrice = originalPrice - offer.discountValue;
            }
            discountedPrice = Math.max(0, discountedPrice);

            const offerDiv = document.createElement('div');
            offerDiv.className = 'offer-item';
            const deleteButton = offer.isProductDiscount ?
                `<button onclick="removeProductDiscount(${offer.productId})">إزالة الخصم</button>` :
                `<button onclick="deleteOffer(${offer.id})">حذف العرض</button>`;

            offerDiv.innerHTML = `
                <h4>${offer.productName}</h4>
                <p>نوع الخصم: ${offer.discountType === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}</p>
                <p>قيمة الخصم: ${offer.discountValue} ${offer.discountType === 'percentage' ? '%' : 'جنيه'}</p>
                ${!offer.isProductDiscount ? `<p>أيام الأسبوع: ${selectedDays}</p>` : '<p>خصم دائم على المنتج</p>'}
                <div style="background-color: #f0f0f0; padding: 10px; border-radius: 6px; margin: 10px 0;">
                    <p><strong>السعر الأصلي:</strong> <span style="text-decoration: line-through; color: #999;">${originalPrice} جنيه</span></p>
                    <p style="color: #d32f2f; font-weight: bold;"><strong>السعر بعد الخصم:</strong> ${discountedPrice.toLocaleString('ar-EG')} جنيه</p>
                    <p style="color: #28a745; font-weight: bold;">
                        ✓ توفير: ${(originalPrice - discountedPrice).toLocaleString('ar-EG')} جنيه
                        ${offer.discountType === 'percentage' ? `(${offer.discountValue}%)` : ''}
                    </p>
                </div>
                ${deleteButton}
            `;
            sellerOffersDiv.appendChild(offerDiv);
        });
    }
}

// Function to delete offer
function deleteOffer(offerId) {
    offers = offers.filter(offer => offer.id !== offerId);
    localStorage.setItem('offers', JSON.stringify(offers));
    displayOffers();
    displayFeaturedProducts(); // Update featured products list
    alert('تم حذف العرض!');
}

// Function to remove product discount
function removeProductDiscount(productId) {
    const product = sellerProducts.find(p => p.id === productId);
    if (product) {
        product.discountType = null;
        product.discountValue = 0;
        localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts));
        displaySellerProducts();
        displayOffers();
        displayFeaturedProducts();
        alert('تم إزالة الخصم من المنتج!');
    }
}

// Event listener for add offer form
document.getElementById('add-offer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = parseInt(document.getElementById('offer-product').value);
    const discountType = document.getElementById('discount-type').value;
    const discountValue = document.getElementById('discount-value').value;
    const selectedDays = Array.from(document.querySelectorAll('.days-checkboxes input:checked')).map(cb => cb.value);

    if (selectedDays.length === 0) {
        alert('يرجى اختيار يوم واحد على الأقل!');
        return;
    }

    addOffer(productId, discountType, discountValue, selectedDays);

    // Clear form
    document.getElementById('add-offer-form').reset();
});

// Function to display featured products (products with offers or discounts)
function displayFeaturedProducts() {
    const featuredProductsDiv = document.getElementById('featured-products-list');
    if (featuredProductsDiv) {
        featuredProductsDiv.innerHTML = '';

        // Get products with offers or direct discounts
        const productsWithOffers = sellerProducts.filter(product =>
            offers.some(offer => offer.productId === product.id) || (product.discountType && product.discountValue > 0)
        );

        if (productsWithOffers.length === 0) {
            featuredProductsDiv.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">لا توجد منتجات مميزة حالياً. أضف عرضاً أو خصماً أولاً!</p>';
            return;
        }

        productsWithOffers.forEach(product => {
            const productOffer = offers.find(o => o.productId === product.id);
            const hasDirectDiscount = product.discountType && product.discountValue > 0;

            // Use offer if exists, otherwise use direct discount
            const discountInfo = productOffer || {
                discountType: product.discountType,
                discountValue: product.discountValue,
                days: []
            };

            const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
            const selectedDays = discountInfo.days && discountInfo.days.length > 0 ? discountInfo.days.map(d => dayNames[d]).join(', ') : 'جميع الأيام';

            // Calculate discounted price
            let discountedPrice = product.price;
            if (discountInfo.discountType === 'percentage') {
                discountedPrice = product.price * (1 - discountInfo.discountValue / 100);
            } else {
                discountedPrice = product.price - discountInfo.discountValue;
            }
            discountedPrice = Math.max(0, discountedPrice);

            const card = document.createElement('div');
            const deleteButton = productOffer ?
                `<button onclick="deleteOffer(${productOffer.id})" style="flex: 1;">حذف الخصم</button>` :
                `<button onclick="removeProductDiscount(${product.id})" style="flex: 1;">حذف الخصم</button>`;

            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div style="background-color: #f0f0f0; padding: 10px; border-radius: 6px; margin: 10px 0;">
                    <p><strong>السعر الأصلي:</strong> <span style="text-decoration: line-through; color: #999;">${product.price} جنيه</span></p>
                    <p style="color: #d32f2f; font-weight: bold;"><strong>السعر بعد الخصم:</strong> ${discountedPrice.toLocaleString('ar-EG')} جنيه</p>
                    <p style="color: #28a745; font-weight: bold;">
                        ✓ توفير: ${(product.price - discountedPrice).toLocaleString('ar-EG')} جنيه
                        ${discountInfo.discountType === 'percentage' ? `(${discountInfo.discountValue}%)` : ''}
                    </p>
                </div>

                <p><strong>أيام الخصم:</strong> ${selectedDays}</p>
                <p><strong>الكمية المتاحة:</strong> ${product.quantity} قطعة</p>

                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="editProduct(${product.id})" style="flex: 1;">تعديل المنتج</button>
                    ${deleteButton}
                </div>
            `;
            featuredProductsDiv.appendChild(card);
        });
    }
}

// Function to calculate and display net profit
function displayNetProfit() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const profitDetailsDiv = document.getElementById('profit-details');
    const totalProfitDiv = document.getElementById('total-profit');
    
    if (!profitDetailsDiv || !totalProfitDiv) return;
    
    // Calculate total profit from delivered orders
    let totalProfit = 0;
    let totalDelivered = 0;
    let averageDeliveryDays = 0;
    const deliveryDays = [];
    const profitByProduct = {};
    
    orders.forEach(order => {
        // Only count delivered orders
        if (order.status === 'delivered') {
            totalDelivered++;
            
            // Calculate delivery time
            if (order.date && order.deliveredDate) {
                const orderDate = new Date(order.date);
                const deliveryDate = new Date(order.deliveredDate);
                const daysToDeliver = Math.ceil((deliveryDate - orderDate) / (1000 * 60 * 60 * 24));
                deliveryDays.push(daysToDeliver);
            }
            
            order.items.forEach(item => {
                const product = sellerProducts.find(p => p.id === item.id);
                if (product) {
                    const itemProfit = (item.price * item.quantity);
                    totalProfit += itemProfit;
                    
                    if (!profitByProduct[item.id]) {
                        profitByProduct[item.id] = {
                            name: item.name,
                            quantity: 0,
                            revenue: 0,
                            cost: product.cost || 0
                        };
                    }
                    profitByProduct[item.id].quantity += item.quantity;
                    profitByProduct[item.id].revenue += itemProfit;
                }
            });
        }
    });
    
    // Calculate average delivery days
    if (deliveryDays.length > 0) {
        averageDeliveryDays = Math.round(deliveryDays.reduce((a, b) => a + b, 0) / deliveryDays.length);
    }
    
    // Update total profit display
    totalProfitDiv.textContent = totalProfit.toLocaleString('ar-EG') + ' جنيه';
    
    // Display profit breakdown with delivery stats
    if (Object.keys(profitByProduct).length === 0) {
        profitDetailsDiv.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">لا توجد طلبات مُسلَّمة حتى الآن</p>';
        return;
    }
    
    let html = '<h3 style="margin-bottom: 20px; color: #2c3e50;">إحصائيات التسليم</h3>';
    html += `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 5px 0; font-size: 0.9em;">عدد الطلبات المُسلَّمة</p>
                <h3 style="margin: 10px 0; font-size: 2em;">${totalDelivered}</h3>
            </div>
            <div style="background: linear-gradient(135deg, #2196F3 0%, #1976d2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 5px 0; font-size: 0.9em;">متوسط أيام التسليم</p>
                <h3 style="margin: 10px 0; font-size: 2em;">${averageDeliveryDays} يوم</h3>
            </div>
        </div>
    `;
    
    html += '<h3 style="margin-bottom: 20px; color: #2c3e50;">تفاصيل الأرباح</h3>';
    html += '<div style="display: grid; gap: 15px;">';
    
    Object.values(profitByProduct).forEach(item => {
        const profit = item.revenue - (item.quantity * item.cost);
        html += `
            <div style="background: white; padding: 15px; border-radius: 8px; border-right: 4px solid #667eea; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <p style="margin: 5px 0;"><strong>المنتج:</strong> ${item.name}</p>
                <p style="margin: 5px 0;"><strong>الكمية المباعة:</strong> ${item.quantity} قطعة</p>
                <p style="margin: 5px 0;"><strong>إجمالي الإيرادات:</strong> <span style="color: #2196F3; font-weight: bold;">${item.revenue.toLocaleString('ar-EG')} جنيه</span></p>
                <p style="margin: 5px 0;"><strong>الربح الصافي:</strong> <span style="color: #28a745; font-weight: bold; font-size: 1.1em;">${profit.toLocaleString('ar-EG')} جنيه</span></p>
            </div>
        `;
    });
    
    html += '</div>';
    profitDetailsDiv.innerHTML = html;
}

// Function to adjust product quantity
function adjustQuantity(productId, change) {
    const product = sellerProducts.find(p => p.id === productId);
    if (product) {
        const oldQuantity = product.quantity || 0;
        const newQuantity = Math.max(0, oldQuantity + change);
        product.quantity = newQuantity;
        localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts));

        // Update the main products array to sync stock
        const mainProducts = JSON.parse(localStorage.getItem('products')) || [];
        const mainProduct = mainProducts.find(p => p.id === productId);
        if (mainProduct) {
            mainProduct.stock = newQuantity;
            localStorage.setItem('products', JSON.stringify(mainProducts));
        }

        // Create notification for stock adjustment
        const notifications = JSON.parse(localStorage.getItem('sellerNotifications')) || [];
        const adjustmentType = change > 0 ? 'زيادة' : 'نقصان';
        const quantityChanged = Math.abs(change);

        notifications.push({
            id: Date.now() + Math.random(),
            type: 'stock_adjustment',
            message: `تم ${adjustmentType} كمية المنتج "${product.name}" بمقدار ${quantityChanged} قطعة. الكمية السابقة: ${oldQuantity}، الكمية الجديدة: ${newQuantity}`,
            productId: productId,
            productName: product.name,
            quantityChanged: quantityChanged,
            adjustmentType: adjustmentType,
            oldQuantity: oldQuantity,
            newQuantity: newQuantity,
            timestamp: new Date().toISOString(),
            read: false
        });
        localStorage.setItem('sellerNotifications', JSON.stringify(notifications));

        displaySellerProducts();
        displayFeaturedProducts(); // Update featured products if needed
        alert(`تم تعديل الكمية إلى ${newQuantity} قطعة`);
    }
}

// Function to display seller notifications
function displaySellerNotifications() {
    const notificationsDiv = document.getElementById('seller-notifications');
    if (!notificationsDiv) return;

    notificationsDiv.innerHTML = '';

    if (sellerNotifications.length === 0) {
        notificationsDiv.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">لا توجد إشعارات حالياً</p>';
        return;
    }

    // Sort notifications by timestamp (newest first)
    const sortedNotifications = sellerNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedNotifications.forEach(notification => {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification-item ${notification.read ? 'read' : 'unread'}`;

        let icon = '';
        if (notification.type === 'stock_deduction') {
            icon = '📦';
        } else {
            icon = '🔔';
        }

        const timeAgo = getTimeAgo(new Date(notification.timestamp));

        notificationDiv.innerHTML = `
            <div class="notification-header">
                <span class="notification-icon">${icon}</span>
                <span class="notification-time">${timeAgo}</span>
                ${!notification.read ? '<span class="unread-dot"></span>' : ''}
            </div>
            <div class="notification-content">
                <p>${notification.message}</p>
            </div>
            <div class="notification-actions">
                ${!notification.read ? `<button onclick="markAsRead('${notification.id}')">تحديد كمقروء</button>` : ''}
                <button onclick="deleteNotification('${notification.id}')">حذف</button>
            </div>
        `;

        notificationsDiv.appendChild(notificationDiv);
    });
}

// Function to get time ago string
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'الآن';
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 604800) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    return date.toLocaleDateString('ar-EG');
}

// Function to mark notification as read
function markAsRead(notificationId) {
    const notification = sellerNotifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        localStorage.setItem('sellerNotifications', JSON.stringify(sellerNotifications));
        displaySellerNotifications();
    }
}

// Function to delete notification
function deleteNotification(notificationId) {
    sellerNotifications = sellerNotifications.filter(n => n.id !== notificationId);
    localStorage.setItem('sellerNotifications', JSON.stringify(sellerNotifications));
    displaySellerNotifications();
}

// Function to display delivery prices
function displayDeliveryPrices(mode = 'view') {
    console.log('displayDeliveryPrices called with mode:', mode);
    const deliveryPricesDiv = document.getElementById('delivery-prices-list');
    if (!deliveryPricesDiv) {
        console.log('deliveryPricesDiv not found');
        return;
    }

    const deliveryPrices = JSON.parse(localStorage.getItem('deliveryPrices')) || {
        servicePrice: 10, // سعر الخدمة الأساسي
        governorates: {
            'القاهرة': 30,
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

    deliveryPricesDiv.innerHTML = '';

    if (mode === 'view') {
        // Display service price first
        const servicePriceDiv = document.createElement('div');
        servicePriceDiv.className = 'service-price-display';
        servicePriceDiv.innerHTML = `
            <h3>سعر الخدمة الأساسي: ${deliveryPrices.servicePrice} جنيه</h3>
        `;
        deliveryPricesDiv.appendChild(servicePriceDiv);

        // Display table in view mode
        const table = document.createElement('table');
        table.className = 'delivery-prices-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>المحافظة</th>
                    <th>سعر التوصيل (جنيه)</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(deliveryPrices.governorates).map(([governorate, price]) => `
                    <tr>
                        <td>${governorate}</td>
                        <td>${price}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        deliveryPricesDiv.appendChild(table);

        // Add edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'تعديل الأسعار';
        editButton.style.cssText = 'background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 20px;';
        editButton.onclick = () => displayDeliveryPrices('edit');
        deliveryPricesDiv.appendChild(editButton);
    } else if (mode === 'edit') {
        // Display service price input first
        const servicePriceDiv = document.createElement('div');
        servicePriceDiv.className = 'delivery-price-item';
        servicePriceDiv.innerHTML = `
            <label for="service-price">سعر الخدمة الأساسي:</label>
            <input type="number" id="service-price" value="${deliveryPrices.servicePrice}" min="0" step="1">
            <span>جنيه</span>
        `;
        deliveryPricesDiv.appendChild(servicePriceDiv);

        // Add governorate selector
        const selectorDiv = document.createElement('div');
        selectorDiv.className = 'delivery-price-item';
        selectorDiv.innerHTML = `
            <label for="governorate-select">اختر المحافظة:</label>
            <select id="governorate-select" onchange="showGovernoratePrice()">
                <option value="">اختر محافظة</option>
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
        `;
        deliveryPricesDiv.appendChild(selectorDiv);

        // Container for the price input (initially hidden)
        const priceInputContainer = document.createElement('div');
        priceInputContainer.id = 'price-input-container';
        priceInputContainer.style.display = 'none';
        priceInputContainer.className = 'delivery-price-item';
        priceInputContainer.innerHTML = `
            <label id="price-label"></label>
            <input type="number" id="selected-price" min="0" step="1">
            <span>جنيه</span>
        `;
        deliveryPricesDiv.appendChild(priceInputContainer);

        // Add save and cancel buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'margin-top: 20px; display: flex; gap: 10px;';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'حفظ التغييرات';
        saveButton.style.cssText = 'background-color: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;';
        saveButton.onclick = saveDeliveryPrices;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'إلغاء';
        cancelButton.style.cssText = 'background-color: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;';
        cancelButton.onclick = () => displayDeliveryPrices('view');

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        deliveryPricesDiv.appendChild(buttonContainer);
    }
}

// Function to save delivery prices
function saveDeliveryPrices() {
    const servicePriceInput = document.getElementById('service-price');
    const servicePrice = servicePriceInput ? parseInt(servicePriceInput.value) || 0 : 10;

    const deliveryPrices = JSON.parse(localStorage.getItem('deliveryPrices')) || {
        servicePrice: 10,
        governorates: {}
    };

    const newPrices = { ...deliveryPrices.governorates };

    // Handle selected governorate price
    const selectedGovernorate = document.getElementById('governorate-select').value;
    const selectedPriceInput = document.getElementById('selected-price');
    if (selectedGovernorate && selectedPriceInput) {
        newPrices[selectedGovernorate] = parseInt(selectedPriceInput.value) || 0;
    }

    localStorage.setItem('deliveryPrices', JSON.stringify({ servicePrice, governorates: newPrices }));
    alert('تم حفظ أسعار التوصيل بنجاح!');
}

// Initialize delivery prices display when the tab is shown
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    // Add event listener for delivery-prices tab
    const deliveryPricesLink = document.querySelector('nav ul li a[href="#delivery-prices"]');
    if (deliveryPricesLink) {
        deliveryPricesLink.addEventListener('click', () => {
            displayDeliveryPrices();
        });
    }
});

// Function to show governorate price when selected
function showGovernoratePrice() {
    const select = document.getElementById('governorate-select');
    const selectedGovernorate = select.value;
    const priceInputContainer = document.getElementById('price-input-container');
    const priceLabel = document.getElementById('price-label');
    const priceInput = document.getElementById('selected-price');

    if (selectedGovernorate) {
        const deliveryPrices = JSON.parse(localStorage.getItem('deliveryPrices')) || {
            servicePrice: 10,
            governorates: {}
        };
        const currentPrice = deliveryPrices.governorates[selectedGovernorate] || 0;

        priceLabel.textContent = `${selectedGovernorate} (السعر الحالي: ${currentPrice} جنيه):`;
        priceInput.value = currentPrice;
        priceInputContainer.style.display = 'block';
    } else {
        priceInputContainer.style.display = 'none';
    }
}

// Call on init
displayNetProfit();
displayDeliveryPrices();



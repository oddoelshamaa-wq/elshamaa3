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

// Load products - embedded data for hosting compatibility
async function loadProducts() {
    // Embedded products data for reliable hosting
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

    console.log('Products loaded:', products);
    displayProducts(); // Display products after loading
    return products;
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

// Call initialization
initializeApp();

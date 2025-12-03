// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    alert('يجب تسجيل الدخول أولاً!');
    window.location.href = 'buyer.html';
}

// Load categories and update nav
function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('categories')) || ['الإلكترونيات', 'الملابس', 'المنزل والمطبخ', 'الصحة والجمال'];
    const navUl = document.querySelector('nav ul');
    if (navUl) {
        navUl.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="buyer.html#" onclick="filterByCategory('${category}')">${category}</a>`;
            navUl.appendChild(li);
        });
        // Add العروض
        const offersLi = document.createElement('li');
        offersLi.innerHTML = '<a href="buyer.html#">العروض</a>';
        navUl.appendChild(offersLi);
    }
}

// Display order history
function displayOrderHistory() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.customer.email === currentUser.email);

    const orderHistoryList = document.getElementById('order-history-list');
    if (userOrders.length === 0) {
        orderHistoryList.innerHTML = '<p>لا توجد طلبات سابقة</p>';
    } else {
        orderHistoryList.innerHTML = '';
        // helper to escape HTML from data coming from localStorage
        function escapeHtml(unsafe) {
            if (unsafe === null || unsafe === undefined) return '';
            return String(unsafe)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        userOrders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-item';

            const paymentMethodText = order.payment ? (order.payment.method === 'cash' ? 'دفع نقدي عند الاستلام' : 'دفع بالبطاقة الائتمانية') : 'غير محدد';

            // Status text and class for badge
            let statusText = order.status;
            let statusClass = '';
            if (order.status === 'pending') { statusText = 'قيد المراجعة'; statusClass = 'pending'; }
            else if (order.status === 'shipped') { statusText = 'تم الشحن'; statusClass = 'shipped'; }
            else if (order.status === 'delivered') { statusText = 'تم التسليم'; statusClass = 'delivered'; }
            else if (order.status === 'cancelled') { statusText = 'ملغي'; statusClass = 'cancelled'; }

            // Build products rows
            const productsRows = order.items.map(item => {
                const name = escapeHtml(item.name);
                const desc = item.description ? ' (' + escapeHtml(item.description) + ')' : '';
                const sizeText = item.size ? escapeHtml(item.size) : '-';
                const qty = escapeHtml(item.quantity);
                const price = Number(item.price) || 0;
                const lineTotal = (Number(item.quantity) * price) || 0;
                return `<tr>
                    <td class="pd-name">${name}${desc}</td>
                    <td class="pd-size">${sizeText}</td>
                    <td class="pd-qty">${qty}</td>
                    <td class="pd-price">${price.toLocaleString('ar-EG')} ج</td>
                    <td class="pd-line">${lineTotal.toLocaleString('ar-EG')} ج</td>
                </tr>`;
            }).join('');

            const orderHTML = `
                <div class="order-side-bar"></div>
                <div class="order-content">
                    <div class="order-title-section">
                        <div class="title-left">
                            <p class="order-customer-name">${escapeHtml(order.customer.name)}</p>
                            <p class="order-customer-email">${escapeHtml(order.customer.email)}</p>
                        </div>
                        <div class="title-right">
                            <p class="order-date-large">${escapeHtml(new Date(order.date).toLocaleDateString('ar-EG'))}</p>
                        </div>
                    </div>

                    <div class="order-header-grid">
                        <div class="header-cell">
                            <p class="header-label">طلب رقم:</p>
                            <p class="header-value order-id">${escapeHtml(order.id)}</p>
                        </div>
                        <div class="header-cell">
                            <p class="header-label">طريقة الدفع:</p>
                            <p class="header-value">${escapeHtml(paymentMethodText)}</p>
                        </div>
                        <div class="header-cell">
                            <p class="header-label">الحالة:</p>
                            <p class="header-value"><span class="status-badge ${statusClass}">${statusText}</span></p>
                        </div>
                        <div class="header-cell">
                            <p class="header-label">المجموع:</p>
                            <p class="header-value amount">${escapeHtml(order.total ? order.total.toLocaleString('ar-EG') + ' جنيه' : '0 جنيه')}</p>
                        </div>
                    </div>
                    
                    <h4 class="products-title">المنتجات</h4>
                    <div class="table-wrapper">
                        <table class="order-table">
                            <thead>
                                <tr>
                                    <th>المنتج</th>
                                    <th>المقاس</th>
                                    <th>الكمية</th>
                                    <th>السعر</th>
                                    <th>المجموع</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productsRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            orderDiv.innerHTML = orderHTML;
            orderHistoryList.appendChild(orderDiv);
        });
    }
}

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'buyer.html';
    });
}

// Initialize
loadCategories();
displayOrderHistory();

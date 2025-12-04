// Function to add product
async function addProduct(name, price, image, category, quantity, description, sizes, status = 'متاح', discountType = null, discountValue = 0, specifications = '', color = '', weight = '') {
    const newProduct = {
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
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        // Save to Firebase
        const result = await dbService.addProduct(newProduct);
        if (result.success) {
            sellerProducts.push({ id: result.id, ...newProduct });
            displaySellerProducts();
            populateOfferProducts(); // Update offer product options
            displayOffers(); // Update offers display
            displayFeaturedProducts(); // Update featured products display
            alert('تم إضافة المنتج بنجاح!');
        } else {
            alert('فشل في حفظ المنتج: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('حدث خطأ أثناء إضافة المنتج');
    }
}

// Function to delete product
async function deleteProduct(productId) {
    try {
        const result = await dbService.deleteProduct(productId);
        if (result.success) {
            sellerProducts = sellerProducts.filter(product => product.id !== productId);
            displaySellerProducts();
            populateOfferProducts(); // Update offer product options
            // Also remove any offers for this product
            offers = offers.filter(offer => offer.productId !== productId);
            displayOffers();
            alert('تم حذف المنتج!');
        } else {
            alert('فشل في حذف المنتج: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('حدث خطأ أثناء حذف المنتج');
    }
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

// Function to adjust product quantity
async function adjustQuantity(productId, change) {
    const product = sellerProducts.find(p => p.id === productId);
    if (product) {
        const oldQuantity = product.quantity || 0;
        const newQuantity = Math.max(0, oldQuantity + change);

        try {
            const result = await dbService.updateProduct(productId, { quantity: newQuantity });
            if (result.success) {
                product.quantity = newQuantity;

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
            } else {
                alert('فشل في تحديث الكمية: ' + result.error);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('حدث خطأ أثناء تحديث الكمية');
        }
    }
}

// Function to add offer
async function addOffer(productId, discountType, discountValue, days) {
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
        productId,
        productName: product.name,
        discountType,
        discountValue: parseFloat(discountValue),
        days: days.map(d => parseInt(d)),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        const result = await dbService.addOffer(newOffer);
        if (result.success) {
            offers.push({ id: result.id, ...newOffer });
            displayOffers();
            displayFeaturedProducts(); // Update featured products list
            alert('تم إضافة العرض بنجاح!');
        } else {
            alert('فشل في إضافة العرض: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding offer:', error);
        alert('حدث خطأ أثناء إضافة العرض');
    }
}

// Function to delete offer
async function deleteOffer(offerId) {
    try {
        const result = await dbService.deleteOffer(offerId);
        if (result.success) {
            offers = offers.filter(offer => offer.id !== offerId);
            displayOffers();
            displayFeaturedProducts(); // Update featured products list
            alert('تم حذف العرض!');
        } else {
            alert('فشل في حذف العرض: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting offer:', error);
        alert('حدث خطأ أثناء حذف العرض');
    }
}

// Function to add category
async function addCategory(name) {
    if (!categories.includes(name)) {
        try {
            const result = await dbService.addCategory(name);
            if (result.success) {
                categories.push(name);
                displayCategories();
                updateProductCategoryOptions();
                alert('تم إضافة الفئة بنجاح!');
            } else {
                alert('فشل في إضافة الفئة: ' + result.error);
            }
        } catch (error) {
            console.error('Error adding category:', error);
            alert('حدث خطأ أثناء إضافة الفئة');
        }
    } else {
        alert('الفئة موجودة بالفعل!');
    }
}

// Function to delete category
function deleteCategory(categoryName) {
    categories = categories.filter(cat => cat !== categoryName);
    displayCategories();
    updateProductCategoryOptions();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadSellerData();

    // Initialize displays
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

    // Set default active tab
    switchTab('delivery-prices');

    // Add event listeners to nav links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            switchTab(targetId);
        });
    });
});

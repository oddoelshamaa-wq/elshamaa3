async function loadProducts() {
    try {
        const querySnapshot = await getDocs(productsRef);
        products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        console.log('Products loaded from Firebase:', products);
        return products;
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to localStorage if Firebase fails
        products = JSON.parse(localStorage.getItem('products')) || [
            { id: 1, name: 'هاتف ذكي سامسونج', price: 5000, image: 'https://picsum.photos/250/200?random=1', stock: 10, description: 'هاتف ذكي عالي الجودة مع كاميرا ممتازة وأداء سريع.' },
            { id: 2, name: 'لابتوب ديل', price: 15000, image: 'https://picsum.photos/250/200?random=2', stock: 5, description: 'لابتوب قوي مناسب للعمل والألعاب مع شاشة كبيرة.' },
            { id: 3, name: 'سماعات بلوتوث', price: 500, image: 'https://picsum.photos/250/200?random=3', stock: 20, description: 'سماعات بلوتوث مريحة مع صوت عالي الجودة.' },
            { id: 4, name: 'ساعة ذكية', price: 2000, image: 'https://picsum.photos/250/200?random=4', stock: 15, description: 'ساعة ذكية تتبع اللياقة البدنية وتدعم الإشعارات.' },
            { id: 5, name: 'كاميرا DSLR', price: 8000, image: 'https://picsum.photos/250/200?random=5', stock: 3, description: 'كاميرا احترافية للتصوير الفوتوغرافي.' },
            { id: 6, name: 'طابعة ليزر', price: 3000, image: 'https://picsum.photos/250/200?random=6', stock: 8, description: 'طابعة ليزر سريعة وموفرة للحبر.' }
        ];
        return products;
    }
}
=======
// Load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('./products.json');
        products = await response.json();
        console.log('Products loaded from JSON:', products);
        return products;
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to sample data if JSON fails
        products = [
            { id: 1, name: 'هاتف ذكي سامسونج', price: 5000, image: 'https://picsum.photos/250/200?random=1', stock: 10, description: 'هاتف ذكي عالي الجودة مع كاميرا ممتازة وأداء سريع.' },
            { id: 2, name: 'لابتوب ديل', price: 15000, image: 'https://picsum.photos/250/200?random=2', stock: 5, description: 'لابتوب قوي مناسب للعمل والألعاب مع شاشة كبيرة.' },
            { id: 3, name: 'سماعات بلوتوث', price: 500, image: 'https://picsum.photos/250/200?random=3', stock: 20, description: 'سماعات بلوتوث مريحة مع صوت عالي الجودة.' },
            { id: 4, name: 'ساعة ذكية', price: 2000, image: 'https://picsum.photos/250/200?random=4', stock: 15, description: 'ساعة ذكية تتبع اللياقة البدنية وتدعم الإشعارات.' },
            { id: 5, name: 'كاميرا DSLR', price: 8000, image: 'https://picsum.photos/250/200?random=5', stock: 3, description: 'كاميرا احترافية للتصوير الفوتوغرافي.' },
            { id: 6, name: 'طابعة ليزر', price: 3000, image: 'https://picsum.photos/250/200?random=6', stock: 8, description: 'طابعة ليزر سريعة وموفرة للحبر.' }
        ];
        return products;
    }
}

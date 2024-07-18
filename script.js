document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://fakestoreapi.com/products';
    const cart = [];
    let products = [];
    let categories = [];

    const productContainer = document.querySelector('.product-list');
    const cartContainer = document.querySelector('.cart-list');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const sortSelect = document.getElementById('sort');
    const applyFiltersButton = document.getElementById('apply-filters');

    async function fetchProducts() {
        try {
            const response = await fetch(apiUrl);
            products = await response.json();
            displayProducts(products);
            fetchCategories(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    function fetchCategories(products) {
        const categoriesSet = new Set(products.map(product => product.category));
        categories = ['All Categories', ...categoriesSet];
        populateCategorySelect();
    }

    function populateCategorySelect() {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category === 'All Categories' ? '' : category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    function displayProducts(products) {
        productContainer.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <h3>${product.title}</h3>
                <p>Price: $${product.price}</p>
                <img src="${product.image}" alt="${product.title}" style="width: 100px; height: 100px;">
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productContainer.appendChild(productElement);
        });
    }

    window.addToCart = function (productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.product.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ product, quantity: 1 });
        }
        displayCart();
    };

    window.removeFromCart = function (productId) {
        const cartItemIndex = cart.findIndex(item => item.product.id === productId);
        if (cartItemIndex > -1) {
            cart.splice(cartItemIndex, 1);
        }
        displayCart();
    };

    window.incrementQuantity = function (productId) {
        const cartItem = cart.find(item => item.product.id === productId);
        if (cartItem) {
            cartItem.quantity++;
            displayCart();
        }
    };

    window.decrementQuantity = function (productId) {
        const cartItem = cart.find(item => item.product.id === productId);
        if (cartItem && cartItem.quantity > 1) {
            cartItem.quantity--;
            displayCart();
        }
    };

    function displayCart() {
        cartContainer.innerHTML = '';
        let totalPrice = 0;

        cart.forEach(item => {
            const { product, quantity } = item;
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <h3>${product.title}</h3>
                <p>Price: $${product.price}</p>
                <p>Quantity: 
                    <button onclick="decrementQuantity(${product.id})">-</button> 
                    ${quantity} 
                    <button onclick="incrementQuantity(${product.id})">+</button>
                </p>
                <p>Total: $${(product.price * quantity).toFixed(2)}</p>
                <button onclick="removeFromCart(${product.id})">Remove</button>
            `;
            cartContainer.appendChild(cartItemElement);
            totalPrice += product.price * quantity;
        });

        const totalPriceElement = document.createElement('div');
        totalPriceElement.className = 'total-price';
        totalPriceElement.innerHTML = `<h3>Total Price: $${totalPrice.toFixed(2)}</h3>`;
        cartContainer.appendChild(totalPriceElement);
    }

    applyFiltersButton.addEventListener('click', () => {
        let filteredProducts = [...products];
        const searchQuery = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;
        const sortOrder = sortSelect.value;

        if (searchQuery) {
            filteredProducts = filteredProducts.filter(product =>
                product.title.toLowerCase().includes(searchQuery)
            );
        }

        if (selectedCategory) {
            filteredProducts = filteredProducts.filter(product =>
                product.category === selectedCategory
            );
        }

        if (sortOrder === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        displayProducts(filteredProducts);
    });

    document.getElementById('checkout').addEventListener('click', () => {
        alert('Checking out...');
        // Add checkout functionality here
    });

    fetchProducts();
});

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initFeaturedProducts();
    initProductListing();
    initProductDetail();
    initCart();
    initAuth();
    initCheckoutModal();
    initBrandSlideshow();
});

// Global arrays to store cart and saved items
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];

function saveToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
}

function initNavigation() {
    console.log("Navigation initialized!"); // Debug line
    document.getElementById('home').style.display = 'block';
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            console.log('Navigating to:', target); // Add this line for debugging
            
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
            });
            
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.style.display = 'block';
                console.log('Showing section:', target); // Add this line
            }
            
            document.querySelectorAll('nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');

            if (target === 'cart') {
                updateCartDisplay();
            }
        });
            });

    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.style.display = 'none';    
    const header = document.querySelector('.header .container');
    header.prepend(menuToggle);    
    const nav = document.querySelector('.nav ul');
    menuToggle.addEventListener('click', function() {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
    function handleResize() {
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'block';
            nav.style.display = 'none';
        } else {
            menuToggle.style.display = 'none';
            nav.style.display = 'flex';
        }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
}

async function initFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featuredProducts');
    const fallbackProducts = [
        {
            id: 'FEAT001',
            name: 'Samsung Galaxy S24 Ultra',
            price: 1199.99,
            originalPrice: 1299.99,
            rating: 4.8,
            reviewCount: 2500,
            image: 'https://m.media-amazon.com/images/I/51Qsbgwk1xL._AC_UY327_FMwebp_QL65_.jpg',
            badge: 'Bestseller',
            category: 'electronics'
        },
        {
            id: 'FEAT002',
            name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
            price: 348.00,
            originalPrice: 399.99,
            rating: 4.7,
            reviewCount: 5678,
            image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_UY327_FMwebp_QL65_.jpg',
            badge: 'Limited Deal',
            category: 'electronics'
        },
        {
            id: 'FEAT003',
            name: 'Apple Watch Series 9',
            price: 399.00,
            originalPrice: 429.00,
            rating: 4.6,
            reviewCount: 2345,
            image: 'https://m.media-amazon.com/images/I/81q7NndDVuL._AC_UY327_FMwebp_QL65_.jpg',
            category: 'electronics'
        },
        {
            id: 'FEAT004',
            name: 'LG C3 Series 65-Inch Class OLED Smart TV',
            price: 1596.99,
            originalPrice: 2099.99,
            rating: 4.9,
            reviewCount: 1890,
            image: 'https://m.media-amazon.com/images/I/514eA0gVXbL._AC_UY327_FMwebp_QL65_.jpg',
            badge: 'New',
            category: 'electronics'
        },
        {
            id: 'FEAT005',
            name: 'Dell XPS 15 Laptop',
            price: 1799.99,
            originalPrice: 1999.99,
            rating: 4.7,
            reviewCount: 987,
            image: 'https://m.media-amazon.com/images/I/61Ks9X44eVL._AC_UY327_FMwebp_QL65_.jpg',
            badge: 'Top Rated',
            category: 'electronics'
        },
        {
            id: 'FEAT006',
            name: 'Amazon Echo Dot (5th Gen)',
            price: 49.99,
            originalPrice: 59.99,
            rating: 4.5,
            reviewCount: 6543,
            image: 'https://m.media-amazon.com/images/I/71ndb05YgEL._AC_UY327_FMwebp_QL65_.jpg',
            category: 'electronics'
        }
    ];

    let productsToDisplay = [];
    try {
        const response = await fetch('http://localhost:3000/api/products/electronics');
        if (response.ok) {
            productsToDisplay = await response.json();
        } else {
            console.warn('API fetch failed for featured products, using fallback data.');
            productsToDisplay = fallbackProducts;
        }
    } catch (error) {
        console.error('Error fetching featured products:', error);
        productsToDisplay = fallbackProducts;
    }

    featuredProductsContainer.innerHTML = '';
    productsToDisplay.slice(0, 6).forEach(product => {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100); 
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-product-id', product.id);
        productCard.innerHTML = `
            ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                    <span class="discount">${discount}% off</span>
                </div>
                <div class="rating">
                    ${renderStars(product.rating)}
                    <span class="count">(${product.reviewCount})</span>
                </div>
                <div class="actions">
                    <button class="btn-add-to-cart">Add to Cart</button>
                    <button class="btn-buy-now">Buy Now</button>
                </div>
            </div>
        `;       
        featuredProductsContainer.appendChild(productCard);
    });

    document.querySelectorAll('#featuredProducts .btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productToAdd = productsToDisplay.find(p => p.id === productId);
            if (productToAdd) {
                addToCart({
                    id: productToAdd.id,
                    name: productToAdd.name,
                    price: productToAdd.price,
                    image: productToAdd.image,
                    sku: 'SKU-' + productToAdd.id.substr(0, 5).toUpperCase()
                });
            }
        });
    });
}

async function initProductListing() {
    const productList = document.getElementById('productList');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');
    const applyFiltersBtn = document.getElementById('applyFilters');

    const allProductsFallback = [
        {
            id: 'ELEC001', name: 'Samsung Galaxy S24 Ultra', category: 'electronics', price: 1199.99, originalPrice: 1299.99, rating: 4.8, reviewCount: 2500, image: 'https://m.media-amazon.com/images/I/51Qsbgwk1xL._AC_UY327_FMwebp_QL65_.jpg', badge: 'Bestseller'
        },
        {
            id: 'ELEC002', name: 'Sony WH-1000XM5 Headphones', category: 'electronics', price: 348.00, originalPrice: 399.99, rating: 4.7, reviewCount: 5678, image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_UY327_FMwebp_QL65_.jpg', badge: 'Limited Deal'
        },
        {
            id: 'ELEC003', name: 'Apple Watch Series 9', category: 'electronics', price: 399.00, originalPrice: 429.00, rating: 4.6, reviewCount: 2345, image: 'https://m.media-amazon.com/images/I/81q7NndDVuL._AC_UY327_FMwebp_QL65_.jpg'
        },
        {
            id: 'ELEC004', name: 'LG C3 Series 65-Inch OLED TV', category: 'electronics', price: 1596.99, originalPrice: 2099.99, rating: 4.9, reviewCount: 1890, image: 'https://m.media-amazon.com/images/I/514eA0gVXbL._AC_UY327_FMwebp_QL65_.jpg', badge: 'New'
        },
        {
            id: 'ELEC005', name: 'Dell XPS 15 Laptop', category: 'electronics', price: 1799.99, originalPrice: 1999.99, rating: 4.7, reviewCount: 987, image: 'https://m.media-amazon.com/images/I/61Ks9X44eVL._AC_UY327_FMwebp_QL65_.jpg', badge: 'Top Rated'
        },
        {
            id: 'ELEC006', name: 'Amazon Echo Dot (5th Gen)', category: 'electronics', price: 49.99, originalPrice: 59.99, rating: 4.5, reviewCount: 6543, image: 'https://m.media-amazon.com/images/I/71ndb05YgEL._AC_UY327_FMwebp_QL65_.jpg'
        },
        {
            id: 'CLOTH001', name: 'Levi/s Men/s 501 Original Fit Jeans', category: 'clothing', price: 59.99, originalPrice: 79.50, rating: 4.4, reviewCount: 3456, image: 'https://m.media-amazon.com/images/I/81HRsNLuziL._AC_UL480_FMwebp_QL65_.jpg', badge: 'Trending'
        },
        {
            id: 'CLOTH002', name: 'Hanes Men/s ComfortSoft T-Shirt (5-Pack)', category: 'clothing', price: 24.99, originalPrice: 35.00, rating: 4.3, reviewCount: 789, image: 'https://m.media-amazon.com/images/I/51lcacCccHL._AC_UL480_FMwebp_QL65_.jpg'
        },
        {
            id: 'CLOTH003', name: 'Adidas Women\'s Cloudfoam Pure Running Shoe', category: 'clothing', price: 45.00, originalPrice: 70.00, rating: 4.6, reviewCount: 1500, image: 'https://m.media-amazon.com/images/I/71BeUZyIAtL._AC_UL480_FMwebp_QL65_.jpg'
        },
        {
            id: 'HOME001', name: 'T-fal Ultimate Hard Anodized Nonstick 12-Piece Cookware Set', category: 'home', price: 179.99, originalPrice: 249.99, rating: 4.6, reviewCount: 1230, image: 'https://m.media-amazon.com/images/I/710EzgJTLVL._AC_UL480_FMwebp_QL65_.jpg'
        },
        {
            id: 'HOME002', name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker', category: 'home', price: 89.99, originalPrice: 119.99, rating: 4.7, reviewCount: 8900, image: 'https://m.media-amazon.com/images/I/710KoJMG2lL._AC_UY327_FMwebp_QL65_.jpg'
        },
        {
            id: 'HOME003', name: 'Bissell CrossWave All-in-One Multi-Surface Wet Dry Vac', category: 'home', price: 249.99, originalPrice: 299.99, rating: 4.5, reviewCount: 3200, image: 'https://m.media-amazon.com/images/I/71kqNhpLscL._AC_UL480_FMwebp_QL65_.jpg'
        },
        {
            id: 'BEAUTY001', name: 'Olay Regenerist Micro-Sculpting Cream', category: 'beauty', price: 29.99, originalPrice: 40.00, rating: 4.5, reviewCount: 890, image: 'https://m.media-amazon.com/images/I/71vdM21J5ZL._AC_UL480_FMwebp_QL65_.jpg', badge: 'Popular'
        },
        {
            id: 'BEAUTY002', name: 'Dyson Supersonic Hair Dryer', category: 'beauty', price: 429.00, originalPrice: 450.00, rating: 4.8, reviewCount: 1200, image: 'https://m.media-amazon.com/images/I/71zjSaoBiFL._AC_UL480_FMwebp_QL65_.jpg'
        },
        {
            id: 'BEAUTY003', name: 'Creed Aventus Eau de Parfum', category: 'beauty', price: 299.99, originalPrice: 365.00, rating: 4.7, reviewCount: 432, image: 'https://m.media-amazon.com/images/I/61YMr7quHRL._AC_UL480_FMwebp_QL65_.jpg', badge: 'Exclusive'
        },
        {
            id: 'ACC001', name: 'FEIDUSUN Polarized Sunglasses', category: 'clothing', price: 154.00, originalPrice: 204.00, rating: 4.6, reviewCount: 567, image: 'https://m.media-amazon.com/images/I/51ABDkq99LL._AC_UL480_FMwebp_QL65_.jpg'
        }
    ];

    async function fetchProducts(category = 'all') {
        let products = [];
        try {
            const response = await fetch(`http://localhost:3000/api/products/${category}`);
            if (response.ok) {
                products = await response.json();
            } else {
                console.warn(`API fetch failed for category ${category}, using fallback data.`);
                products = allProductsFallback.filter(p => category === 'all' || p.category === category);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            products = allProductsFallback.filter(p => category === 'all' || p.category === category);
        }
        return products;
    }

    let currentProducts = [];

    async function filterAndSortProducts() {
        currentProducts = await fetchProducts(categoryFilter.value);
        let filtered = [...currentProducts];

        const priceRange = priceFilter.value;
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-');
            if (max) {
                filtered = filtered.filter(p => p.price >= parseFloat(min) && p.price <= parseFloat(max));
            } else {
                filtered = filtered.filter(p => p.price >= parseFloat(min));
            }
        }

        const sortBy = sortFilter.value;
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.dateAdded || b.id) - new Date(a.dateAdded || a.id));
                break;
            case 'rating':
            default: 
                filtered.sort((a, b) => b.rating - a.rating);
        }
        renderProducts(filtered);
    }

    function renderProducts(productsToRender) {
        productList.innerHTML = '';        
        if (productsToRender.length === 0) {
            productList.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
            return;
        }
        
        productsToRender.forEach(product => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-product-id', product.id);
            productCard.innerHTML = `
                ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                        <span class="discount">${discount}% off</span>
                    </div>
                    <div class="rating">
                        ${renderStars(product.rating)}
                        <span class="count">(${product.reviewCount})</span>
                    </div>
                    <div class="actions">
                        <button class="btn-add-to-cart">Add to Cart</button>
                        <button class="btn-buy-now">Buy Now</button>
                    </div>
                </div>
            `;            
            productList.appendChild(productCard);
        });

        document.querySelectorAll('#productList .btn-add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.getAttribute('data-product-id');
                const productToAdd = currentProducts.find(p => p.id === productId);
                if (productToAdd) {
                    addToCart({
                        id: productToAdd.id,
                        name: productToAdd.name,
                        price: productToAdd.price,
                        image: productToAdd.image,
                        sku: 'SKU-' + productToAdd.id.substr(0, 5).toUpperCase()
                    });
                }
            });
        });
    }

    filterAndSortProducts();
    applyFiltersBtn.addEventListener('click', filterAndSortProducts);
}

function initProductDetail() {
    const productDetail = {
        id: 'B08N5WRWNW',
        name: 'Premium Smartphone X1',
        price: 599.99,
        originalPrice: 699.99,
        rating: 4.5,
        reviewCount: 1234,
        image: 'https://m.media-amazon.com/images/I/61jY8W-vw9L._AC_SL1500_.jpg',
        thumbnails: [
            'https://m.media-amazon.com/images/I/61jY8W-vw9L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71qglw1xG2L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61qU8R8xV9L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61qU8R8xV9L._AC_SL1500_.jpg'
        ]
    };

    const productTitleElement = document.getElementById('product-title');
    if (productTitleElement) {
        productTitleElement.textContent = productDetail.name;
    }
    
    const mainImageElement = document.getElementById('mainImage');
    if (mainImageElement) {
        mainImageElement.src = productDetail.image;
    }

    const currentPriceElement = document.querySelector('.product-detail .current-price');
    if (currentPriceElement) {
        currentPriceElement.textContent = `$${productDetail.price.toFixed(2)}`;
    }

    const originalPriceElement = document.querySelector('.product-detail .original-price');
    if (originalPriceElement) {
        originalPriceElement.textContent = `$${productDetail.originalPrice.toFixed(2)}`;
    }

    const discountElement = document.querySelector('.product-detail .discount');
    if (discountElement) {
        discountElement.textContent = `${Math.round(((productDetail.originalPrice - productDetail.price) / productDetail.originalPrice) * 100)}% off`;
    }

    const starsElement = document.querySelector('.product-detail .stars');
    if (starsElement) {
        starsElement.innerHTML = renderStars(productDetail.rating);
    }

    const reviewCountElement = document.querySelector('.product-detail .review-count');
    if (reviewCountElement) {
        reviewCountElement.textContent = `(${productDetail.reviewCount} reviews)`;
    }

    const thumbnailContainer = document.querySelector('.thumbnail-images');
    if (thumbnailContainer) {
        thumbnailContainer.innerHTML = '';
        productDetail.thumbnails.forEach(thumb => {
            const img = document.createElement('img');
            img.src = thumb;
            img.alt = productDetail.name + ' thumbnail';
            thumbnailContainer.appendChild(img);
        });

        document.querySelectorAll('.thumbnail-images img').forEach(thumb => {
            thumb.addEventListener('click', function() {
                if (mainImageElement) {
                    mainImageElement.src = this.src;
                }
            });
        });
    }

    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            let value = parseInt(input.value);
            
            if (this.classList.contains('minus')) {
                if (value > 1) {
                    input.value = value - 1;
                }
            } else if (this.classList.contains('plus')) {
                if (value < 10) {
                    input.value = value + 1;
                }
            }
        });
    });

    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });

    document.querySelector('.product-detail .btn-add-to-cart')?.addEventListener('click', function() {
        addToCart({
            id: productDetail.id,
            name: productDetail.name,
            price: productDetail.price,
            image: productDetail.image,
            sku: 'SKU-' + productDetail.id.substr(0, 5).toUpperCase()
        });
    });

    const relatedProducts = [
        {
            id: 'REL001',
            name: 'Spigen Ultra Hybrid Case for Smartphone X1',
            price: 19.99,
            originalPrice: 29.99,
            rating: 4.4,
            reviewCount: 456,
            image: 'https://m.media-amazon.com/images/I/61qU8R8xV9L._AC_SL1500_.jpg'
        },
        {
            id: 'REL002',
            name: 'Anker PowerCore III Fusion 5K',
            price: 45.99,
            originalPrice: 59.99,
            rating: 4.5,
            reviewCount: 2345,
            image: 'https://m.media-amazon.com/images/I/61+X+X+X+L._AC_SL1500_.jpg'
        },
        {
            id: 'REL003',
            name: 'JBL Flip 6 Portable Bluetooth Speaker',
            price: 129.99,
            originalPrice: 149.99,
            rating: 4.7,
            reviewCount: 7890,
            image: 'https://m.media-amazon.com/images/I/71qglw1xG2L._AC_SL1500_.jpg'
        }
    ];
    const relatedProductsContainer = document.getElementById('relatedProducts');
    if (relatedProductsContainer) {
        relatedProductsContainer.innerHTML = '';
        relatedProducts.forEach(product => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-product-id', product.id);
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                        <span class="discount">${discount}% off</span>
                    </div>
                    <div class="rating">
                        ${renderStars(product.rating)}
                        <span class="count">(${product.reviewCount})</span>
                    </div>
                    <div class="actions">
                        <button class="btn-add-to-cart">Add to Cart</button>
                        <button class="btn-buy-now">Buy Now</button>
                    </div>
                </div>
            `;
            relatedProductsContainer.appendChild(productCard);
        });

        document.querySelectorAll('#relatedProducts .btn-add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.getAttribute('data-product-id');
                const productToAdd = relatedProducts.find(p => p.id === productId);
                if (productToAdd) {
                    addToCart({
                        id: productToAdd.id,
                        name: productToAdd.name,
                        price: productToAdd.price,
                        image: productToAdd.image,
                        sku: 'SKU-' + productToAdd.id.substr(0, 5).toUpperCase()
                    });
                }
            });
        });
    }
}

function addToCart(product) {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({
            ...product,
            quantity: 1,
            sku: product.sku || 'SKU-' + product.id.substr(0, 5).toUpperCase()
        });
    }
    
    saveToLocalStorage();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const savedItemsContainer = document.getElementById('savedItems');
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItems.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.setAttribute('data-item-id', item.id);
                cartItem.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3 class="item-title">${item.name}</h3>
                        <p class="item-sku">SKU: ${item.sku}</p>
                        <p class="item-price">$${item.price.toFixed(2)}</p>
                        <div class="item-quantity">
                            <button class="qty-btn minus" aria-label="Decrease quantity"><i class="fas fa-minus"></i></button>
                            <input type="number" value="${item.quantity}" min="1" max="10" aria-label="Quantity">
                            <button class="qty-btn plus" aria-label="Increase quantity"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                    <div class="item-actions">
                        <a href="#" class="btn-remove" aria-label="Remove item"><i class="fas fa-trash"></i> Remove</a>
                        <a href="#" class="btn-wishlist" aria-label="Save for later"><i class="far fa-heart"></i> Save for later</a>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            document.querySelectorAll('.cart-item .qty-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const input = this.parentElement.querySelector('input');
                    const itemId = this.closest('.cart-item').getAttribute('data-item-id');
                    const itemInCart = cartItems.find(item => item.id === itemId);

                    if (!itemInCart) return;

                    if (this.classList.contains('minus') && itemInCart.quantity > 1) {
                        itemInCart.quantity--;
                    } else if (this.classList.contains('plus') && itemInCart.quantity < 10) {
                        itemInCart.quantity++;
                    }
                    input.value = itemInCart.quantity;
                    saveToLocalStorage();
                    updateCartTotals();
                });
            });

            document.querySelectorAll('.cart-item .btn-remove').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const itemId = this.closest('.cart-item').getAttribute('data-item-id');
                    cartItems = cartItems.filter(item => item.id !== itemId);
                    saveToLocalStorage();
                    updateCartDisplay();
                });
            });

            document.querySelectorAll('.cart-item .btn-wishlist').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const itemId = this.closest('.cart-item').getAttribute('data-item-id');
                    const itemIndex = cartItems.findIndex(item => item.id === itemId);
                    
                    if (itemIndex > -1) {
                        const itemToSave = cartItems[itemIndex];
                        savedItems.push(itemToSave);
                        cartItems.splice(itemIndex, 1);
                        saveToLocalStorage();
                        updateCartDisplay();
                        renderSavedItems();
                    }
                });
            });
        }
        updateCartTotals();
    }

    if (savedItemsContainer) {
        renderSavedItems();
    }
}

function renderSavedItems() {
    const savedItemsContainer = document.getElementById('savedItems');
    if (!savedItemsContainer) return;
    
    savedItemsContainer.innerHTML = '';
    
    if (savedItems.length === 0) {
        savedItemsContainer.innerHTML = '<p class="empty-cart">No saved items</p>';
        return;
    }

    savedItems.forEach(item => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-item-id', item.id);
        productCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <div class="price">$${item.price.toFixed(2)}</div>
            <button class="btn-move-to-cart">Move to Cart</button>
        `;
        savedItemsContainer.appendChild(productCard);
    });

    document.querySelectorAll('.btn-move-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('.product-card').getAttribute('data-item-id');
            const itemIndex = savedItems.findIndex(item => item.id === itemId);
            
            if (itemIndex > -1) {
                const itemToMove = savedItems[itemIndex];
                cartItems.push(itemToMove);
                savedItems.splice(itemIndex, 1);
                saveToLocalStorage();
                updateCartDisplay();
            }
        });
    });
}

function updateCartTotals() {
    let subtotal = 0;
    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.summary-row.total span:last-child').textContent = `$${total.toFixed(2)}`;
}

function initCart() {
    updateCartDisplay();
}

function initAuth() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const userGreeting = document.getElementById('user-greeting');
    const usernameDisplay = document.getElementById('username-display');
    const loginLink = document.querySelector('.btn-login');
    const signupLink = document.querySelector('.btn-signup');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUserUI(currentUser.name);
        // Hide auth sections if user is already logged in
        document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    localStorage.setItem('userEmail', email);

    // Try to get name from localStorage, fallback to email
    const name = localStorage.getItem('userName');
    document.getElementById('username-display-nav').textContent = name ? name : email;
    document.getElementById('user-greeting-nav').style.display = 'inline-block';

    document.getElementById('login').style.display = 'none';
    document.getElementById('home').style.display = 'block';
});
        document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const address = document.getElementById('signup-address').value;
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userAddress', address);

    // Show greeting with name
    document.getElementById('username-display-nav').textContent = name;
    document.getElementById('user-greeting-nav').style.display = 'inline-block';

    document.getElementById('signup').style.display = 'none';
    document.getElementById('home').style.display = 'block';
});
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify({
                    name: user.name,
                    email: user.email
                }));
                updateUserUI(user.name);
                // Hide login section and show home
                document.getElementById('login').style.display = 'none';
                document.getElementById('home').style.display = 'block';
                window.location.hash = 'home';
            } else {
                alert('Invalid email or password');
            }
        });
    }

    // In the initAuth function, update the signup form submission handler:
 if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (!name || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            if (users.some(u => u.email === email)) {
                alert('Email already registered');
                return;
            }

            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify({
                name: name,
                email: email
            }));
            
            updateUserUI(name);
            alert('Thank you for signing up!');
            // Hide signup section and show home
            document.getElementById('signup').style.display = 'none';
            document.getElementById('home').style.display = 'block';
            window.location.hash = 'home';
        });
    }
}
function showGreeting() {
    // Use name if available, else email
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const greeting = name ? name : email;
    document.getElementById('username-display-nav').textContent = `Hello, ${greeting} 😊`;
    document.getElementById('user-greeting-nav').style.display = 'inline-block';

    // Hide Sign In button
    const signInBtn = document.querySelector('.btn-login');
    if (signInBtn) signInBtn.style.display = 'none';

    // Change Sign Up to Sign Out
    const signUpBtn = document.querySelector('.btn-signup, .btn-signout');
    if (signUpBtn) {
        signUpBtn.textContent = 'Sign Out';
        signUpBtn.classList.add('btn-signout');
        signUpBtn.classList.remove('btn-signup');
        signUpBtn.onclick = function() {
            // Clear user info and reload page
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userAddress');
            localStorage.removeItem('currentUser');
            location.reload();
        };
        signUpBtn.style.display = 'inline-block';
    }
}

// SIGN UP logic
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const address = document.getElementById('signup-address').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!name || !email || !address || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Save user info
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userAddress', address);
        localStorage.setItem('currentUser', JSON.stringify({ name, email }));

        showGreeting();

        document.getElementById('signup').style.display = 'none';
        document.getElementById('home').style.display = 'block';
    });
}

// SIGN IN logic
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));

            showGreeting();

            document.getElementById('login').style.display = 'none';
            document.getElementById('home').style.display = 'block';
        } else {
            alert('Invalid email or password');
        }
    });
}

window.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('userEmail')) {
        showGreeting();
    }
});

    function updateUserUI(username) {
    // Update the greeting in the auth section
    if (usernameDisplay) usernameDisplay.textContent = username;
    if (userGreeting) {
        userGreeting.style.display = 'block';
        userGreeting.textContent = `Hello, ${username}`;
    }

    // Update the navigation bar
    const nav = document.querySelector('.nav ul');
    if (nav) {
        // Remove any existing greeting
        const existingGreeting = nav.querySelector('.user-greeting');
        if (existingGreeting) {
            nav.removeChild(existingGreeting);
        }

        // Create new greeting element
        const userGreetingNav = document.createElement('li');
        userGreetingNav.className = 'user-greeting';
        userGreetingNav.innerHTML = `
            <span style="color: white; font-weight: 500;">
                Hello, ${username}
            </span>
        `;

        // Insert before the cart link
        const cartLink = nav.querySelector('li a[href="#cart"]');
        if (cartLink) {
            nav.insertBefore(userGreetingNav, cartLink.parentNode);
        } else {
            nav.appendChild(userGreetingNav);
        }

        // Hide login/signup buttons
        document.querySelectorAll('.btn-login, .btn-signup').forEach(btn => {
            btn.style.display = 'none';
        });
    }
}
    document.querySelectorAll('.btn-social').forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 
                           this.classList.contains('facebook') ? 'Facebook' : 'Apple';
            alert(`Redirecting to ${provider} login...`);
        });
    });

    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Password reset link will be sent to your email if it exists in our system.');
        });
    }

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

function renderDealsProducts(products) {
    const dealsContainer = document.getElementById('dealsProducts');
    dealsContainer.innerHTML = '';
    
    if (products.length === 0) {
        dealsContainer.innerHTML = '<p class="no-products">No deals available at the moment.</p>';
        return;
    }

    products.forEach(product => {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-product-id', product.id);
        productCard.innerHTML = `
            ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                    <span class="discount">${discount}% off</span>
                </div>
                <div class="rating">
                    ${renderStars(product.rating)}
                    <span class="count">(${product.reviewCount})</span>
                </div>
                <div class="actions">
                    <button class="btn-add-to-cart">Add to Cart</button>
                    <button class="btn-buy-now">Buy Now</button>
                </div>
            </div>
        `;
        dealsContainer.appendChild(productCard);
    });

    document.querySelectorAll('#dealsProducts .btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productToAdd = products.find(p => p.id === productId);
            
            if (productToAdd) {
                addToCart({
                    id: productToAdd.id,
                    name: productToAdd.name,
                    price: productToAdd.price,
                    image: productToAdd.image,
                    sku: 'DEAL-' + productToAdd.id.substr(0, 5).toUpperCase()
                });
            }
        });
    });
}

function initCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const checkoutBtn = document.querySelector('.btn-checkout');
    const closeBtn = document.querySelector('.modal .close');
    const paymentTabs = document.querySelectorAll('.payment-tab');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cartItems.length === 0) {
                alert('Your cart is empty');
                return;
            }
            modal.style.display = 'block';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    paymentTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.payment-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    document.getElementById('cardForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const cardNumber = document.getElementById('cardNumber').value;
        const cardName = document.getElementById('cardName').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;

        if (!cardNumber || !cardName || !expiry || !cvv) {
            alert('Please fill in all card details.');
            return;
        }
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            alert('Please enter a valid 16-digit card number.');
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            alert('Please enter expiry date in MM/YY format.');
            return;
        }
        if (!/^\d{3,4}$/.test(cvv)) {
            alert('Please enter a valid 3 or 4 digit CVV.');
            return;
        }

        alert('Payment processed successfully!');
        cartItems = [];
        saveToLocalStorage();
        updateCartDisplay();
        modal.style.display = 'none';
        window.location.hash = 'home';
    });
}

function initBrandSlideshow() {
    const brandGrid = document.getElementById('brandGrid');
    const prevBtn = document.querySelector('.prev-brand');
    const nextBtn = document.querySelector('.next-brand');
    const scrollAmount = 300;

    if (brandGrid && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            brandGrid.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            brandGrid.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }
}
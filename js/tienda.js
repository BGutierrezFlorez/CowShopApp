document.addEventListener('DOMContentLoaded', function () {
    const products = [
        { id: 1, name: 'Vaca Lechera Holstein', category: 'lecheras', categoryDisplay: 'Lechera', price: 2000000, image: 'media/gris.jpg', alt: 'Vaca lechera Holstein blanca y negra' },
        { id: 2, name: 'Vaca de Carne Angus', category: 'carne', categoryDisplay: 'Carne', price: 2500000, image: 'media/gris.jpg', alt: 'Vaca de carne Angus negra' },
        { id: 3, name: 'Toro Reproductor Simmental', category: 'toros', categoryDisplay: 'Toro', price: 3200000, image: 'media/gris.jpg', alt: 'Toro reproductor Simmental de color marrón y blanco' },
        { id: 4, name: 'Ternero Brahman', category: 'terneros', categoryDisplay: 'Ternero', price: 1500000, image: 'media/gris.jpg', alt: 'Ternero Brahman de color gris claro' },
        { id: 5, name: 'Vaca Doble Propósito Normando', category: 'doble', categoryDisplay: 'Doble Propósito', price: 2800000, image: 'media/gris.jpg', alt: 'Vaca de doble propósito raza Normando' },
        { id: 6, name: 'Vaca Lechera Jersey', category: 'lecheras', categoryDisplay: 'Lechera', price: 2100000, image: 'media/gris.jpg', alt: 'Vaca lechera Jersey de color café' }
    ];

    const productsGrid = document.getElementById('products-grid');
    const filtersList = document.getElementById('filters-list');
    const noResultsMessage = document.getElementById('no-results-message');
    const cartToastEl = document.getElementById('cart-toast');
    const cartToast = new bootstrap.Toast(cartToastEl);

    function renderProducts(filterCategory = 'all') {
        productsGrid.innerHTML = ''; 
        let productsFound = false;

        const filteredProducts = (filterCategory === 'all')
            ? products
            : products.filter(p => p.category === filterCategory);

        if (filteredProducts.length > 0) {
            productsFound = true;
            filteredProducts.forEach(product => {
                const productCol = document.createElement('div');
                productCol.className = 'col-md-6 col-xl-4 product-item';
                productCol.dataset.category = product.category;

                productCol.innerHTML = `
                    <div class="card product-card h-100 shadow-sm">
                        <span class="badge position-absolute top-0 start-0 m-2">${product.categoryDisplay}</span>
                        <img src="${product.image}" class="card-img-top" alt="${product.alt}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text small text-muted">Breve descripción del animal para hacerlo llamativo al comprador.</p>
                            <div class="mt-auto text-center">
                                <p class="price h4 fw-bold my-2">${formatPrice(product.price)}</p>
                                <button type="button" class="btn btn-secondary w-100 add-to-cart-btn" data-product-name="${product.name}">
                                    <i class="fas fa-cart-plus me-2"></i>AGREGAR AL CARRITO
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                productsGrid.appendChild(productCol);
            });
        }
        
        noResultsMessage.classList.toggle('d-none', productsFound);
    }
    
    function formatPrice(price) {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
    }

    if (filtersList) {
        filtersList.addEventListener('click', function(event) {
            event.preventDefault();
            const target = event.target;
            if (target.matches('.list-group-item-action')) {
                this.querySelector('.active').classList.remove('active');
                target.classList.add('active');
                const filterCategory = target.dataset.filter;
                renderProducts(filterCategory);
            }
        });
    }
    
    if (productsGrid) {
        productsGrid.addEventListener('click', function(event) {
            const target = event.target.closest('.add-to-cart-btn');
            if (target) {
                const productName = target.dataset.productName;
                cartToastEl.querySelector('.toast-body').textContent = `"${productName}" se añadió al carrito.`;
                cartToast.show();
            }
        });
    }

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    renderProducts();
});
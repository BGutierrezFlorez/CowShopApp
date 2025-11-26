document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // 1. ESTADO DE LA APLICACIÓN
    // =================================================================
    let cartItems = [];
    let discount = {
        code: null,
        percentage: 0,
        amount: 0
    };

    // Costos fijos (podrían venir de una API)
    const shippingCost = 500000;
    const insuranceCost = 200000;

    // Códigos de cupón válidos
    const validCoupons = {
        'COWSHOP10': 0.10, // 10%
        'BIENVENIDO': 0.05 // 5%
    };

    // =================================================================
    // 2. REFERENCIAS A ELEMENTOS DEL DOM
    // =================================================================
    const cartContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('subtotal-value');
    const shippingEl = document.getElementById('shipping-value');
    const insuranceEl = document.getElementById('insurance-value');
    const discountEl = document.getElementById('discount-value');
    const totalEl = document.getElementById('total-value');
    const cartCounter = document.getElementById('cart-counter');
    const currentYearEl = document.getElementById('current-year');
    
    // Elementos de la sección de resumen
    const summaryCard = document.querySelector('.summary-card');
    const summaryCardBody = document.getElementById('summary-card-body');
    const discountLineEl = document.getElementById('discount-line');
    const checkoutButton = summaryCard.querySelector('.btn-success'); // CORREGIDO: de .btn-primary a .btn-success
    const couponInput = document.getElementById('coupon-input');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const alertContainer = document.getElementById('alert-container');
    
    // Modal de confirmación
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmRemoveModal'));
    const confirmRemoveBtn = document.getElementById('confirm-remove-btn');
    let itemToRemoveId = null;


    // =================================================================
    // 3. FUNCIONES
    // =================================================================

    // --- Funciones de persistencia de datos ---

    const saveCartToLocalStorage = () => {
        localStorage.setItem('cowShopCart', JSON.stringify(cartItems));
        localStorage.setItem('cowShopDiscount', JSON.stringify(discount));
    };

    const loadCartFromLocalStorage = () => {
        const storedCart = localStorage.getItem('cowShopCart');
        const storedDiscount = localStorage.getItem('cowShopDiscount');
        
        // Cargar carrito o usar datos de ejemplo si está vacío
        if (storedCart) {
            cartItems = JSON.parse(storedCart);
        } else {
            // Datos de ejemplo para la primera visita
            cartItems = [
                { id: 1, name: "Vaca Holstein", description: "Raza especializada en alta producción láctea.", price: 2800000, quantity: 1, image: "media/Holstein.webp" },
                { id: 2, name: "Toro Angus Negro", description: "Genética probada para carne de calidad premium.", price: 3500000, quantity: 1, image: "media/Angus.webp" }
            ];
        }

        if (storedDiscount) {
            discount = JSON.parse(storedDiscount);
        }
    };
    
    // --- Funciones de renderizado y UI ---

    const formatCurrency = (number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(number);

    const showAlert = (message, type = 'success') => {
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    };

    const renderCart = () => {
        cartContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart mb-3"></i>
                    <h4 class="fw-bold">Tu carrito está vacío</h4>
                    <p class="text-muted">Añade algunos ejemplares de nuestra tienda para continuar.</p>
                </div>
            `;
        } else {
            cartItems.forEach(item => {
                const itemHtml = `
                    <div class="list-group-item px-4 py-3 cart-item" data-id="${item.id}">
                        <div class="row g-3 align-items-center">
                            <div class="col-12 col-md-2 text-center">
                                <img src="${item.image}" alt="${item.name}" class="cart-product-image">
                            </div>
                            <div class="col-12 col-md-4">
                                <h3 class="h6 mb-1 fw-bold">${item.name}</h3>
                                <p class="small text-muted mb-1 d-none d-md-block">${item.description}</p>
                                <span class="price-highlight">${formatCurrency(item.price)}</span>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="input-group quantity-input-group mx-auto">
                                    <button class="btn btn-outline-secondary btn-sm" type="button" data-id="${item.id}" data-action="decrease">-</button>
                                    <input type="text" class="form-control form-control-sm text-center" value="${item.quantity}" aria-label="Cantidad" readonly>
                                    <button class="btn btn-outline-secondary btn-sm" type="button" data-id="${item.id}" data-action="increase">+</button>
                                </div>
                            </div>
                            <div class="col-4 col-md-2 text-end">
                                <span class="fw-bold price-highlight">${formatCurrency(item.price * item.quantity)}</span>
                            </div>
                            <div class="col-2 col-md-1 text-center">
                                <button class="btn remove-btn" data-id="${item.id}" data-action="remove" aria-label="Eliminar producto">
                                    <i class="fas fa-trash-alt fa-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>`;
                cartContainer.insertAdjacentHTML('beforeend', itemHtml);
            });
        }
        updateSummary();
    };
    
    const updateSummary = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const hasItems = cartItems.length > 0;
        
        // Recalcular descuento por si el subtotal cambió
        recalculateDiscount(subtotal);
        
        const currentShipping = hasItems ? shippingCost : 0;
        const currentInsurance = hasItems ? insuranceCost : 0;
        const total = subtotal + currentShipping + currentInsurance - discount.amount;

        subtotalEl.textContent = formatCurrency(subtotal);
        shippingEl.textContent = formatCurrency(currentShipping);
        insuranceEl.textContent = formatCurrency(currentInsurance);
        
        // MEJORADO: Lógica de descuento
        if (discount.amount > 0) {
            discountEl.textContent = `-${formatCurrency(discount.amount)}`;
            discountLineEl.classList.add('text-success');
        } else {
            discountEl.textContent = formatCurrency(0);
            discountLineEl.classList.remove('text-success');
        }
        
        totalEl.textContent = formatCurrency(total > 0 ? total : 0);
        
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'inline-block' : 'none';

        // Habilitar/deshabilitar controles
        checkoutButton.disabled = !hasItems;
        couponInput.disabled = !hasItems;
        applyCouponBtn.disabled = !hasItems;

        // MEJORADO: Retroalimentación visual en el resumen si está vacío
        if (hasItems) {
            summaryCardBody.classList.remove('summary-card-muted');
        } else {
            summaryCardBody.classList.add('summary-card-muted');
            couponInput.value = '';
            couponInput.classList.remove('is-valid', 'is-invalid');
        }
    };
    
    // --- Funciones de Lógica de Negocio ---

    const updateQuantity = (id, action) => {
        const item = cartItems.find(item => item.id === id);
        if (!item) return;

        if (action === 'increase' && item.quantity < 10) {
            item.quantity++;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity--;
        }
        
        renderCart();
        saveCartToLocalStorage();
    };

    const removeItem = (id) => {
        const itemElement = cartContainer.querySelector(`.cart-item[data-id="${id}"]`);
        
        // Añadir clase para la animación
        if(itemElement) {
            itemElement.classList.add('cart-item-removing');
            // Esperar a que la animación termine para actualizar el DOM
            setTimeout(() => {
                cartItems = cartItems.filter(item => item.id !== id);
                renderCart();
                saveCartToLocalStorage();
                showAlert('Ejemplar eliminado del carrito.', 'warning');
            }, 500); // 500ms, igual que la duración de la animación
        }
    };

    const applyCoupon = () => {
        const couponCode = couponInput.value.trim().toUpperCase();
        couponInput.classList.remove('is-valid', 'is-invalid');

        if (validCoupons[couponCode]) {
            discount.code = couponCode;
            discount.percentage = validCoupons[couponCode];
            showAlert(`¡Cupón "${couponCode}" aplicado con éxito!`, 'success');
            couponInput.classList.add('is-valid');
        } else {
            discount.code = null;
            discount.percentage = 0;
            showAlert('El cupón ingresado no es válido.', 'danger');
            couponInput.classList.add('is-invalid');
        }
        
        couponInput.value = '';
        updateSummary();
        saveCartToLocalStorage();
    };

    const recalculateDiscount = (subtotal) => {
        if (discount.percentage > 0) {
            discount.amount = subtotal * discount.percentage;
        } else {
            discount.amount = 0;
        }
    };

    // =================================================================
    // 4. MANEJADORES DE EVENTOS (EVENT LISTENERS)
    // =================================================================

    const handleCartActions = (e) => {
        const target = e.target.closest('button');
        if (!target?.dataset.action) return;

        const action = target.dataset.action;
        const id = parseInt(target.dataset.id);

        switch (action) {
            case 'increase':
            case 'decrease':
                updateQuantity(id, action);
                break;
            case 'remove':
                itemToRemoveId = id;
                confirmModal.show();
                break;
        }
    };
    
    cartContainer.addEventListener('click', handleCartActions);
    applyCouponBtn.addEventListener('click', applyCoupon);
    couponInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') applyCoupon();
    });
    
    confirmRemoveBtn.addEventListener('click', () => {
        if (itemToRemoveId !== null) {
            removeItem(itemToRemoveId);
            itemToRemoveId = null;
            confirmModal.hide();
        }
    });

    // =================================================================
    // 5. INICIALIZACIÓN
    // =================================================================
    
    const init = () => {
        if(currentYearEl) {
            currentYearEl.textContent = new Date().getFullYear();
        }
        loadCartFromLocalStorage();
        renderCart();
    };

    init();
});
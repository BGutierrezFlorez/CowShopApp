document.addEventListener('DOMContentLoaded', function () {
    // Función para actualizar el año en el footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Encabezado que cambia de tamaño con el scroll
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        });
    }
    
    // Contador del carrito de compras
    const cartCountSpan = document.querySelector('.cart-count');
    let count = 0;

    document.body.addEventListener('click', function(event) {
        if (event.target.closest('.btn-cart')) {
            event.preventDefault();
            count++;
            if (cartCountSpan) {
                cartCountSpan.textContent = count;
                cartCountSpan.style.display = 'inline-block';
                cartCountSpan.classList.add('animate__animated', 'animate__bounce');
                cartCountSpan.addEventListener('animationend', () => {
                    cartCountSpan.classList.remove('animate__animated', 'animate__bounce');
                }, {once: true});
            }
        }
    });

    // Validación del formulario de Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', event => {
            event.preventDefault();
            if (!newsletterForm.checkValidity()) {
                event.stopPropagation();
            } else {
                 alert('¡Gracias por suscribirte!');
                 newsletterForm.reset();
                 newsletterForm.classList.remove('was-validated');
            }
            newsletterForm.classList.add('was-validated');
        }, false);
    }

    // Reproducción forzada del video (nuevo código)
    const video = document.querySelector('.video-background-container video');
    if (video) {
        video.play().catch(error => {
            console.log('La reproducción automática falló:', error);
            document.body.addEventListener('click', function() {
                video.play();
            }, { once: true });
        });
    }
});
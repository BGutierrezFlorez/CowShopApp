document.addEventListener('DOMContentLoaded', function() {

    // 1. Efecto de encoger la barra de navegación al hacer scroll
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 2. Animación de elementos al aparecer en pantalla (Intersection Observer)
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(element => { observer.observe(element); });
    
    // 3. Actualizar año en el footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // 4. Scroll suave para enlaces ancla (ej: href="#pricing")
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navbarHeight = document.getElementById('main-navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // 5. NUEVO: Lógica para el interruptor de precios (Mensual/Anual)
    const pricingSwitch = document.getElementById('pricing-switch');
    if (pricingSwitch) {
        const priceElements = document.querySelectorAll('.pricing-card-title');
        const periodElements = document.querySelectorAll('.price-period');

        pricingSwitch.addEventListener('change', function() {
            if (this.checked) { // Si está en Anual
                priceElements.forEach(priceEl => {
                    priceEl.textContent = `$${priceEl.dataset.yearlyPrice}`;
                });
                periodElements.forEach(periodEl => {
                    periodEl.textContent = '/año';
                });
            } else { // Si está en Mensual
                priceElements.forEach(priceEl => {
                    priceEl.textContent = `$${priceEl.dataset.monthlyPrice}`;
                });
                periodElements.forEach(periodEl => {
                    periodEl.textContent = '/mes';
                });
            }
        });
    }

});
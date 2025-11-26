document.addEventListener('DOMContentLoaded', function() {

    // 1. Efecto de encoger la barra de navegación al hacer scroll
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
        });
    }

    // 2. Animación de elementos al aparecer en pantalla (Intersection Observer)
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
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
        animatedElements.forEach(element => observer.observe(element));
    }

    // 3. Lógica de formulario mejorada con feedback de envío
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const successMessage = document.getElementById('successMessage');

    if (contactForm && submitButton && successMessage) {
        contactForm.addEventListener('submit', event => {
            event.preventDefault(); 
            
            if (!contactForm.checkValidity()) {
                event.stopPropagation();
            } else {
                // Si el formulario es válido, mostrar estado de carga
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Enviando...
                `;

                // Simular envío a un servidor (2 segundos)
                setTimeout(() => {
                    contactForm.classList.add('d-none');
                    successMessage.classList.remove('d-none');
                }, 2000); 
            }
            
            contactForm.classList.add('was-validated');
        }, false);
    }
    
    // 4. Actualizar año en el footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
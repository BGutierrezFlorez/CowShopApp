document.addEventListener('DOMContentLoaded', function() {

    // 1. Efecto de encoger la barra de navegación al hacer scroll
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            // Si el scroll vertical es mayor a 50px, añade la clase 'scrolled'. Si no, la quita.
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 2. Animación de elementos generales al aparecer en pantalla (Intersection Observer)
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // El observador se encarga de vigilar los elementos con la clase .animate-on-scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si el elemento está intersectando (visible en la pantalla)
            if (entry.isIntersecting) {
                // Obtiene el valor del delay del atributo data-delay, si no existe es 0
                const delay = parseInt(entry.target.dataset.delay) || 0;
                
                // Aplica un temporizador para añadir la clase que hace visible el elemento
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);

                // Una vez que el elemento es visible, deja de observarlo para no repetir la animación
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // La animación se dispara cuando al menos el 10% del elemento es visible
    });

    // Aplica el observador a cada elemento que debe ser animado
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // 3. Lógica para la animación de contadores numéricos
    const countersSection = document.getElementById('counters-section');
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false; // Una bandera para asegurar que la animación ocurra solo una vez

    // Función que inicia la animación de los números
    const startCounterAnimation = () => {
        counters.forEach(counter => {
            counter.innerText = '0'; // Reinicia el texto del contador a 0
            const target = +counter.getAttribute('data-target'); // El número final al que se debe llegar
            const duration = 2000; // Duración total de la animación en milisegundos (2 segundos)
            
            // Calcula cuánto tiempo esperar entre cada incremento para que la animación sea fluida
            const stepTime = Math.abs(Math.floor(duration / target));

            const updateCount = () => {
                const current = +counter.innerText;
                const increment = Math.ceil(target / (duration / stepTime)); // Calcula cuánto sumar en cada paso
                
                if (current < target) {
                    // Actualiza el número, asegurándose de no pasar el objetivo
                    counter.innerText = `${Math.min(current + increment, target)}`;
                    // Llama a la función de nuevo después de un breve intervalo
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target; // Asegura que el número final sea exactamente el objetivo
                }
            };
            updateCount();
        });
    };

    // Un segundo observador, dedicado exclusivamente a la sección de los contadores
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si la sección de los contadores es visible y la animación no ha ocurrido aún
            if (entry.isIntersecting && !countersAnimated) {
                startCounterAnimation(); // Inicia la animación
                countersAnimated = true; // Marca la animación como completada
                observer.unobserve(entry.target); // Deja de observar la sección
            }
        });
    }, {
        threshold: 0.5 // Inicia la animación cuando el 50% de la sección es visible
    });

    // Si la sección de contadores existe en la página, la observa
    if (countersSection) {
        counterObserver.observe(countersSection);
    }

});
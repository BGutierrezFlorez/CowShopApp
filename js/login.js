document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS (PUEDEN O NO EXISTIR EN LA PÁGINA ACTUAL) ---
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const allTogglePassword = document.querySelectorAll('.toggle-password');

    // --- FUNCIONALIDAD PARA MOSTRAR/OCULTAR CONTRASEÑA ---
    // Esta función es genérica y funcionará en cualquier página que tenga el botón.
    allTogglePassword.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.closest('.input-group').querySelector('input');
            if (!passwordInput) return;

            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            
            const icon = this.querySelector('i');
            icon.classList.toggle('bi-eye', !isPassword);
            icon.classList.toggle('bi-eye-slash', isPassword);
        });
    });

    /**
     * Gestiona el estado de envío de un formulario (spinner y deshabilitado).
     * @param {HTMLFormElement} form - El formulario afectado.
     * @param {boolean} isSubmitting - True para mostrar carga, false para restaurar.
     * @param {string} loadingText - Texto del botón durante la carga.
     */
    const handleFormSubmitState = (form, isSubmitting, loadingText) => {
        const submitButton = form.querySelector('.btn-submit');
        if (!submitButton) return;

        if (isSubmitting) {
            // Guardar el HTML original del botón para poder restaurarlo
            if (!submitButton.dataset.originalHtml) {
                submitButton.dataset.originalHtml = submitButton.innerHTML;
            }
            submitButton.disabled = true;
            submitButton.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> ${loadingText}`;
        } else {
            submitButton.disabled = false;
            // Restaurar desde el HTML guardado
            submitButton.innerHTML = submitButton.dataset.originalHtml;
        }
    };

    // --- LÓGICA PARA LA PÁGINA DE LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!loginForm.checkValidity()) {
                loginForm.classList.add('was-validated');
                return;
            }

            handleFormSubmitState(loginForm, true, 'Ingresando...');

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('http://localhost:5000/api/usuarios/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        Correo: email,
                        Contrasena: password
                    })
                });

                if (!response.ok) {
                    let msg = 'Error al iniciar sesión';
                    let bodyText = '';
                    try {
                        // Intentar leer JSON
                        const data = await response.json();
                        console.log('Login error JSON:', data);
                        bodyText = JSON.stringify(data);
                        if (data && (data.message || data.Message)) msg = data.message || data.Message;
                        else if (typeof data === 'string') msg = data;
                    } catch (e) {
                        // Si no es JSON, leer como texto
                        try {
                            bodyText = await response.text();
                            msg = bodyText || msg;
                        } catch (e2) {
                            console.error('No se pudo leer body de respuesta', e2);
                        }
                    }

                    console.error('Login failed:', response.status, response.statusText, bodyText);
                    alert(msg + '\n(' + response.status + ')');
                    handleFormSubmitState(loginForm, false);
                    return;
                }

                // Si el login es exitoso, guardar token y redirigir al panel
                const userData = await response.json();
                if (userData) {
                    if (userData.token) {
                        // Guardar token en localStorage para persistir sesión
                        localStorage.setItem('cowshop_token', userData.token);
                    }
                    if (userData.usuario && userData.usuario.Nombre) {
                        localStorage.setItem('cowshop_user_name', userData.usuario.Nombre);
                    }
                }
                alert('¡Has iniciado sesión exitosamente!');
                // Redirigir al returnUrl si existe, sino al panel de usuario
                const params = new URLSearchParams(window.location.search);
                const returnUrl = params.get('returnUrl');
                if (returnUrl) {
                    // Decodificar y redirigir
                    window.location.href = decodeURIComponent(returnUrl);
                } else {
                    window.location.href = 'paneldeusuario.html';
                }
            } catch (err) {
                alert('Error de conexión con el servidor.');
            } finally {
                handleFormSubmitState(loginForm, false);
            }
        });
    }

    // --- LÓGICA PARA LA PÁGINA DE REGISTRO ---
    if (registerForm) {
        // Necesitamos un campo de "confirmar contraseña" para que esta lógica funcione.
        // Asegúrate de añadirlo en tu registrarse.html si no lo has hecho.
        const password = registerForm.querySelector('#regPassword');
        const confirmPassword = registerForm.querySelector('#regConfirmPassword'); // Asumiendo que existe

        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Validar que las contraseñas coincidan, si el campo de confirmación existe
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                confirmPassword.setCustomValidity("Las contraseñas no coinciden.");
            } else if (confirmPassword) {
                confirmPassword.setCustomValidity(""); // Limpiar el error
            }

            if (!registerForm.checkValidity()) {
                registerForm.classList.add('was-validated');
                return;
            }

            handleFormSubmitState(registerForm, true, 'Registrando...');
            
            // Simular llamada a la API
            setTimeout(() => {
                alert('¡Te has registrado exitosamente! Ahora serás redirigido para iniciar sesión.');
                // CAMBIO CLAVE: Redirigir a la página de login después del registro exitoso
                window.location.href = 'login.html';
            }, 2000);
        });

        // Limpiar el error de "contraseñas no coinciden" mientras el usuario escribe
        if (confirmPassword) {
            confirmPassword.addEventListener('input', function() {
                this.setCustomValidity('');
            });
        }
    }
});
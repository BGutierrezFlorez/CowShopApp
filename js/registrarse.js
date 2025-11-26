document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado. Script listo.');

  const API_URL = 'http://localhost:5000/api/usuario'; // Ajusta si es necesario
  const form = document.getElementById('registrationForm');
  const btn = document.getElementById('submitButton');
  const spinner = document.getElementById('spinner');
  const errBox = document.getElementById('errorMessage');
  const okBox = document.getElementById('successMessage');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');

  // Validar confirmación de contraseña
  function validatePasswordConfirmation() {
    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity('Las contraseñas no coinciden');
      confirmPassword.classList.add('is-invalid');
      return false;
    } else {
      confirmPassword.setCustomValidity('');
      confirmPassword.classList.remove('is-invalid');
      return true;
    }
  }

  if (password && confirmPassword) {
    confirmPassword.addEventListener('input', validatePasswordConfirmation);
    password.addEventListener('input', validatePasswordConfirmation);
  }

  function resetAlerts() {
    errBox.classList.add('d-none');
    okBox.classList.add('d-none');
  }

  function showError(msg) {
    errBox.textContent = msg;
    errBox.classList.remove('d-none');
  }

  function showSuccess(msg) {
    okBox.textContent = msg;
    okBox.classList.remove('d-none');
  }

  btn.addEventListener('click', async () => {
    resetAlerts();

    if (!validatePasswordConfirmation()) {
      showError('Las contraseñas no coinciden.');
      form.classList.add('was-validated');
      return;
    }

    form.classList.add('was-validated');

    if (!form.checkValidity()) {
      showError('Corrige los campos marcados en rojo.');
      return;
    }

    if (!password.value.trim()) {
      showError('La contraseña es obligatoria.');
      return;
    }


    // Mapear los campos del formulario a los nombres esperados por el backend
    const payload = {
      Nombre: document.getElementById('fullName').value.trim(),
      Cedula: document.getElementById('cedula').value.trim(),
      Fecha_Nacimiento: document.getElementById('birthDate').value,
      Correo: document.getElementById('email').value.trim(),
      Celular: document.getElementById('phone').value.trim(),
      Tipo_Usuario: document.getElementById('tipoUsuario').value,
      ID_Membresia: parseInt(document.getElementById('membership').value),
      Contrasena: password.value,
      ID_Rol: parseInt(document.getElementById('userRole').value)
    };

    console.log('Payload final:', payload);

    btn.disabled = true;
    spinner.classList.remove('d-none');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('Status:', res.status, res.statusText);

      const body = await res.json().catch(() => {
        console.error('Error parsing JSON response');
        return { message: 'Error procesando la respuesta del servidor' };
      });

      console.log('Respuesta API:', body);

      if (!res.ok) {
        let errorMsg = 'Error en el registro';
        
        if (body.errors) {
          errorMsg = Object.values(body.errors).flat().join(' ');
        } else if (body.ModelState) {
          errorMsg = Object.values(body.ModelState).flat().join(' ');
        } else if (body.message) {
          errorMsg = body.message;
        } else {
          errorMsg = `${res.status} - ${res.statusText}`;
        }
        
        throw new Error(errorMsg);
      }

      showSuccess('¡Registro exitoso! Redirigiendo…');
      setTimeout(() => location.href = 'login.html', 2000);

    } catch (err) {
      console.error('Error completo:', err);
      
      let userMessage = err.message;
      if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        userMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
      } else if (err.message.includes('405')) {
        userMessage = 'Error en el endpoint. Contacta al administrador.';
      }
      
      showError(userMessage);
    } finally {
      btn.disabled = false;
      spinner.classList.add('d-none');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.click();
  });

  // Toggle mostrar/ocultar contraseñas
  const togglePassword = (inputId, buttonId) => {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    if (input && button) {
      button.addEventListener('click', () => {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        const icon = button.querySelector('i');
        if (icon) {
          icon.classList.toggle('bi-eye');
          icon.classList.toggle('bi-eye-slash');
        }
      });
    }
  };

  togglePassword('password', 'togglePassword');
  togglePassword('confirmPassword', 'toggleConfirmPassword');
});
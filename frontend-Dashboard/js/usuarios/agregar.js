// agregar.js
// Adaptado para la creación de usuarios, manteniendo la estructura del ejemplo de membresías.

import { apiUrl } from './apiUrl.js';
import { cargarUsuarios, usuariosGlobal } from './cargar.js'; // <- Corregido para usuarios

// ../../js/usuarios/agregar.js

document.addEventListener("click", async (e) => {
  if (e.target && e.target.id === "btnGuardarUsuario") {
    e.preventDefault();

    const formAgregar = document.getElementById("formAgregarUsuario");

    // Validar contraseñas
    const password = document.getElementById("agregar-contraseña").value.trim();
    const confirmarPassword = document.getElementById("agregar-confirmar-contraseña").value.trim();

    if (password !== confirmarPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (!formAgregar.checkValidity()) {
      formAgregar.reportValidity();
      return;
    }

    const datosUsuario = {
  nombre: document.getElementById("agregar-nombre").value.trim(),
  cedula: document.getElementById("agregar-cedula").value.trim(),
  Fecha_Nacimiento: document.getElementById("agregar-fechaNacimiento").value, // Mayúsculas como backend
  correo: document.getElementById("agregar-correo").value.trim(),
  celular: document.getElementById("agregar-celular").value.trim(),
  tipoUsuario: document.getElementById("agregar-tipoUsuario").value,
  ID_Membresia: document.getElementById("agregar-idMembresia").value, // ID_Membresia
  ID_Rol: document.getElementById("agregar-idRol").value,             // ID_Rol
  Contrasena: password, // Contrasena con C mayúscula y sin ñ
};

    try {
      const respuesta = await fetch("http://localhost:5000/api/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosUsuario),
      });

      if (!respuesta.ok) throw new Error("Error al guardar el usuario");

      mostrarNotificacion("✅ Usuario agregado correctamente");

      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalAgregar"));
      modal.hide();

      formAgregar.reset();

      // Refrescar la tabla de usuarios
      await cargarUsuarios(); // <- Corregido

      // Ir a la última página de la tabla de usuarios
      const total = usuariosGlobal.length; // <- Corregido
      const ultimaPagina = Math.ceil(total / 5);
      if (typeof window.mostrarPagina === 'function') { // <- Función de paginación global
        window.mostrarPagina(ultimaPagina);
      }

    } catch (error) {
      console.error("Error:", error);
      mostrarNotificacion("❌ Ocurrió un error al guardar el usuario", '#f44336');
    }
  }
});

// /**
//  * Muestra una notificación flotante con un estilo personalizado.
//  * @param {string} texto - El mensaje a mostrar.
//  * @param {string} [colorFondo='#4CAF50'] - Color de fondo de la notificación.
//  */
function mostrarNotificacion(texto, colorFondo = '#4CAF50') {
   const box = document.createElement('div');
   box.textContent = texto;
   Object.assign(box.style, {
    position: 'fixed',
     bottom: '20px',
     right: '20px',
     background: colorFondo,
     color: 'white',
     padding: '12px 20px',
     borderRadius: '6px',
     boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
     fontSize: '14px',
     zIndex: '10000',
     maxWidth: '300px',
     fontFamily: 'sans-serif'
   });
   document.body.appendChild(box);
   setTimeout(() => box.remove(), 3000);
}

// /**
//  * Configura los event listeners para el formulario de agregar usuario.
//  */
// export async function configurarAgregar() {
//   // Selectores adaptados para el formulario de usuario
//   const formAgregar = await esperarElemento("#formAgregarUsuario");
//   const btnGuardar = await esperarElemento("#btnGuardarUsuario");

//   btnGuardar.setAttribute('type', 'button');

//   formAgregar.addEventListener("submit", async function (e) {
//     e.preventDefault();

//     // Recopilación de todos los campos del formulario de usuario
//     const nombre = formAgregar.elements['nombre'].value.trim();
//     const cedula = formAgregar.elements['cedula'].value.trim();
//     const fechaNacimiento = formAgregar.elements['fechaNacimiento'].value.trim();
//     const correo = formAgregar.elements['correo'].value.trim();
//     const celular = formAgregar.elements['celular'].value.trim();
//     const tipoUsuario = formAgregar.elements['tipoUsuario'].value;
//     const idMembresia = formAgregar.elements['idMembresia'].value;
//     const idRol = formAgregar.elements['idRol'].value;
//     const contrasena = formAgregar.elements['contraseña'].value;
//     const confirmarContrasena = formAgregar.elements['confirmarContraseña'].value;
    
//     // Validación adaptada para los campos de usuario
//     if (!nombre || !cedula || !fechaNacimiento || !correo || !celular || !tipoUsuario || !idMembresia || !idRol || !contrasena) {
//       mostrarNotificacion("Todos los campos son obligatorios.", '#f44336');
//       return;
//     }
//     if (contrasena !== confirmarContrasena) {
//         mostrarNotificacion("Las contraseñas no coinciden.", '#f44336');
//         return;
//     }
//     if (contrasena.length < 6) {
//         mostrarNotificacion("La contraseña debe tener al menos 6 caracteres.", '#f44336');
//         return;
//     }

//     // Creación del objeto 'nuevoUsuario'
//     const nuevoUsuario = {
//         Nombre: nombre,
//         Cedula: cedula,
//         Fecha_Nacimiento: new Date(fechaNacimiento).toISOString(),
//         Correo: correo,
//         Celular: celular,
//         Tipo_Usuario: tipoUsuario,
//         ID_Membresia: parseInt(idMembresia, 10),
//         Contrasena: contrasena,
//         ID_Rol: parseInt(idRol, 10)
//     };

//     try {
//       // Endpoint de la API para crear usuarios (se asume que es la URL base)
//       const res = await fetch(apiUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(nuevoUsuario)
//       });

//       if (!res.ok) {
//         const texto = await res.text().catch(() => '');
//         throw new Error(texto || `HTTP ${res.status}`);
//       }
      
//       setTimeout(() => {
//         mostrarNotificacion("✅ Usuario agregado correctamente", '#4CAF50');
//       }, 300);

//       // Cerrar modal
//       const modalEl = document.getElementById("modalAgregar");
//       bootstrap.Modal.getInstance(modalEl)?.hide();

//       formAgregar.reset();

//       // Refrescar la tabla de usuarios
//       await cargarUsuarios(); // <- Corregido

//       // Ir a la última página de la tabla de usuarios
//       const total = usuariosGlobal.length; // <- Corregido
//       const ultimaPagina = Math.ceil(total / 5);
//       if (typeof window.mostrarPagina === 'function') { // <- Función de paginación global
//         window.mostrarPagina(ultimaPagina);
//       }

//     } catch (err) {
//       mostrarNotificacion("Error al agregar usuario: " + (err?.message || err), '#f44336');
//     }
//   });

//   btnGuardar.addEventListener("click", () => formAgregar.requestSubmit());
// }
// agregar.js
// Adaptado para la creación de vacas, manteniendo la estructura del ejemplo de membresías.

import { apiUrl } from './apiUrl.js';
import { cargarVacas, vacasGlobal } from './cargar.js'; // <- Corregido para vacas

// ../../js/vacas/agregar.js

document.addEventListener("click", async (e) => {
  if (e.target && e.target.id === "btnGuardarVaca") {
    e.preventDefault();

    const formAgregar = document.getElementById("formAgregarVaca");

      if (!formAgregar.checkValidity()) {
      formAgregar.reportValidity();
      return;
    }
/*
 <td class="align-middle">${v.ID_Vaca || ''}</td>
      <td class="align-middle">${v.Nombre || ''}</td>
      <td class="align-middle">${v.Raza || ''}</td>
      <td class="align-middle">${v.Peso || ''}</td>
      <td class="align-middle">${v.Precio || ''}</td>
      <td class="align-middle">${v.ID_Vendedor || ''}</td>
      <td class="align-middle">${v.Estado_Salud || ''}</td>*/
    const datosVaca = {
  nombre: document.getElementById("agregar-nombre").value.trim(),
  raza: document.getElementById("agregar-raza").value.trim(),
  Peso: document.getElementById("agregar-peso").value, // Mayúsculas como backend
  Precio: document.getElementById("agregar-precio").value.trim(),
  ID_Vendedor: document.getElementById("agregar-idVendedor").value.trim(),
  Estado_Salud: document.getElementById("agregar-estadoSalud").value, // ID_Membresia
};

    try {
      const respuesta = await fetch("http://localhost:5000/api/vaca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosVaca),
      });

      if (!respuesta.ok) throw new Error("Error al guardar la vaca");

      mostrarNotificacion("✅ Vaca agregada correctamente");

      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalAgregar"));
      modal.hide();

      formAgregar.reset();

      // Refrescar la tabla de vacas
      await cargarVacas(); // <- Corregido

      // Ir a la última página de la tabla de vacas
      const total = vacasGlobal.length; // <- Corregido
      const ultimaPagina = Math.ceil(total / 5);
      if (typeof window.mostrarPagina === 'function') { // <- Función de paginación global
        window.mostrarPagina(ultimaPagina);
      }

    } catch (error) {
      console.error("Error:", error);
      mostrarNotificacion("❌ Ocurrió un error al guardar el vaca", '#f44336');
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
//  * Configura los event listeners para el formulario de agregar vaca.
//  */
// export async function configurarAgregar() {
//   // Selectores adaptados para el formulario de vaca
//   const formAgregar = await esperarElemento("#formAgregarVaca");
//   const btnGuardar = await esperarElemento("#btnGuardarVaca");

//   btnGuardar.setAttribute('type', 'button');

//   formAgregar.addEventListener("submit", async function (e) {
//     e.preventDefault();

//     // Recopilación de todos los campos del formulario de vaca
//     const nombre = formAgregar.elements['nombre'].value.trim();
//     const cedula = formAgregar.elements['cedula'].value.trim();
//     const fechaNacimiento = formAgregar.elements['fechaNacimiento'].value.trim();
//     const correo = formAgregar.elements['correo'].value.trim();
//     const celular = formAgregar.elements['celular'].value.trim();
//     const tipoVaca = formAgregar.elements['tipoVaca'].value;
//     const idMembresia = formAgregar.elements['idMembresia'].value;
//     const idRol = formAgregar.elements['idRol'].value;
//     const contrasena = formAgregar.elements['contraseña'].value;
//     const confirmarContrasena = formAgregar.elements['confirmarContraseña'].value;
    
//     // Validación adaptada para los campos de vaca
//     if (!nombre || !cedula || !fechaNacimiento || !correo || !celular || !tipoVaca || !idMembresia || !idRol || !contrasena) {
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

//     // Creación del objeto 'nuevoVaca'
//     const nuevoVaca = {
//         Nombre: nombre,
//         Cedula: cedula,
//         Fecha_Nacimiento: new Date(fechaNacimiento).toISOString(),
//         Correo: correo,
//         Celular: celular,
//         Tipo_Vaca: tipoVaca,
//         ID_Membresia: parseInt(idMembresia, 10),
//         Contrasena: contrasena,
//         ID_Rol: parseInt(idRol, 10)
//     };

//     try {
//       // Endpoint de la API para crear vacas (se asume que es la URL base)
//       const res = await fetch(apiUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(nuevoVaca)
//       });

//       if (!res.ok) {
//         const texto = await res.text().catch(() => '');
//         throw new Error(texto || `HTTP ${res.status}`);
//       }
      
//       setTimeout(() => {
//         mostrarNotificacion("✅ Vaca agregado correctamente", '#4CAF50');
//       }, 300);

//       // Cerrar modal
//       const modalEl = document.getElementById("modalAgregar");
//       bootstrap.Modal.getInstance(modalEl)?.hide();

//       formAgregar.reset();

//       // Refrescar la tabla de vacas
//       await cargarVacas(); // <- Corregido

//       // Ir a la última página de la tabla de vacas
//       const total = vacasGlobal.length; // <- Corregido
//       const ultimaPagina = Math.ceil(total / 5);
//       if (typeof window.mostrarPagina === 'function') { // <- Función de paginación global
//         window.mostrarPagina(ultimaPagina);
//       }

//     } catch (err) {
//       mostrarNotificacion("Error al agregar vaca: " + (err?.message || err), '#f44336');
//     }
//   });

//   btnGuardar.addEventListener("click", () => formAgregar.requestSubmit());
// }
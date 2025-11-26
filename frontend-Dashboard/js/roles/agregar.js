// agregar.js
import { apiUrl } from './apiUrl.js';
import { cargarUsuarios, usuariosGlobal } from './cargar.js';

function esperarElemento(selector) {
  return new Promise(resolve => {
    const intervalo = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(intervalo);
        resolve(el);
      }
    }, 50);
  });
}

function mostrarErrorUI(msg) {
  console.error(msg);
  // Muestra un toast o mensaje en pantalla en lugar de alert (evita bloqueos en pagehide)
  const box = document.getElementById('notificaciones') || (() => {
    const b = document.createElement('div');
    b.id = 'notificaciones';
    b.style.position = 'fixed';
    b.style.bottom = '16px';
    b.style.right = '16px';
    b.style.padding = '12px 16px';
    b.style.background = '#f44336';
    b.style.color = 'white';
    b.style.borderRadius = '6px';
    b.style.zIndex = 10000;
    document.body.appendChild(b);
    return b;
  })();
  box.textContent = msg;
  setTimeout(() => box.remove(), 3000);
}

export async function configurarAgregar() {
  const formAgregar = await esperarElemento("#formAgregarUsuario");
  const btnGuardar = await esperarElemento("#btnGuardarUsuario");

  // 1) Asegura que NO actúe como submit
  btnGuardar.setAttribute('type', 'button');

  // 2) Maneja el submit desde el formulario (mejor patrón)
  formAgregar.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = formAgregar["agregar-nombre"].value.trim();
    const cedula = formAgregar["agregar-cedula"].value.trim();
    const fechaRaw = formAgregar["agregar-fechaNacimiento"].value.trim();
    const correo = formAgregar["agregar-correo"].value.trim();
    const celular = formAgregar["agregar-celular"].value.trim();
    const tipoUsuario = formAgregar["agregar-tipoUsuario"].value.trim();
    const idMembresia = formAgregar["agregar-idMembresia"].value.trim();
    const contrasena = formAgregar["agregar-contraseña"].value.trim();

    if (!nombre || !cedula || !fechaRaw || !correo || !celular || !tipoUsuario || !idMembresia || !contrasena) {
      mostrarErrorUI("Todos los campos son obligatorios.");
      return;
    }

    const fechaObj = new Date(fechaRaw);
    if (isNaN(fechaObj.getTime())) {
      mostrarErrorUI("Por favor ingresa una fecha de nacimiento válida.");
      return;
    }

    const nuevoUsuario = {
      Nombre: nombre,
      Cedula: cedula,
      Fecha_Nacimiento: fechaObj.toISOString(),
      Correo: correo,
      Celular: celular,
      Tipo_Usuario: tipoUsuario,
      ID_Membresia: idMembresia,
      Contrasena: contrasena
    };

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
      });

      if (!res.ok) {
        const texto = await res.text().catch(() => '');
        throw new Error(texto || `HTTP ${res.status}`);
      }

      // Feedback no bloqueante
      mostrarErrorUI("Usuario agregado correctamente.");

      // Cierre manual del modal
      const modal = document.getElementById("modalAgregar");
      modal?.classList.remove("show");
      if (modal) modal.style.display = "none";
      document.body.classList.remove("modal-open");
      document.querySelector(".modal-backdrop")?.remove();

      formAgregar.reset();

      // Refresca la tabla
      await cargarUsuarios();
      const total = usuariosGlobal.length;
      const ultimaPagina = Math.ceil(total / 5);
      if (typeof mostrarPagina === 'function') {
        mostrarPagina(ultimaPagina, usuariosGlobal);
      }
    } catch (err) {
      mostrarErrorUI("Error al agregar el usuario: " + (err?.message || err));
    }
  });

  // 3) Click en Guardar dispara el submit del formulario
  btnGuardar.addEventListener("click", () => formAgregar.requestSubmit());
}
// agregar.js
import { apiUrl } from './apiUrl.js';
import { cargarMembresias, membresiasGlobal } from './cargar.js';

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

export async function configurarAgregar() {
  const formAgregar = await esperarElemento("#formAgregar");
  const btnGuardar = await esperarElemento("#btnGuardar");

  btnGuardar.setAttribute('type', 'button');

  formAgregar.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = formAgregar["agregar-nombre"].value.trim();
    const valor = parseFloat(formAgregar["agregar-valor"].value.trim());

    if (!nombre || isNaN(valor) || valor <= 0) {
      mostrarNotificacion("Todos los campos son obligatorios y el valor debe ser válido.", '#f44336');
      return;
    }

    const nuevaMembresia = { Nombre: nombre, Valor: valor };

    try {
      const res = await fetch(`${apiUrl}/membresia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaMembresia)
      });

      if (!res.ok) {
        const texto = await res.text().catch(() => '');
        throw new Error(texto || `HTTP ${res.status}`);
      }

      // Mostrar notificación inmediatamente tras éxito
      setTimeout(() => {
        mostrarNotificacion("✅ Membresía agregada correctamente", '#4CAF50');
      }, 300); // Ajusta si tu animación dura más o menos

      // Cerrar modal
      const modalEl = document.getElementById("modalAgregar");
      bootstrap.Modal.getInstance(modalEl)?.hide();

      formAgregar.reset();

      // Refrescar la tabla
      await cargarMembresias();

      // Ir a última página
      const total = membresiasGlobal.length;
      const ultimaPagina = Math.ceil(total / 5);
      if (typeof mostrarPaginaMembresias === 'function') {
        mostrarPaginaMembresias(ultimaPagina, membresiasGlobal);
      }

    } catch (err) {
      mostrarNotificacion("Error al agregar: " + (err?.message || err), '#f44336');
    }
  });

  btnGuardar.addEventListener("click", () => formAgregar.requestSubmit());
}
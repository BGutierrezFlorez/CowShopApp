// /frontend/js/membresias/modales.js
// Gestión de modales de membresías: abrir, editar, agregar y envío de formularios

// URL base del backend (ajusta puerto/dominio si cambia tu API en C#)
const API_BASE = 'https://localhost:44349/api/membresia';

let getCurrentPage = () => 1;

/**
 * Carga un fragmento HTML en el body si no existe.
 * @param {string} idElemento  ID raíz del elemento que se espera inyectar
 * @param {string} rutaHTML    Ruta relativa/absoluta al archivo HTML
 * @returns {Promise<HTMLElement>}
 */
async function cargarFragmento(idElemento, rutaHTML) {
  let el = document.getElementById(idElemento);
  if (el) return el;

  const res = await fetch(rutaHTML);
  if (!res.ok) throw new Error(`No se pudo cargar ${rutaHTML}: ${res.status}`);
  const html = await res.text();
  document.body.insertAdjacentHTML('beforeend', html);

  el = document.getElementById(idElemento);
  if (!el) throw new Error(`El fragmento ${idElemento} no se insertó correctamente`);
  return el;
}

/**
 * Inicializa los modales precargando ambos HTML y conectando formularios
 * @param {Function} getPageFn - Función que devuelve la página actual
 */
export async function cargarModales(getPageFn) {
  getCurrentPage = getPageFn;
  try {
    await Promise.all([
      cargarFragmento('modalAgregar', './modales/modal-agregar.html'),
      cargarFragmento('modalEditar', './modales/modal-editar.html')
    ]);
    conectarFormularios();
    console.log('Modales configurados y formularios conectados');
  } catch (err) {
    console.error(err);
  }
}

/**
 * Abre el modal de edición y precarga los campos desde atributos data-*
 */
export async function abrirEditarDesdeAtributos(btn) {
  try {
    const modalEl = await cargarFragmento(
      'modalEditar',
      './modales/modal-editar.html'
    );
    const formEditar = modalEl.querySelector('#formEditarMembresia');
    if (!formEditar) throw new Error('No se encontró el formulario de edición');

    formEditar['editar-id'].value = btn.dataset.id;
    formEditar['editar-nombre'].value = btn.dataset.nombre;
    formEditar['editar-valor'].value = btn.dataset.valor;

    conectarFormularios();
    new bootstrap.Modal(modalEl).show();
  } catch (err) {
    console.error(err);
  }
}

/**
 * Abre el modal de agregar membresía
 */
export async function abrirModalAgregar() {
  try {
    const modalEl = await cargarFragmento(
      'modalAgregar',
      './modales/modal-agregar.html'
    );
    conectarFormularios();
    new bootstrap.Modal(modalEl).show();
  } catch (err) {
    console.error(err);
  }
}

/**
 * Conecta los eventos submit de formularios para agregar y editar.
 */
export function conectarFormularios() {
  // ---- Formulario Agregar ----
  const formAgregar = document.getElementById('formAgregarMembresia');
  if (formAgregar && !formAgregar.dataset.listener) {
    formAgregar.dataset.listener = 'true';
    formAgregar.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        const payload = {
          Nombre_Membresia: formAgregar['agregar-nombre'].value.trim(),
          Valor_Membresia: Number(formAgregar['agregar-valor'].value)
        };
        const resp = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error(`Error ${resp.status}: ${await resp.text()}`);

        bootstrap.Modal.getInstance(document.getElementById('modalAgregar'))?.hide();
        if (typeof window.recargarMembresias === 'function') {
          await window.recargarMembresias();
        }
      } catch (err) {
        console.error('Error al agregar membresía:', err);
      }
    });
  }

  // ---- Formulario Editar ----
  const formEditar = document.getElementById('formEditarMembresia');
  if (formEditar && !formEditar.dataset.listener) {
    formEditar.dataset.listener = 'true';
    formEditar.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        const payload = {
          ID_Membresia: formEditar['editar-id'].value,
          Nombre_Membresia: formEditar['editar-nombre'].value.trim(),
          Valor_Membresia: Number(formEditar['editar-valor'].value)
        };
        const resp = await fetch(`${API_BASE}/${payload.ID_Membresia}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error(`Error ${resp.status}: ${await resp.text()}`);

        bootstrap.Modal.getInstance(document.getElementById('modalEditar'))?.hide();
        if (typeof window.recargarMembresias === 'function') {
          await window.recargarMembresias();
        }
      } catch (err) {
        console.error('Error al editar membresía:', err);
      }
    });
  }
}

// Compatibilidad con onclick antiguos en HTML
window.abrirEditarDesdeAtributos = abrirEditarDesdeAtributos;
window.abrirModalAgregar = abrirModalAgregar;
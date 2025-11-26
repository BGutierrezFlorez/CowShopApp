// /frontend/js/vacas/modales.js
// Gestión de modales de vacas: abrir, editar, agregar y envío de formularios

// URL base del backend
const API_BASE = 'http://localhost:5000/api/vaca';

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

    const formEditar = modalEl.querySelector('#formEditarVaca');
    if (!formEditar) throw new Error('No se encontró el formulario de edición');

    // Asignar valores desde los data-* del botón
    formEditar['editar-id'].value = btn.dataset.id;
    formEditar['editar-nombre'].value = btn.dataset.nombre;
    formEditar['editar-raza'].value = btn.dataset.raza;
    formEditar['editar-peso'].value = btn.dataset.peso;
    formEditar['editar-precio'].value = btn.dataset.precio;
    formEditar['editar-id_vendedor'].value = btn.dataset.id_vendedor;
    formEditar['editar-estado_salud'].value = btn.dataset.estado_salud;

    // Conectar eventos y abrir modal
    conectarFormularios();
    new bootstrap.Modal(modalEl).show();
  } catch (err) {
    console.error('Error en abrirEditarDesdeAtributos:', err);
  }
}


/**
 * Abre el modal de agregar vaca
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
  // ---- Formulario Editar Vaca ----
  const formEditar = document.getElementById('formEditarVaca');
  if (formEditar && !formEditar.dataset.listener) {
    formEditar.dataset.listener = 'true';
    formEditar.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        const payload = {
          ID_Vaca: parseInt(formEditar.elements["id"].value.trim(), 10),
          nombre: formEditar.elements["nombre"].value.trim(),
          raza: formEditar.elements["raza"].value.trim(),
          Peso: parseFloat(formEditar.elements["peso"].value.trim()),
          Precio: formEditar.elements["precio"].value.trim(),
          ID_Vendedor: formEditar.elements["idVendedor"].value.trim(),
          Estado_Salud: formEditar.elements["estadoSalud"].value.trim()
        };

        const resp = await fetch(`${API_BASE}/${payload.ID_Vaca}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!resp.ok) throw new Error(`Error ${resp.status}: ${await resp.text()}`);

        // Cierra el modal
        const modalEl = document.getElementById('modalEditar');
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.hide();

        modalEl.addEventListener('hidden.bs.modal', () => {
          document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('padding-right');
        }, { once: true });

        // Recarga vacas si tienes una función global
        if (typeof window.recargarVacas === 'function') {
          await window.recargarVacas();
        }
      } catch (err) {
        console.error('Error al editar vaca:', err);
      }
    });
  }
}


// Compatibilidad con onclick antiguos en HTML
window.abrirEditarDesdeAtributos = abrirEditarDesdeAtributos;
window.abrirModalAgregar = abrirModalAgregar;
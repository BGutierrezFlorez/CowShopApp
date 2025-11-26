// /frontend/js/membresias/modales.js
// Gestión de modales de membresías: abrir, editar, agregar y envío de formularios

// URL base del backend (ajusta puerto/dominio si cambia tu API en C#)
const API_BASE = 'https://localhost:44349/api/usuario';

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

    const formEditar = modalEl.querySelector('#formEditarUsuario');
    if (!formEditar) throw new Error('No se encontró el formulario de edición');

    // Asignar valores desde los data-* del botón
    formEditar['editar-idU'].value = btn.dataset.id;
    formEditar['editar-id'].value = btn.dataset.id;
    formEditar['editar-nombre'].value = btn.dataset.nombre;
    formEditar['editar-cedula'].value = btn.dataset.cedula;
    formEditar['editar-fechaNacimiento'].value = btn.dataset.fechanacimiento;
    formEditar['editar-correo'].value = btn.dataset.correo;
    formEditar['editar-celular'].value = btn.dataset.celular;
    formEditar['editar-tipoUsuario'].value = btn.dataset.tipousuario;
      formEditar['editar-idMembresia'].value = btn.dataset.idmembresia; // Campo siempre visible y habilitado
      formEditar['editar-idRol'].value = btn.dataset.idrol; // Campo siempre visible y habilitado
      formEditar['editar-contrasena'].value = btn.dataset.contrasena; // Campo siempre visible y habilitado
      formEditar['editar-confirmar-contrasena'].value = btn.dataset.contrasena; // Campo siempre visible y habilitado

    formEditar['editar-estado'].value =
      btn.dataset.estado === 'true' ? 'Activo' : 'Inactivo';

    // Conectar eventos y abrir modal
    conectarFormularios();
    new bootstrap.Modal(modalEl).show();
  } catch (err) {
    console.error('Error en abrirEditarDesdeAtributos:', err);
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
  // ---- Formulario Editar Usuario ----
  const formEditar = document.getElementById('formEditarUsuario');
  if (formEditar && !formEditar.dataset.listener) {
    formEditar.dataset.listener = 'true';
    formEditar.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        const payload = {
          ID_Usuario: parseInt(formEditar.elements["id"].value.trim(), 10),
          Nombre: formEditar.elements["nombre"].value.trim(),
          Cedula: formEditar.elements["cedula"].value.trim(),
          Fecha_Nacimiento: formEditar.elements["fechaNacimiento"].value.trim(),
          Correo: formEditar.elements["correo"].value.trim(),
          Celular: formEditar.elements["celular"].value.trim(),
          Tipo_Usuario: formEditar.elements["tipoUsuario"].value.trim(),
          ID_Membresia: parseInt(formEditar.elements["idMembresia"].value.trim(), 10),
          Contrasena: formEditar.elements["contrasena"]?.value?.trim() || null,
          ID_Rol: parseInt(formEditar.elements["idRol"].value.trim(), 10),
          Estado: formEditar.elements["estado"].value === "1"  // booleano si el select usa "1"/"0"
        };

        const resp = await fetch(`${API_BASE}/${payload.ID_Usuario}`, {
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


        // Recarga usuarios si tienes una función global
        if (typeof window.recargarUsuarios === 'function') {
          await window.recargarUsuarios();
        }
      } catch (err) {
        console.error('Error al editar usuario:', err);
      }
    });
  }
}


// Compatibilidad con onclick antiguos en HTML
window.abrirEditarDesdeAtributos = abrirEditarDesdeAtributos;
window.abrirModalAgregar = abrirModalAgregar;
// js/eliminar.js
// Gestiona la lógica para eliminar un usuario desde la tabla.

import { mostrarPagina } from '../comunes/listar.js';
import { vacasGlobal, cargarVacas } from './cargar.js';
import { renderPaginacion } from '../comunes/paginacion.js';
import { renderTabla, pageSize } from './main.js';

const API_BASE = 'https://localhost:44349/api/vaca';

// Guarda una referencia a la función que devuelve la página actual.
let getCurrentPage = () => 1;

/**
 * Configura la delegación de eventos en la tabla para manejar los clics en los botones de eliminar.
 * @param {Function} getPageFn - Función que devuelve el número de la página actual.
 */
export function configurarEliminar(getPageFn) {
  getCurrentPage = getPageFn;

  const tablaBody = document.getElementById('tabla-vacas');
  if (!tablaBody) {
    console.error('CRÍTICO: No se encontró el tbody #tabla-vacas para configurar los eventos.');
    return;
  }

  tablaBody.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-eliminar');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const nombre = btn.dataset.nombre || 'este usuario';

    if (!id) {
      console.error('❌ El botón no tiene un data-id válido.');
      return;
    }

    if (!confirm(`⚠️ ¿Está seguro de que desea eliminar a ${nombre}?`)) {
      return;
    }

    try {
      const resp = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });

      if (resp.status === 204) {
        alert(`✅ Vaca ${id} eliminada correctamente.`);
        await cargarVacas();

        const paginaActual = getCurrentPage();
        mostrarPagina(paginaActual, vacasGlobal, pageSize, renderTabla, renderPaginacion);

      } else if (resp.status === 404) {
        alert(`❌ Usuario con ID ${id} no encontrado.`);
      } else {
        throw new Error(`Error ${resp.status}: ${await resp.text()}`);
      }
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      alert('❌ No se pudo eliminar el usuario:\n' + err.message);
    }
  });
}

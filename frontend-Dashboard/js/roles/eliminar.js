// eliminar.js
// Elimina un usuario y conserva la página actual tras la operación

import { apiUrl } from './apiUrl.js';
import { cargarUsuarios, usuariosGlobal } from './cargar.js';

let getPage = () => 1;

/**
 * Configura la función que devuelve la página actual.
 * Se debe llamar desde modales.js con la función getCurrentPage.
 */
export function configurarEliminar(getCurrentPage) {
  getPage = getCurrentPage;
}

/**
 * Elimina un usuario por su ID y recarga la lista en la misma página.
 * @param {string} id - ID del usuario a eliminar.
 */
export async function eliminarUsuario(id) {
  if (!confirm("¿Deseas eliminar este usuario?")) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());

    alert(" Usuario eliminado.");
    await cargarUsuarios();
    mostrarPagina(getPage(), usuariosGlobal); //  Usa la versión global

  } catch (err) {
    console.error(" Error al eliminar usuario:", err);
    alert("Error al eliminar el usuario:\n" + err.message);
  }
}

//  Esta función se usa desde el HTML con onclick
window.eliminarUsuario = eliminarUsuario;

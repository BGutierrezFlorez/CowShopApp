// =============================
//  Configuración de la API
// =============================
// Cambia el puerto según tu backend ASP.NET
const API_URL = "http://localhost:5000/api/membresia";

import { mostrarPagina } from '../comunes/listar.js';
import { membresiasGlobal } from './cargar.js';
import { renderPaginacion } from '../comunes/paginacion.js';
import { renderTabla, pageSize } from './main.js';

// =============================
//  Llamada DELETE a la API
// =============================
async function eliminarMembresia(id) {
  try {
    const resp = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    // Verificar si la respuesta es exitosa
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    // Algunos backends devuelven 204 (sin contenido)
    let payload = null;
    const text = await resp.text();
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }

    console.log("✅ Membresía eliminada:", payload ?? "(sin cuerpo)");
    return true;
  } catch (error) {
    console.error("❌ Fallo en eliminarMembresia:", error);
    alert("⚠️ No se pudo eliminar la membresía. Verifica la conexión con la API.");
    return false;
  }
}

// Guarda la referencia de la función que devuelve la página actual
let getCurrentPage = () => 1;

// =============================
//  Delegación de eventos + fix de foco + actualización del array en memoria
// =============================
export function configurarEliminar(getPageFn) {
  getCurrentPage = getPageFn;

  const contenedor = document.getElementById('tabla-membresias') || document;
  if (!document.getElementById('tabla-membresias')) {
    console.warn('⚠️ No se encontró #tabla-membresias; usando delegación en document');
  }

  contenedor.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-eliminar');
    if (!btn) return;

    // Evitar navegación o submit accidental
    if (btn.tagName === 'A') e.preventDefault();
    if (document.activeElement) document.activeElement.blur();

    const rawId = btn.dataset.id ?? btn.getAttribute('data-id');
    const nombre = btn.dataset.nombre ?? btn.getAttribute('data-nombre') ?? 'esta membresía';

    // Validar ID
    const id = Number(rawId);
    if (!Number.isFinite(id) || id <= 0) {
      console.error('❌ ID inválido en .btn-eliminar:', rawId);
      return;
    }

    if (!confirm(`¿Seguro que quieres eliminar ${nombre}?`)) return;

    const ok = await eliminarMembresia(id);
    if (!ok) return;

    // Quitar del array en memoria
    const idx = membresiasGlobal.findIndex(m =>
      Number(m.id) === id || Number(m.ID_Membresia) === id
    );
    if (idx > -1) membresiasGlobal.splice(idx, 1);

    // Ajustar página si la actual quedó vacía
    const totalPages = Math.max(1, Math.ceil(membresiasGlobal.length / pageSize));
    const targetPage = Math.min(getCurrentPage(), totalPages);

    // Re-render en la página adecuada
    mostrarPagina(targetPage, membresiasGlobal, pageSize, renderTabla, renderPaginacion);
  });
}

console.debug('[eliminar.js] ✅ Listeners de eliminar configurados');

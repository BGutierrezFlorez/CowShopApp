// main.js — Gestión de Membresías con modales externos
import { cargarMembresias, membresiasGlobal } from './cargar.js';
import { mostrarPagina as paginar } from '../comunes/listar.js';
import { renderPaginacion } from '../comunes/paginacion.js';
import { cargarModales, abrirEditarDesdeAtributos, abrirModalAgregar } from './modales.js';
import { buscarMembresiaPorId } from './buscar.js';
import { configurarEliminar } from './eliminar.js'; // ← NUEVA importación

export const pageSize = 5;
let currentPage = 1;

/**
 * Intenta cargar un HTML desde varias rutas posibles
 * @param {string[]} rutasPosibles
 * @param {HTMLElement} contenedor
 */
async function cargarHTMLModalesDesdeVariasRutas(rutasPosibles, contenedor) {
  for (const ruta of rutasPosibles) {
    try {
      const resp = await fetch(ruta, { cache: 'no-store' });
      if (!resp.ok) {
        console.warn(`❌ Ruta fallida ${ruta} — HTTP ${resp.status}`);
        continue;
      }
      const html = await resp.text();
      if (!html.trim()) {
        console.warn(`⚠ El archivo ${ruta} está vacío`);
        continue;
      }
      contenedor.innerHTML = html;
      console.log(`✅ Modales cargados correctamente desde ${ruta}`);
      return true;
    } catch (err) {
      console.warn(`💥 Error cargando desde ${ruta}:`, err);
    }
  }
  contenedor.innerHTML = `<div style="color:red;padding:8px">
    No se pudieron cargar los modales desde ninguna ruta configurada.
  </div>`;
  return false;
}

/**
 * Carga el HTML de modales con rutas alternativas
 */
async function cargarHTMLModales() {
  const contenedor = document.getElementById('modales');

  const baseRelativo = './modales/modal-agregar.html';
  const baseAbsoluto = '/frontend/html/membresias/modales/modal-agregar.html';

  await cargarHTMLModalesDesdeVariasRutas(
    [baseRelativo, baseAbsoluto],
    contenedor
  );
}

/**
 * Renderiza la tabla de membresías
 */
export function renderTabla(membresias) {
  const tbody = document.getElementById("tabla-membresias");
  tbody.innerHTML = "";

  membresias.forEach(u => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${u.ID_Membresia}</td>
      <td>${u.Nombre_Membresia}</td>
      <td>${u.Valor_Membresia}</td>
      <td>
        <button class="btn btn-warning btn-sm me-1 btn-editar"
          data-id="${u.ID_Membresia}"
          data-nombre="${u.Nombre_Membresia}"
          data-valor="${u.Valor_Membresia}">
          Editar
        </button>
        <button class="btn btn-danger btn-sm btn-eliminar"
          data-id="${u.ID_Membresia}"
          data-nombre="${u.Nombre_Membresia}">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  conectarBotonesEditar();
  configurarEliminar(() => currentPage); // ← NUEVA llamada para enganchar Eliminar
}

// Exponer paginación global para botones
window.mostrarPagina = (pagina) => {
  currentPage = pagina;
  paginar(pagina, membresiasGlobal, pageSize, renderTabla, renderPaginacion);
};

function conectarBotonesEditar() {
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => abrirEditarDesdeAtributos(btn));
  });
}

export async function recargarMembresias() {
  await cargarMembresias();
  mostrarPagina(1);
}
window.recargarMembresias = recargarMembresias;

document.addEventListener("DOMContentLoaded", async () => {
  await cargarHTMLModales();
  await cargarMembresias();
  mostrarPagina(1);
  await cargarModales(() => currentPage);

  document.getElementById("btnNuevaMembresia")?.addEventListener("click", abrirModalAgregar);
  document.querySelector(".btn.btn-outline-primary")?.addEventListener("click", buscarMembresiaPorId);
  document.querySelector(".btn.btn-outline-secondary")?.addEventListener("click", recargarMembresias);
});
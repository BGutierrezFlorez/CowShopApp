// cargar.js
// Adaptado para la carga de ventas

import { ventasApiUrl } from './apiUrl.js';
import { setVentas, ventasGlobal, pageSize, paginar, formatoMoneda, paginaActual } from './state.js';
import { abrirModalEditar } from './modales.js';

const tbody = () => document.getElementById('tabla-ventas');
const pagUl = () => document.getElementById('paginacion');

export async function cargarVentas() {
  try {
    const res = await fetch(ventasApiUrl);
    if (!res.ok) throw new Error('Error HTTP ' + res.status);
    const data = await res.json();
    setVentas(Array.isArray(data) ? data : []);
    renderTabla(1);
  } catch (e) {
    tbody().innerHTML = `<tr><td colspan="5">Error al cargar ventas</td></tr>`;
    console.error(e);
  }
}

export function renderTabla(pag = 1, fuente = ventasGlobal) {
  const rows = paginar(fuente, pag, pageSize).map(v => `
    <tr data-id="${v.ID_Venta}">
      <td>${v.ID_Venta}</td>
      <td>${v.ID_Comprador}</td>
      <td>${(v.Fecha_Venta || '').slice(0,10)}</td>
      <td>${formatoMoneda(v.Total)}</td>
      <td>
        <button class="btn btn-sm btn-primary btn-editar" data-id="${v.ID_Venta}"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${v.ID_Venta}"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
  tbody().innerHTML = rows || `<tr><td colspan="5">Sin ventas.</td></tr>`;
  renderPaginacion(fuente, pag);
}

function renderPaginacion(fuente, pag) {
  const totalPag = Math.ceil(fuente.length / pageSize) || 1;
  let html = '';
  for (let i = 1; i <= totalPag; i++) {
    html += `<li class="page-item ${i===pag?'active':''}"><a class="page-link" data-page="${i}" href="#">${i}</a></li>`;
  }
  pagUl().innerHTML = html;
}

document.addEventListener('click', e => {
  if (e.target.closest('.page-link')) {
    e.preventDefault();
    const p = Number(e.target.closest('.page-link').dataset.page);
    renderTabla(p);
  }
  if (e.target.closest('.btn-editar')) {
    const id = e.target.closest('.btn-editar').dataset.id;
    const venta = ventasGlobal.find(v => String(v.ID_Venta) === String(id));
    if (venta) abrirModalEditar(venta);
  }
});

// Alias retrocompatible para imports antiguos que esperan 'cargarUsuarios'
export { cargarVentas as cargarUsuarios };
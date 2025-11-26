// buscar.js
// Funcionalidad de búsqueda de ventas

import { ventasGlobal } from './state.js';
import { renderTabla } from './cargar.js';

export function initBuscar() {
  const input = document.getElementById('buscarVenta');
  const btnBuscar = document.getElementById('btnBuscar');
  const btnTodos = document.getElementById('btnVerTodos');
  if (!input) return;

  // Búsqueda al hacer clic
  btnBuscar?.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) return renderTabla(1);
    const filtradas = ventasGlobal.filter(v => String(v.ID_Venta) === val);
    renderTabla(1, filtradas);
  });

  // Mostrar todos
  btnTodos?.addEventListener('click', () => {
    input.value = '';
    renderTabla(1);
  });
}
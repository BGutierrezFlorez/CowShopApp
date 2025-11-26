// eliminar.js
// Manejo de eliminación de ventas

import { ventasApiUrl } from './apiUrl.js';
import { notificar } from './state.js';
import { cargarVentas } from './cargar.js';

export async function eliminarVenta(id) {
  if (!confirm('¿Eliminar venta ' + id + '?')) return;
  try {
    const res = await fetch(`${ventasApiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('No eliminada');
    notificar('Venta eliminada', '#198754');
    await cargarVentas();
  } catch (e) {
    notificar('Error: ' + e.message, '#dc3545');
  }
}

document.addEventListener('click', e => {
  if (e.target.closest('.btn-eliminar')) {
    const id = e.target.closest('.btn-eliminar').dataset.id;
    eliminarVenta(id);
  }
});
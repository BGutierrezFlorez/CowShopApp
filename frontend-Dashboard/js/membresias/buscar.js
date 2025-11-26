// buscar.js — Búsqueda de membresía por ID
import { apiUrl } from './apiUrl.js';
import { renderTabla } from './main.js';   // usamos la misma función de pintado
import { renderPaginacion } from '../comunes/paginacion.js';
import { pageSize } from './main.js';

export function buscarMembresiaPorId() {
  const idInput = document.getElementById('buscarId');
  const id = idInput ? idInput.value.trim() : '';

  if (!id) {
    alert('Ingresa un ID válido');
    return;
  }

  fetch(`${apiUrl}/membresia/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('Membresía encontrada:', data);

      // Normalizar: siempre trabajar con arrays
      const membresias = Array.isArray(data) ? data : (data ? [data] : []);

      // Pintar resultados en la misma tabla
      renderTabla(membresias);

      // Mostrar paginación coherente (aunque haya un solo resultado)
      renderPaginacion(membresias.length, pageSize);
    })
    .catch(err => {
      console.error('Error buscando membresía:', err);
      alert('No se pudo encontrar la membresía');
    });
}

// Exponer para onclick en HTML si fuera necesario
window.buscarMembresiaPorId = buscarMembresiaPorId;
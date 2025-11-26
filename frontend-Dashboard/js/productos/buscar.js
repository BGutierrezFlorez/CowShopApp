// buscar.js — Búsqueda de membresía por ID
import { apiUrl } from './apiUrl.js';
import { renderTabla } from './main.js';   // usamos la misma función de pintado
import { renderPaginacion } from '../comunes/paginacion.js';
import { pageSize } from './main.js';

export function buscarVacaPorId() {
  const idInput = document.getElementById('buscarVaca');
  const id = idInput ? idInput.value.trim() : '';

  if (!id) {
    alert('Ingresa un ID válido');
    return;
  }

  fetch(`${apiUrl}/vaca/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('Vaca encontrada:', data);

      // Normalizar: siempre trabajar con arrays
      const vacas = Array.isArray(data) ? data : (data ? [data] : []);

      // Pintar resultados en la misma tabla
      renderTabla(vacas);

      // Mostrar paginación coherente (aunque haya un solo resultado)
      renderPaginacion(vacas.length, pageSize);
    })
    .catch(err => {
      console.error('Error buscando vaca:', err);
      alert('No se pudo encontrar la vaca');
    });
}

// Exponer para onclick en HTML si fuera necesario
window.buscarVacaPorId = buscarVacaPorId;

// Referencias al DOM
const inputBuscar = document.getElementById("buscarVaca");
const btnBuscar = document.getElementById("btnBuscar");
const btnVerTodos = document.getElementById("btnVerTodos");
const tablaVacas = document.getElementById("tabla-vacas");

// Función para renderizar un solo usuario
function renderVaca(vaca) {
  tablaVacas.innerHTML = `
    <tr>
      <td>${vaca.ID_Vaca || ''}</td>
      <td>${vaca.Nombre || ''}</td>
      <td>${vaca.Raza || ''}</td>
      <td>${vaca.Peso || ''}</td>
      <td>${vaca.Precio || ''}</td>
      <td>${vaca.ID_Vendedor || ''}</td>
      <td>${vaca.Estado_Salud || ''}</td>
      <td>
        <button class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `;
}

// Evento click en Buscar
btnBuscar.addEventListener("click", () => {
  const id = inputBuscar.value.trim();
  if (!id) {
    alert("Por favor ingresa un ID para buscar.");
    return;
  }
  buscarVacaPorId(id);
});


/*
 <td>${vaca.ID_Vaca || ''}</td>
      <td>${vaca.Nombre || ''}</td>
      <td>${vaca.Raza || ''}</td>
      <td>${vaca.Peso || ''}</td>
      <td>${vaca.Precio || ''}</td>
      <td>${vaca.ID_Vendedor || ''}</td>
      <td>${vaca.Estado_Salud 
*/
// Evento click en "Mostrar Todos"
btnVerTodos.addEventListener("click", async () => {
  try {
    const res = await fetch(`${apiUrl}/vaca`, {
      headers: { "Accept": "application/json" }
    });
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

    const vacas = await res.json();
    if (!Array.isArray(vacas) || vacas.length === 0) {
      tablaVacas.innerHTML = `
        <tr>
          <td colspan="10">No hay vacas para mostrar.</td>
        </tr>
      `;
      return;
    }

    tablaVacas.innerHTML = vacas.map(v => `
      <tr>
        <td>${v.ID_Vaca || ''}</td>
        <td>${v.Nombre || ''}</td>
        <td>${v.Raza || ''}</td>
        <td>${v.Peso || ''}</td>
        <td>${v.Precio || ''}</td>
        <td>${v.ID_Vendedor || ''}</td>
        <td>${v.Estado_Salud || ''}</td>
      </tr>
    `).join("");

  } catch (err) {
    console.error("Error al cargar todos los usuarios:", err);
    tablaUsuarios.innerHTML = `
      <tr>
        <td colspan="10">Error al cargar todos los usuarios: ${err.message}</td>
      </tr>
    `;
  }
});


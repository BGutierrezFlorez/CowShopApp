// buscar.js — Búsqueda de membresía por ID
import { apiUrl } from './apiUrl.js';
import { renderTabla } from './main.js';   // usamos la misma función de pintado
import { renderPaginacion } from '../comunes/paginacion.js';
import { pageSize } from './main.js';

export function buscarUsuarioPorId() {
  const idInput = document.getElementById('buscarUsuario');
  const id = idInput ? idInput.value.trim() : '';

  if (!id) {
    alert('Ingresa un ID válido');
    return;
  }

  fetch(`${apiUrl}/usuario/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('Usuario encontrado:', data);

      // Normalizar: siempre trabajar con arrays
      const usuarios = Array.isArray(data) ? data : (data ? [data] : []);

      // Pintar resultados en la misma tabla
      renderTabla(usuarios);

      // Mostrar paginación coherente (aunque haya un solo resultado)
      renderPaginacion(usuarios.length, pageSize);
    })
    .catch(err => {
      console.error('Error buscando usuario:', err);
      alert('No se pudo encontrar el usuario');
    });
}

// Exponer para onclick en HTML si fuera necesario
window.buscarUsuarioPorId = buscarUsuarioPorId;

// Referencias al DOM
const inputBuscar = document.getElementById("buscarUsuario");
const btnBuscar = document.getElementById("btnBuscar");
const btnVerTodos = document.getElementById("btnVerTodos");
const tablaUsuarios = document.getElementById("tabla-usuarios");

// Función para renderizar un solo usuario
function renderUsuario(usuario) {
  tablaUsuarios.innerHTML = `
    <tr>
      <td>${usuario.id}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.cedula}</td>
      <td>${usuario.fechaNacimiento}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.celular}</td>
      <td>${usuario.tipoUsuario}</td>
      <td>${usuario.membresia}</td>
      <td>${usuario.rol}</td>
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
  buscarUsuarioPorId(id);
});

// Evento click en "Mostrar Todos"
btnVerTodos.addEventListener("click", async () => {
  try {
    const res = await fetch(`${apiUrl}/usuario`, {
      headers: { "Accept": "application/json" }
    });
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

    const usuarios = await res.json();
    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      tablaUsuarios.innerHTML = `
        <tr>
          <td colspan="10">No hay usuarios para mostrar.</td>
        </tr>
      `;
      return;
    }

    tablaUsuarios.innerHTML = usuarios.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.nombre}</td>
        <td>${u.cedula}</td>
        <td>${u.fechaNacimiento}</td>
        <td>${u.correo}</td>
        <td>${u.celular}</td>
        <td>${u.tipoUsuario}</td>
        <td>${u.membresia}</td>
        <td>${u.rol}</td>
        <td>
          <button class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
        </td>
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

// cargar.js
import { apiUrl, authHeaders } from './apiUrl.js';

// Lista global de usuarios
export let usuariosGlobal = [];

/**
 * Carga los usuarios desde la API y los guarda en usuariosGlobal
 * También refresca la tabla HTML
 */
export async function cargarUsuarios() {
  try {
    const res = await fetch(`${apiUrl}/usuario`, {
      headers: { 'Accept': 'application/json', ...authHeaders() }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `HTTP ${res.status}`);
    }

    const data = await res.json();
    usuariosGlobal = Array.isArray(data) ? data : [];
    // Usar el renderizado centralizado de main.js
    if (typeof window.mostrarPagina === 'function') {
      window.mostrarPagina(1);
    }

  } catch (err) {
    console.error("Error al cargar usuarios:", err);
    alert("Error al cargar usuarios:\n" + err.message);
    usuariosGlobal = [];
    renderizarTablaUsuarios(); // dejar tabla vacía
  }
}

/**
 * Renderiza la tabla de usuarios en el HTML
 */
function renderizarTablaUsuarios() {
  const tbody = document.getElementById("tabla-usuarios");
  tbody.innerHTML = "";

  if (usuariosGlobal.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10">No hay usuarios para mostrar.</td>
      </tr>
    `;
    return;
  }

  usuariosGlobal.forEach(usuario => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${usuario.id || ''}</td>
      <td>${usuario.nombre || ''}</td>
      <td>${usuario.cedula || ''}</td>
      <td>${usuario.Fecha_Nacimiento || ''}</td>
      <td>${usuario.correo || ''}</td>
      <td>${usuario.celular || ''}</td>
      <td>${usuario.tipoUsuario || ''}</td>
      <td>${usuario.ID_Membresia || ''}</td>
      <td>${usuario.ID_Rol || ''}</td>
      <td>
        <button class="btn btn-sm btn-warning"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}



// // cargar.js
// import { apiUrl } from './apiUrl.js';

// // Lista global de membresías
// export let usuariosGlobal = [];

// /**
//  * Carga las membresías desde la API y las guarda en membresiasGlobal
//  */
// export async function cargarUsuarios() {
//   try {
//     const res = await fetch(`${apiUrl}/usuario`, {
//       headers: { 'Accept': 'application/json' }
//     });

//     if (!res.ok) {
//       const errText = await res.text();
//       throw new Error(errText || `HTTP ${res.status}`);
//     }

//     const data = await res.json();
//     usuariosGlobal = Array.isArray(data) ? data : [];

//   } catch (err) {
//     console.error("Error al cargar membresías:", err);
//     alert("Error al cargar membresías:\n" + err.message);
//     usuariosGlobal = [];
//   }
// }
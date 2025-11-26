// cargar.js
import { apiUrl } from './apiUrl.js';

// Lista global de vacas
export let vacasGlobal = [];

/**
 * Carga los vacas desde la API y los guarda en vacasGlobal
 * También refresca la tabla HTML
 */
export async function cargarVacas() {
  try {
    const res = await fetch(`${apiUrl}/vaca`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `HTTP ${res.status}`);
    }

    const data = await res.json();
    vacasGlobal = Array.isArray(data) ? data : [];

    // Renderizar tabla
    renderizarTablaVacas();

  } catch (err) {
    console.error("Error al cargar vacas:", err);
    alert("Error al cargar vacas:\n" + err.message);
    vacasGlobal = [];
    renderizarTablaVacas(); // dejar tabla vacía
  }
}

/**
 * Renderiza la tabla de vacas en el HTML
 */
function renderizarTablaVacas() {
  const tbody = document.getElementById("tabla-vacas");
  tbody.innerHTML = "";

  if (vacasGlobal.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10">No hay vacas para mostrar.</td>
      </tr>
    `;
    return;
  }

  vacasGlobal.forEach(vaca => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${vaca.ID_Vaca || ''}</td>
      <td>${vaca.Nombre || ''}</td>
      <td>${vaca.Raza || ''}</td>
      <td>${vaca.Peso || ''}</td>
      <td>${vaca.Precio || ''}</td>
      <td>${vaca.ID_Vendedor || ''}</td>
      <td>${vaca.Estado_Salud || ''}</td>
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
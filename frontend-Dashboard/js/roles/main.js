const API_URL = "http://localhost:5000/api/rol";
let rolesCache = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarRoles();

  // Buscar
  document.getElementById("btnBuscarRol").addEventListener("click", buscarRol);
  document.getElementById("btnVerTodosRoles").addEventListener("click", cargarRoles);

  // Crear
  document.getElementById("formAgregarRol").addEventListener("submit", crearRol);

  // Editar
  document.getElementById("formEditarRol").addEventListener("submit", actualizarRol);

  // Mostrar/ocultar inactivos
  document.getElementById("toggle-inactivos").addEventListener("change", renderRoles);
});


// ====================== Cargar roles ======================
async function cargarRoles() {
  try {
    const res = await fetch(API_URL);
    const roles = await res.json();
    rolesCache = roles; // guardamos todos
    renderRoles();      // renderizamos con el filtro aplicado
    actualizarEstadisticas(roles);
  } catch (error) {
    console.error("Error cargando roles:", error);
  }
}


// ====================== Render roles ======================
function renderRoles() {
  const mostrarInactivos = document.getElementById("toggle-inactivos").checked;
  const tabla = document.getElementById("tabla-roles");
  tabla.innerHTML = "";

  let rolesFiltrados = rolesCache;
  if (!mostrarInactivos) {
    rolesFiltrados = rolesCache.filter(r => r.Estado); // solo activos
  }

  if (rolesFiltrados.length === 0) {
    tabla.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No hay roles disponibles</td></tr>`;
    return;
  }

  rolesFiltrados.forEach(r => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${r.ID_Rol}</td>
      <td>${r.NombreRol}</td>
      <td>${r.DescripcionRol}</td>
      <td>
        <span class="badge ${r.Estado ? "badge-active" : "badge-inactive"}">
          ${r.Estado ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td>${new Date(r.FechaCreacion).toLocaleDateString()}</td>
      <td>${r.FechaModificacion ? new Date(r.FechaModificacion).toLocaleDateString() : "-"}</td>
      <td class="action-buttons">
        <button class="btn btn-sm btn-primary" onclick="abrirEditar(${r.ID_Rol}, '${r.NombreRol}', '${r.DescripcionRol}', ${r.Estado})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="eliminarRol(${r.ID_Rol})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}


// ====================== Buscar rol ======================
// ====================== Buscar rol ======================
async function buscarRol() {
  const query = document.getElementById("buscarRol").value.trim();
  if (!query) return cargarRoles();

  try {
    const res = await fetch(`${API_URL}/${query}`);
    if (!res.ok) {
      alert("Rol no encontrado");
      return;
    }
    const rol = await res.json();

    // ✅ Guardamos en cache como array (aunque sea uno solo)
    rolesCache = Array.isArray(rol) ? rol : [rol];

    // ✅ Renderizamos usando el cache actualizado
    renderRoles();
    actualizarEstadisticas(rolesCache);
  } catch (error) {
    console.error("Error buscando rol:", error);
  }
}


// ====================== Crear rol ======================
async function crearRol(e) {
  e.preventDefault();

  const rol = {
    NombreRol: document.getElementById("agregar-nombreRol").value,
    DescripcionRol: document.getElementById("agregar-descripcionRol").value,
    Estado: document.getElementById("agregar-estado").checked,
    FechaCreacion: new Date().toISOString()
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rol)
    });
    if (res.ok) {
      alert("Rol creado correctamente");
      document.getElementById("formAgregarRol").reset();
      bootstrap.Modal.getInstance(document.getElementById("modalAgregarRol")).hide();
      cargarRoles();
    } else {
      alert("Error al crear rol");
    }
  } catch (error) {
    console.error("Error creando rol:", error);
  }
}

// ====================== Abrir modal editar ======================
function abrirEditar(id, nombre, descripcion, estado) {
  document.getElementById("editar-idRol").value = id;
  document.getElementById("editar-nombreRol").value = nombre;
  document.getElementById("editar-descripcionRol").value = descripcion;
  document.getElementById("editar-estado").checked = estado;

  const modal = new bootstrap.Modal(document.getElementById("modalEditarRol"));
  modal.show();
}

// ====================== Actualizar rol ======================
async function actualizarRol(e) {
  e.preventDefault();

  const id = document.getElementById("editar-idRol").value;
  const rol = {
    NombreRol: document.getElementById("editar-nombreRol").value,
    DescripcionRol: document.getElementById("editar-descripcionRol").value,
    Estado: document.getElementById("editar-estado").checked
  };

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rol)
    });
    if (res.ok) {
      alert("Rol actualizado correctamente");
      bootstrap.Modal.getInstance(document.getElementById("modalEditarRol")).hide();
      cargarRoles();
    } else {
      alert("Error al actualizar rol");
    }
  } catch (error) {
    console.error("Error actualizando rol:", error);
  }
}

// ====================== Eliminar rol ======================
async function eliminarRol(id) {
  if (!confirm("¿Seguro de eliminar este rol?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Rol eliminado correctamente");
      cargarRoles();
    } else {
      alert("Error al eliminar rol");
    }
  } catch (error) {
    console.error("Error eliminando rol:", error);
  }
}

// ====================== Actualizar estadísticas ======================
function actualizarEstadisticas(roles) {
  document.getElementById("total-roles").textContent = roles.length;
  document.getElementById("active-roles").textContent = roles.filter(r => r.Estado).length;
  document.getElementById("inactive-roles").textContent = roles.filter(r => !r.Estado).length;
}

// Exponer funciones al scope global (para usarlas en HTML onclick)
window.abrirEditar = abrirEditar;
window.eliminarRol = eliminarRol;

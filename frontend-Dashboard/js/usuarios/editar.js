import { apiUrl } from './apiUrl.js';
import { cargarUsuarios, usuariosGlobal } from './cargar.js';

async function verificarExistenciaUsuario(id) {
  try {
    const res = await fetch(`${apiUrl}/${id}`);
    return res.ok;
  } catch (err) {
    console.error("Error al verificar existencia del usuario:", err);
    return false;
  }
}

async function crearUsuario(usuario) {
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });

    if (!res.ok) throw new Error(await res.text());
    alert("✅ Usuario creado correctamente.");
    await cargarUsuarios();
  } catch (err) {
    console.error("Error al crear usuario:", err);
    alert("❌ No se pudo crear el usuario:\n" + err.message);
  }
}

export function configurarEditar(getCurrentPage) {
  const modalEditar = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEditar"));
  const formEditar = document.getElementById("formEditarUsuario");

  formEditar.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuarioEditado = {
  ID_Usuario: parseInt(formEditar.elements["id"].value.trim(), 10),
  Nombre: formEditar.elements["nombre"].value.trim(),
  Cedula: formEditar.elements["cedula"].value.trim(),
  Fecha_Nacimiento: formEditar.elements["fechaNacimiento"].value.trim(),
  Correo: formEditar.elements["correo"].value.trim(),
  Celular: formEditar.elements["celular"].value.trim(),
  Tipo_Usuario: formEditar.elements["tipoUsuario"].value.trim(),
  ID_Membresia: parseInt(formEditar.elements["idMembresia"].value.trim(), 10),
  Contrasena: formEditar.elements["contrasena"]?.value?.trim() || null,
  ID_Rol: parseInt(formEditar.elements["idRol"].value.trim(), 10),
  Estado: formEditar.elements["estado"].value === "Activo"   // 🔥 ahora booleano
};

    const existe = await verificarExistenciaUsuario(usuarioEditado.ID_Usuario);
    if (!existe) {
      const crear = confirm(`⚠️ El usuario con ID ${usuarioEditado.ID_Usuario} no existe.\n¿Deseas crearlo ahora?`);
      if (crear) {
        await crearUsuario(usuarioEditado);
      }
      return;
    }

    try {
      console.log("Datos enviados al backend:", usuarioEditado);
      const res = await fetch(`${apiUrl}/${usuarioEditado.ID_Usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioEditado)
      });

      if (!res.ok) throw new Error(await res.text());

      modalEditar.hide();
      await cargarUsuarios();
      const paginaActual = getCurrentPage();
      mostrarPagina(paginaActual, usuariosGlobal);

    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      alert("❌ Error al actualizar el usuario:\n" + err.message);
    }
  });
}

window.abrirEditarDesdeAtributos = (btn) => {
  console.log("Valores del botón:", btn.dataset);

  const form = document.getElementById("formEditarUsuario");

  form.elements["id"].value = btn.dataset.id;
form.elements["nombre"].value = btn.dataset.nombre;
form.elements["cedula"].value = btn.dataset.cedula;
form.elements["fechaNacimiento"].value = btn.dataset.fechaNacimiento;
form.elements["correo"].value = btn.dataset.correo;
form.elements["celular"].value = btn.dataset.celular;
form.elements["tipoUsuario"].value = btn.dataset.tipoUsuario;
form.elements["idMembresia"].value = btn.dataset.idMembresia;
if (form.elements["contrasena"]) form.elements["contrasena"].value = btn.dataset.contrasena || "";
form.elements["idRol"].value = btn.dataset.idRol;
form.elements["estado"].value = btn.dataset.estado === "true" ? "Activo" : "Inactivo";

  const modalEditar = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEditar"));
  modalEditar.show();
};
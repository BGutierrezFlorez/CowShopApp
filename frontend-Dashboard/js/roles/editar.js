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
      ID_Usuario: parseInt(formEditar.id.value.trim(), 10),
      Nombre: formEditar.nombre.value.trim(),
      Cedula: formEditar.cedula.value.trim(),
      Fecha_Nacimiento: formEditar.fechaNacimiento.value.trim(),
      Correo: formEditar.correo.value.trim(),
      Celular: formEditar.celular.value.trim(),
      Tipo_Usuario: formEditar.tipoUsuario.value.trim(),
      ID_Membresia: parseInt(formEditar.idMembresia.value.trim(), 10),
      Contrasena: formEditar.contrasena?.value?.trim() || null
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
  const form = document.getElementById("formEditarUsuario");

  form.id.value = btn.dataset.id;
  form.nombre.value = btn.dataset.nombre;
  form.cedula.value = btn.dataset.cedula;
  form.fechaNacimiento.value = btn.dataset.fechaNacimiento;
  form.correo.value = btn.dataset.correo;
  form.celular.value = btn.dataset.celular;
  form.tipoUsuario.value = btn.dataset.tipoUsuario;
  form.idMembresia.value = btn.dataset.idMembresia;
  if (form.contrasena) form.contrasena.value = btn.dataset.contrasena || "";

  const modalEditar = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEditar"));
  modalEditar.show();
};
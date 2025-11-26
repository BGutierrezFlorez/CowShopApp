import { apiUrl } from './apiUrl.js';
import { cargarVacas, vacasGlobal } from './cargar.js';

async function verificarExistenciaVaca(id) {
  try {
    const res = await fetch(`http://localhost:5000/api/vaca/${id}`);
    return res.ok;
  } catch (err) {
    console.error("Error al verificar existencia de la vaca:", err);
    return false;
  }
}

async function crearVaca(vaca) {
  try {
    const res = await fetch("http://localhost:5000/api/vaca", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vaca)
    });

    if (!res.ok) throw new Error(await res.text());
    alert("✅ Vaca creada correctamente.");
    await cargarVacas();
  } catch (err) {
    console.error("Error al crear vaca:", err);
    alert("❌ No se pudo crear la vaca:\n" + err.message);
  }
}

export function configurarEditar(getCurrentPage) {
  const modalEditar = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEditar"));
  const formEditar = document.getElementById("formEditarVaca");

  formEditar.addEventListener("submit", async function (e) {
    e.preventDefault();

    const vacaEditada = {
      ID_Vaca: parseInt(formEditar.elements["id"].value.trim(), 10),
      nombre: formEditar.elements["nombre"].value.trim(),
      raza: formEditar.elements["raza"].value.trim(),
      Peso: parseFloat(formEditar.elements["peso"].value.trim()),
      Precio: formEditar.elements["precio"].value.trim(),
      ID_Vendedor: formEditar.elements["id_vendedor"].value.trim(),
      Estado_Salud: formEditar.elements["estado_salud"].value.trim()
    };

    const existe = await verificarExistenciaVaca(vacaEditada.ID_Vaca);
    if (!existe) {
      const crear = confirm(`⚠️ La vaca con ID ${vacaEditada.ID_Vaca} no existe.\n¿Deseas crearla ahora?`);
      if (crear) {
        await crearVaca(vacaEditada);
      }
      return;
    }

    try {
      console.log("Datos enviados al backend:", vacaEditada);
      const res = await fetch(`http://localhost:5000/api/vaca/${vacaEditada.ID_Vaca}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vacaEditada)
      });

      if (!res.ok) throw new Error(await res.text());

      modalEditar.hide();
      await cargarVacas();
      const paginaActual = getCurrentPage();
      mostrarPagina(paginaActual, vacasGlobal);

    } catch (err) {
      console.error("Error al actualizar vaca:", err);
      alert("❌ Error al actualizar la vaca:\n" + err.message);
    }
  });
}

window.abrirEditarDesdeAtributos = (btn) => {
  console.log("Valores del botón:", btn.dataset);

  const form = document.getElementById("formEditarVaca");

  form.elements["id"].value = btn.dataset.id;
  form.elements["nombre"].value = btn.dataset.nombre;
  form.elements["raza"].value = btn.dataset.raza;
  form.elements["peso"].value = btn.dataset.peso;
  form.elements["precio"].value = btn.dataset.precio;
  form.elements["id_vendedor"].value = btn.dataset.idVendedor;
  form.elements["estado_salud"].value = btn.dataset.estadoSalud;

  const modalEditar = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEditar"));
  modalEditar.show();
};
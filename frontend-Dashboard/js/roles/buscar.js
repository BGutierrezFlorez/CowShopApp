// buscar.js
// Busca un usuario por ID y muestra el resultado

import { apiUrl } from './apiUrl.js';

export async function buscarUsuarioPorId(renderTabla, renderPaginacion) {
  const id = document.getElementById("buscarId").value.trim();
  if (!id) return alert("Por favor ingresa un ID.");

  try {
    const res = await fetch(`${apiUrl}/${id}`);
    if (!res.ok) return alert(" Usuario no encontrado.");

    const data = await res.json();
    const lista = Array.isArray(data) ? data : [data];
    renderTabla(lista);
    renderPaginacion(lista.length, 1);

  } catch (err) {
    console.error(" Error al buscar usuario:", err);
    alert("Error al buscar el usuario:\n" + err.message);
  }
}

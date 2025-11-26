// agregar.js
import { ventasPostUrl } from './apiUrl.js';
import { notificar } from './state.js';
import { cargarVentas } from './cargar.js';

export function initAgregar() {
  const form = document.getElementById('formAgregarVenta');
  const detalleContainer = document.getElementById('vacasContainer');
  const totalInput = document.getElementById('total'); // input donde muestras el total

  if (!form) return;

  // 🔹 Función para recalcular y mostrar el total
  function actualizarTotal() {
    let total = 0;
    detalleContainer.querySelectorAll('.vaca-item').forEach(row => {
      const precio = row.querySelector('input[name="precioVaca"]').value;
      if (precio) total += parseFloat(precio) || 0;
    });
    totalInput.value = total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    return total;
  }

  // Escuchar cambios en precios para actualizar el total automáticamente
  detalleContainer.addEventListener('input', e => {
    if (e.target.name === 'precioVaca') {
      actualizarTotal();
    }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const idComprador = document.getElementById('agregar-comprador').value.trim();
    const fechaVenta = document.getElementById('agregar-fechaVenta').value;

    // Construir VacasDetalle
    const vacasDetalle = [];
    let total = 0;
    detalleContainer.querySelectorAll('.vaca-item').forEach(row => {
      const idVaca = row.querySelector('input[name="idVaca"]').value;
      const precio = row.querySelector('input[name="precioVaca"]').value;
      if (idVaca && precio) {
        const precioNum = parseFloat(precio);
        vacasDetalle.push({
          ID_Vaca: Number(idVaca),
          Precio: precioNum
        });
        total += precioNum;
      }
    });

    if (!idComprador || !fechaVenta || vacasDetalle.length === 0) {
      notificar('Complete todos los campos y agregue al menos una vaca', '#dc3545');
      return;
    }

    // 🔹 Asegurarse de que el input total muestre el valor correcto
    totalInput.value = total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

    const payload = {
      ID_Comprador: Number(idComprador),
      Fecha_Venta: fechaVenta,
      Total: total, // se envía el número real
      VacasDetalle: vacasDetalle
    };

    try {
      const res = await fetch(ventasPostUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('No se pudo crear');
      notificar('Venta creada');
      form.reset();
      detalleContainer.innerHTML = ''; // limpiar vacas
      totalInput.value = "$0"; // reset total visible
      bootstrap.Modal.getInstance(document.getElementById('modalAgregar'))?.hide();
      await cargarVentas();
    } catch (err) {
      notificar('Error al crear: ' + err.message, '#dc3545');
    }
  });
}

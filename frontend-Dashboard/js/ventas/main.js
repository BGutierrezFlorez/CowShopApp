// Config
const API_URL = 'http://localhost:5000/api/venta'; // antes: /api/venta
const MULTI_SALE_URL = 'http://localhost:5000/api/venta/multiple'; // nuevo endpoint multiple
const PAGE_SIZE = 5;

// Estado
let ventas = [];
let paginaActual = 1;
let vacasDetalle = []; // array de objetos DetalleVenta (sin ID_Venta)

// Utilidades
const $ = sel => document.querySelector(sel);
function formatoMoneda(v) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(v || 0));
}
function notificar(msg, color = '#0d6efd') {
  const d = document.createElement('div');
  d.textContent = msg;
  Object.assign(d.style, { // corregido: antes usaba d.style(...)
    position: 'fixed', bottom: '20px', right: '20px', background: color, color: '#fff',
    padding: '10px 16px', borderRadius: '6px', zIndex: 9999, fontSize: '14px'
  });
  document.body.appendChild(d); setTimeout(() => d.remove(), 3000);
}

// Recalcula total mostrado
function actualizarTotal() {
  const total = vacasDetalle.reduce((s, v) => s + Number(v.PrecioUnitario || 0), 0);
  const totalInput = document.getElementById('total');
  if (totalInput) totalInput.value = formatoMoneda(total);
}

// Render cuerpo tabla detalle
function renderDetalle() {
  const tbody = document.getElementById('tabla-detalle-venta');
  if (!tbody) return;
  if (!vacasDetalle.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Sin vacas agregadas.</td></tr>';
    actualizarTotal();
    return;
  }
  tbody.innerHTML = vacasDetalle.map((d, i) => `
    <tr data-index="${i}">
      <td>${d.ID_Vaca}</td>
      <td>${formatoMoneda(d.PrecioUnitario)}</td>
      <td>${d.Nombre_Vaca || ''}</td>
      <td>${d.Raza || ''}</td>
      <td>${d.Edad || ''}</td>
      <td>${d.Peso || ''}</td>
      <td>${d.Estado_Vaca || ''}</td>
      <td><button type="button" class="btn btn-sm btn-outline-danger" data-remove="${i}">&times;</button></td>
    </tr>
  `).join('');
  actualizarTotal();
}

// Intenta obtener datos de vaca por ID
async function fetchVaca(id) {
  try {
    const r = await fetch(`http://localhost:5000/api/vaca/${id}`);
    if (!r.ok) return null;
    const v = await r.json();
    return v;
  } catch { return null; }
}

// Helpers para venta múltiple
function isoDateTime(dateStr) {
  // dateStr viene como YYYY-MM-DD del input
  return dateStr ? `${dateStr}T00:00:00` : '';
}

function construirDetalle(base) {
  const precio = Number(
    base.PrecioUnitario ??
    base.Precio ??
    base.Precio_Venta ??
    0
  );
  return {
    ID_DetalleVenta: 0,
    ID_Venta: 0,
    ID_Vaca: base.ID_Vaca || base.ID || base.id || 0,
    PrecioUnitario: precio,
    Nombre_Vaca: base.Nombre_Vaca || base.Nombre || '',
    Raza: base.Raza || '',
    Edad: base.Edad || 0,
    Peso: base.Peso || 0,
    Estado_Vaca: base.Estado_Vaca || base.Estado_Salud || base.Estado || ''
  };
}

function sanitizarDetalles(lista) {
  return lista
    .filter(d => d && d.ID_Vaca && d.PrecioUnitario > 0)
    .map(d => ({
      ID_DetalleVenta: 0,
      ID_Venta: 0,
      ID_Vaca: d.ID_Vaca,
      PrecioUnitario: Number(d.PrecioUnitario),
      Nombre_Vaca: d.Nombre_Vaca || '',
      Raza: d.Raza || '',
      Edad: Number(d.Edad) || 0,
      Peso: Number(d.Peso) || 0,
      Estado_Vaca: d.Estado_Vaca || ''
    }));
}

function construirPayloadVentaMultiple(form) {
  return {
    ID_Comprador: Number(form.idComprador.value),
    Fecha_Venta: isoDateTime(form.fechaVenta.value),
    VacasDetalle: sanitizarDetalles(vacasDetalle)
  };
}

// Carga
async function cargarVentas() {
  const tbody = $('#tabla-ventas');
  try {
    tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Respuesta inesperada');
    ventas = data;
    paginaActual = 1;
    renderTabla();
  } catch (e) {
    console.error('Error cargando ventas:', e);
    tbody.innerHTML = `<tr><td colspan="5">Error al cargar ventas. Revisa consola.</td></tr>`;
    notificar('Error al cargar ventas', '#dc3545');
  }
}

// Render
function paginar(array, page, size) {
  const start = (page - 1) * size;
  return array.slice(start, start + size);
}
function renderTabla(fuente = ventas) {
  const tbody = $('#tabla-ventas');
  const subset = paginar(fuente, paginaActual, PAGE_SIZE);
  if (!subset.length) {
    tbody.innerHTML = '<tr><td colspan="5">Sin datos.</td></tr>';
  } else {
    tbody.innerHTML = subset.map(v => `
      <tr data-id="${v.ID_Venta}">
        <td>${v.ID_Venta ?? ''}</td>
        <td>${v.ID_Comprador ?? ''}</td>
        <td>${(v.Fecha_Venta || '').slice(0, 10)}</td>
        <td>${formatoMoneda(v.Total)}</td>
        <td>
          <button class="btn btn-sm btn-danger" data-accion="eliminar" data-id="${v.ID_Venta}"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  }
  renderPaginacion(fuente);
}
function renderPaginacion(fuente) {
  const ul = $('#paginacion');
  const totalPag = Math.max(1, Math.ceil(fuente.length / PAGE_SIZE));
  if (paginaActual > totalPag) paginaActual = totalPag;
  let html = '';
  for (let i = 1; i <= totalPag; i++) {
    html += `<li class="page-item ${i === paginaActual ? 'active' : ''}">
               <a href="#" class="page-link" data-page="${i}">${i}</a>
             </li>`;
  }
  ul.innerHTML = html;
}

// Búsqueda
function initBuscar() {
  const input = $('#buscarVenta');
  $('#btnBuscar')?.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) {
      paginaActual = 1;
      renderTabla();
      return;
    }
    const filtradas = ventas.filter(v => String(v.ID_Venta) === val);
    paginaActual = 1;
    renderTabla(filtradas);
  });
  $('#btnVerTodos')?.addEventListener('click', () => {
    input.value = '';
    paginaActual = 1;
    renderTabla();
  });
}

// CRUD básico (agregar / editar / eliminar placeholders)
async function crearVenta(data) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('No creada');
    notificar('Venta creada');
    await cargarVentas();
  } catch (e) {
    console.error(e);
    notificar('Error creando', '#dc3545');
  }
}
async function crearVentaMultiple(payload) {

  let total = 0;
  payload.VacasDetalle.forEach(item => {
    total += Number(item.PrecioUnitario || 0);
  });
  payload.Total = total;
  console.log('Enviando Venta Multiple ->', payload);
  if (!payload.VacasDetalle.length) {
    notificar('Sin vacas válidas en el detalle', '#dc3545');
    return;
  }
  try {
    const res = await fetch(MULTI_SALE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const texto = await res.text().catch(() => '');
    if (!res.ok) {
      console.error('Respuesta error:', res.status, texto);
      throw new Error(texto || ('HTTP ' + res.status));
    }
    let data = {};
    try { data = JSON.parse(texto); } catch { }
    notificar(`Venta registrada #${data.ID_Venta || ''}`);
    await cargarVentas();
  } catch (e) {
    console.error('Error creando venta múltiple:', e);
    notificar('Error registrando venta: ' + e.message, '#dc3545');
    return;
  }
}
async function actualizarVenta(id, data) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('No actualizada');
    notificar('Venta actualizada');
    await cargarVentas();
  } catch (e) {
    console.error(e);
    notificar('Error actualizando', '#dc3545');
  }
}
async function eliminarVenta(id) {
  if (!confirm('Eliminar venta ' + id + '?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('No eliminada');
    notificar('Venta eliminada', '#198754');
    await cargarVentas();
  } catch (e) {
    console.error(e);
    notificar('Error eliminando', '#dc3545');
  }
}

// Modal agregar (básico en caso de que ya exista en DOM)
function initModalAgregar() {
  document.addEventListener('submit', async e => {
    if (e.target && e.target.id === 'formAgregarVenta') {
      e.preventDefault();
      const f = e.target;
      if (!vacasDetalle.length) {
        notificar('Agrega al menos una vaca', '#dc3545');
        return;
      }
      if (!f.idComprador.value || !f.fechaVenta.value) {
        notificar('Completa comprador y fecha', '#dc3545');
        return;
      }
      const payload = construirPayloadVentaMultiple(f);
      if (!payload.ID_Comprador || !payload.Fecha_Venta) {
        notificar('Datos generales inválidos', '#dc3545');
        return;
      }
      await crearVentaMultiple(payload);
      // Solo limpiar si todo fue bien (ventas recargadas)
      vacasDetalle = [];
      renderDetalle();
      f.reset();
      actualizarTotal();
      bootstrap.Modal.getInstance(document.getElementById('modalAgregarVenta'))?.hide();
    }
  });

  document.addEventListener('click', async ev => {
    if (ev.target && ev.target.id === 'btnAgregarVaca') {
      const idVacaEl = document.getElementById('detalle-idVaca');
      const idVaca = Number(idVacaEl.value);
      if (!idVaca) {
        notificar('ID Vaca requerido', '#dc3545');
        return;
      }
      const datos = await fetchVaca(idVaca);
      if (!datos) {
        notificar(`No se encontró la vaca con ID ${idVaca}`, '#dc3545');
        return;
      }
      const detalle = construirDetalle(datos);
      if (!detalle.ID_Vaca) {
        notificar('Datos inválidos de la vaca', '#dc3545');
        return;
      }
      if (detalle.PrecioUnitario <= 0) {
        notificar('La vaca no tiene precio válido (>0)', '#ffc107');
        return;
      }
      if (vacasDetalle.some(d => d.ID_Vaca === detalle.ID_Vaca)) {
        notificar('La vaca ya fue agregada', '#ffc107');
        return;
      }
      vacasDetalle.push(detalle);
      renderDetalle();
      idVacaEl.value = '';
    }
    if (ev.target && ev.target.dataset.remove !== undefined) {
      const idx = Number(ev.target.dataset.remove);
      vacasDetalle.splice(idx, 1);
      renderDetalle();
    }
  });

  // Reset detalle al abrir modal
  document.getElementById('modalAgregarVenta')?.addEventListener('show.bs.modal', () => {
    if (!vacasDetalle.length) renderDetalle();
  });
}

function ensureModalAgregar() {
  if (!document.getElementById('modalAgregarVenta')) {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
    <div class="modal fade" id="modalAgregarVenta" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <form class="modal-content" id="formAgregarVenta">
          <div class="modal-header">
            <h5 class="modal-title">Nueva Venta (Multiple)</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3 mb-2">
              <div class="col-sm-4">
                <label class="form-label">ID Comprador</label>
                <input type="number" name="idComprador" id="idComprador" class="form-control" required min="1">
              </div>
              <div class="col-sm-4">
                <label class="form-label">Fecha Venta</label>
                <input type="date" name="fechaVenta" id="fechaVenta" class="form-control" required>
              </div>
              <div class="col-sm-4">
                <label class="form-label">Total (COP)</label>
                <input type="text" id="total" class="form-control" readonly value="$0">
              </div>
            </div>
            <hr>
            <div class="row g-2 align-items-end mb-2">
              <div class="col-sm-4">
                <label class="form-label">ID Vaca</label>
                <input type="number" id="detalle-idVaca" class="form-control" min="1">
              </div>
              <div class="col-sm-8">
                <button type="button" class="btn btn-primary mt-4" id="btnAgregarVaca">
                  <i class="fas fa-plus"></i> Agregar Vaca
                </button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-sm table-bordered mb-0">
                <thead>
                  <tr>
                    <th>ID_Vaca</th>
                    <th>Precio</th>
                    <th>Nombre</th>
                    <th>Raza</th>
                    <th>Edad</th>
                    <th>Peso</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody id="tabla-detalle-venta">
                  <tr><td colspan="8" class="text-center text-muted">Sin vacas agregadas.</td></tr>
                </tbody>
              </table>
            </div>
            <div class="form-text mt-1">El precio se toma de la vaca o se solicitará.</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="btnGuardarVenta">Registrar Venta</button>
          </div>
        </form>
      </div>
    </div>`;
    document.getElementById('modales')?.appendChild(wrap);
  }
}

// Delegación de clicks (paginación + acciones)
document.addEventListener('click', e => {
  const link = e.target.closest('.page-link');
  if (link) {
    e.preventDefault();
    paginaActual = Number(link.dataset.page);
    renderTabla();
  }
  const btn = e.target.closest('button[data-accion]');
  if (btn) {
    const id = btn.dataset.id;
    const accion = btn.dataset.accion;
    const venta = ventas.find(v => String(v.ID_Venta) === String(id));
    if (accion === 'eliminar') eliminarVenta(id);
    else if (accion === 'editar') {
      if (!venta) return;
      abrirModalEditar(venta);
    }
  }
});

// Modal edición dinámico
function abrirModalEditar(venta) {
  const existing = $('#modalEditarVenta');
  if (existing) existing.remove();
  const wrap = document.createElement('div');
  wrap.innerHTML = `
  <div class="modal fade" id="modalEditarVenta" tabindex="-1">
    <div class="modal-dialog">
      <form class="modal-content" id="formEditarVenta">
        <div class="modal-header">
          <h5 class="modal-title">Editar Venta #${venta.ID_Venta}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">ID Comprador</label>
            <input type="number" name="idComprador" class="form-control" required value="${venta.ID_Comprador}">
          </div>
          <div class="mb-3">
            <label class="form-label">Fecha Venta</label>
            <input type="date" name="fechaVenta" class="form-control" required value="${(venta.Fecha_Venta || '').slice(0, 10)}">
          </div>
            <div class="mb-3">
            <label class="form-label">Total</label>
            <input type="number" step="0.01" name="total" class="form-control" required value="${venta.Total}">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>`;
  document.getElementById('modales').appendChild(wrap);
  const form = wrap.querySelector('#formEditarVenta');
  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const payload = {
      ID_Comprador: Number(form.idComprador.value),
      Fecha_Venta: form.fechaVenta.value,
      Total: Number(form.total.value)
    };
    await actualizarVenta(venta.ID_Venta, payload);
    bootstrap.Modal.getInstance(document.getElementById('modalEditarVenta'))?.hide();
  });
  new bootstrap.Modal(document.getElementById('modalEditarVenta')).show();
}

// Inicialización
window.addEventListener('DOMContentLoaded', async () => {
  ensureModalAgregar();
  await cargarVentas();
  initBuscar();
  initModalAgregar();
});
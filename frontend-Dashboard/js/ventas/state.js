export let ventasGlobal = [];
export const pageSize = 5;
export let paginaActual = 1;

export function setVentas(data) {
  ventasGlobal = data || [];
}

export function formatoMoneda(v) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(v || 0));
}

export function notificar(texto, color = '#0d6efd') {
  const d = document.createElement('div');
  d.textContent = texto;
  Object.assign(d.style, {
    position: 'fixed', bottom: '20px', right: '20px',
    background: color, color: '#fff', padding: '10px 16px',
    borderRadius: '6px', zIndex: 9999, fontSize: '14px'
  });
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 2800);
}

export function paginar(array, page, size) {
  const start = (page - 1) * size;
  return array.slice(start, start + size);
}

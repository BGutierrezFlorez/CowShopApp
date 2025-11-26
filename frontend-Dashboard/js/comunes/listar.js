// listar.js
// Muestra una página específica de usuarios en la tabla
/**
 * Muestra una página de datos paginados en la tabla.
 * @param {number} pagina - Número de página a mostrar (1-indexado).
 * @param {Array} items - Lista completa de elementos a paginar.
 * @param {number} pageSize - Cantidad de elementos por página.
 * @param {Function} renderTabla - Función que renderiza la tabla con los datos de la página.
 * @param {Function} renderPaginacion - Función que renderiza los controles de paginación.
 */
export function mostrarPagina(pagina, items, pageSize, renderTabla, renderPaginacion) {
  // Validación defensiva: el parámetro debe ser un arreglo
  if (!Array.isArray(items)) {
    console.warn("Los datos proporcionados no son un arreglo. No se puede paginar.");
    return;
  }

  // Total de elementos y páginas
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize) || 1;

  // Asegurarse de que la página solicitada está en el rango válido
  const paginaValida = Math.max(1, Math.min(pagina, totalPages));

  // Calcular rango de índices
  const inicio = (paginaValida - 1) * pageSize;
  const fin = inicio + pageSize;

  // Subconjunto de elementos para esta página
  const itemsPagina = items.slice(inicio, fin);

  // Llamar a las funciones de renderizado
  renderTabla(itemsPagina);
  renderPaginacion(total, paginaValida);
}
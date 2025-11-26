// paginacion.js
// Renderiza los botones de paginación dinámicamente

/**
 * Renderiza los botones de paginación.
 * Esta función asume que `mostrarPagina` ya está expuesta globalmente desde main.js.
 * @param {number} totalCount - Total de elementos (usuarios, productos, etc.).
 * @param {number} currentPage - Página actual.
 */
export function renderPaginacion(totalCount, currentPage) {
  const pageSize = 5;
  const totalPages = Math.ceil(totalCount / pageSize);
  const nav = document.getElementById("paginacion");
  nav.innerHTML = "";

  //  Botón "Anterior"
  nav.innerHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="mostrarPagina(${currentPage - 1})">Anterior</a>
    </li>`;

  //  Botones de página
  for (let i = 1; i <= totalPages; i++) {
    nav.innerHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" onclick="mostrarPagina(${i})">${i}</a>
      </li>`;
  }

  //  Botón "Siguiente"
  nav.innerHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="mostrarPagina(${currentPage + 1})">Siguiente</a>
    </li>`;
}

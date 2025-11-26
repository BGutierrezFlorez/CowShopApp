// main.js — Gestión de Usuarios con modales externos (Versión Optimizada y Documentada)

// --- Módulos Importados ---
// Se importan las funciones necesarias de otros archivos para mantener el código organizado.
import { cargarUsuarios, usuariosGlobal } from './cargar.js'; // Para obtener los datos
import { mostrarPagina as paginar } from '../comunes/listar.js'; // Lógica de paginación
import { renderPaginacion } from '../comunes/paginacion.js'; // Para dibujar los botones de página
import { cargarModales, abrirEditarDesdeAtributos, abrirModalAgregar } from './modales.js'; // Lógica de las ventanas modales
import { buscarUsuarioPorId } from './buscar.js'; // Lógica de búsqueda
import { configurarEliminar } from './eliminar.js'; // Lógica para activar/desactivar

// --- Configuración Global Centralizada ---
// Agrupar las configuraciones aquí facilita el mantenimiento futuro.
export const pageSize = 5; // Número de usuarios a mostrar por página.
let currentPage = 1; // La página que se está viendo actualmente.

// Mapeos para traducir IDs a texto legible. Evita lógica 'if/else' en el renderizado.
const MEMBRESIAS_MAP = { 1: 'Básica', 2: 'Profesional', 3: 'Premium' };
const ROLES_MAP = { 1: 'Administrador', 2: 'Usuario' };

// Define los archivos HTML de los modales que la página necesita.
const MODAL_FILES = [
  { id: 'modalAgregar', path: 'modal-agregar.html' },
  { id: 'modalEditar', path: 'modal-editar.html' }
];

// --- Funciones Auxiliares ---

/**
 * Intenta cargar un archivo HTML desde una lista de rutas posibles.
 * Esto hace que el código sea flexible a diferentes estructuras de carpetas.
 * @param {string} archivo - El nombre del archivo a buscar.
 * @returns {Promise<string|null>} El contenido HTML o null si falla.
 */
async function cargarHTMLDesdeRutas(archivo) {
  const rutasPosibles = [
    `./${archivo}`,
    `../usuarios/${archivo}`,
    `/frontend/js/usuarios/${archivo}` // Ejemplo de ruta absoluta
  ];
  for (const ruta of rutasPosibles) {
    try {
      const resp = await fetch(ruta, { cache: 'no-store' }); // 'no-store' para evitar problemas de caché en desarrollo.
      if (resp.ok) {
        console.log(`✅ HTML cargado correctamente desde ${ruta}`);
        return await resp.text();
      }
    } catch (err) { /* Intenta la siguiente ruta si esta falla */ }
  }
  console.error(`❌ No se pudo cargar el archivo ${archivo} desde ninguna ruta.`);
  return null;
}

/**
 * Carga el HTML para todos los modales definidos en la configuración.
 * Usa Promise.all para cargar los archivos en paralelo, mejorando la velocidad.
 */
async function cargarHTMLModales() {
  const contenedor = document.getElementById('modales');
  try {
    const promesasDeCarga = MODAL_FILES.map(file => cargarHTMLDesdeRutas(file.path));
    const htmls = await Promise.all(promesasDeCarga);

    if (htmls.some(h => h === null)) {
      throw new Error("Fallo al cargar uno o más archivos de modales.");
    }
    
    contenedor.innerHTML = htmls.join('');
  } catch (error) {
    contenedor.innerHTML = `<div class="alert alert-danger"><strong>Error crítico:</strong> ${error.message} La funcionalidad de la página está comprometida.</div>`;
  }
}

/**
 * Renderiza la tabla de usuarios en el DOM a partir de una lista de datos.
 * @param {object[]} usuarios - El array de usuarios a mostrar.
 */
export function renderTabla(usuarios) {
  const tbody = document.getElementById("tabla-usuarios");
  tbody.innerHTML = ""; // Limpiar contenido anterior para evitar duplicados.

  if (usuarios.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9">No hay usuarios para mostrar.</td></tr>';
    return;
  }
  // Se construye todo el HTML de las filas en una sola cadena para una única manipulación del DOM, lo cual es muy eficiente.
  const filasHtml = usuarios.map(u => {
  const fechaNacimiento = u.Fecha_Nacimiento ? u.Fecha_Nacimiento.split('T')[0] : 'N/A';
  const estadoBool = u.Estado === true || u.Estado === "true" || u.Estado === 1 || u.Estado === "1";

  return `
    <tr>
      <td class="align-middle">${u.ID_Usuario}</td>
      <td class="align-middle">${u.Nombre}</td>
      <td class="align-middle">${u.Cedula}</td>
      <td class="align-middle">${u.Correo}</td>
      <td class="align-middle">${u.Celular}</td>
  <td class="align-middle">${MEMBRESIAS_MAP[u.ID_Membresia] || 'N/A'}</td>
  <td class="align-middle">${u.Tipo_Usuario || 'N/A'}</td>
      <td class="align-middle text-center">
        <span class="badge ${estadoBool ? 'bg-success' : 'bg-secondary'}">
          ${estadoBool ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td class="text-center">
        <button class="btn btn-warning btn-sm me-1 btn-editar"
          data-id="${u.ID_Usuario}" data-nombre="${u.Nombre}" data-cedula="${u.Cedula}"
          data-fechanacimiento="${fechaNacimiento}" data-correo="${u.Correo}" data-celular="${u.Celular}"
          data-tipousuario="${u.Tipo_Usuario}" data-idmembresia="${u.ID_Membresia}"
          data-idrol="${u.ID_Rol}" data-estado="${u.Estado}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn ${estadoBool ? 'btn-danger' : 'btn-success'} btn-sm btn-eliminar"
          data-id="${u.ID_Usuario}" data-nombre="${u.Nombre}">
          <i class="fas ${estadoBool ? 'fa-user-slash' : 'fa-user-check'}"></i>
        </button>
      </td>
    </tr>
  `;
}).join('');


  tbody.innerHTML = filasHtml;

  conectarBotonesEditar();
}

// --- Funciones Globales y de Eventos ---

// Expone la función de paginación globalmente para que los botones generados en 'renderPaginacion' puedan llamarla.
window.mostrarPagina = (pagina) => {
  currentPage = pagina;
  paginar(pagina, usuariosGlobal, pageSize, renderTabla, renderPaginacion);
};

function conectarBotonesEditar() {
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => abrirEditarDesdeAtributos(btn));
  });
}

// Expone la función de recarga para poder ser llamada desde otros módulos si es necesario.
export async function recargarUsuarios() {
  await cargarUsuarios();
  mostrarPagina(1); // Siempre vuelve a la primera página tras una recarga.
}
window.recargarUsuarios = recargarUsuarios;

/**
 * Configura todos los listeners de eventos principales de la página en un solo lugar.
 */
function configurarEventListeners() {
    // Botones de la interfaz principal.
    document.getElementById("btnNuevoUsuario")?.addEventListener("click", abrirModalAgregar);
    document.getElementById("btnBuscar")?.addEventListener("click", buscarUsuarioPorId);
    document.getElementById("btnVerTodos")?.addEventListener("click", recargarUsuarios);

    // Delegación de eventos para la tabla: un solo listener para todos los botones de editar.
    const tabla = document.getElementById("tabla-usuarios");
    tabla.addEventListener('click', (e) => {
        const target = e.target.closest('button.btn-editar'); // Solo reacciona a los botones de editar.
        if (target) {
            abrirEditarDesdeAtributos(target);
        }
    });

    // La lógica para los botones de activar/desactivar se configura en su propio módulo para mantener el código limpio.
    configurarEliminar(() => currentPage);
}

// --- Punto de Entrada Principal (Inicialización) ---
// Se ejecuta cuando el DOM está completamente cargado y listo.
document.addEventListener("DOMContentLoaded", async () => {
  // La secuencia de inicialización es importante:
  await cargarHTMLModales();        // 1. Carga la estructura HTML de las ventanas.
  await cargarUsuarios();           // 2. Obtiene los datos de la API.
  mostrarPagina(1);                 // 3. Dibuja la tabla con los datos iniciales.
  await cargarModales(() => currentPage); // 4. Conecta la lógica JS a las ventanas modales ya cargadas.
  configurarEventListeners();       // 5. Conecta los eventos a los botones de la página principal.
});
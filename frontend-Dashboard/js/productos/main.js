
// --- Módulos Importados ---
// Se importan las funciones necesarias de otros archivos para mantener el código organizado.
import { cargarVacas, vacasGlobal } from './cargar.js'; // Para obtener los datos
import { mostrarPagina as paginar } from '../comunes/listar.js'; // Lógica de paginación
import { renderPaginacion } from '../comunes/paginacion.js'; // Para dibujar los botones de página
import { cargarModales, abrirEditarDesdeAtributos, abrirModalAgregar } from './modales.js'; // Lógica de las ventanas modales
import {  buscarVacaPorId } from './buscar.js'; // Lógica de búsqueda
import { configurarEliminar } from './eliminar.js'; // Lógica para activar/desactivar

// --- Configuración Global Centralizada ---
// Agrupar las configuraciones aquí facilita el mantenimiento futuro.
export const pageSize = 5; 
let currentPage = 1; // La página que se está viendo actualmente.

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
    `../productos/${archivo}`,
    `/frontend/js/productos/${archivo}` // Ejemplo de ruta absoluta
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
 * @param {object[]} vacas 
 */
export function renderTabla(vacas) {
  const tbody = document.getElementById("tabla-vacas");
  tbody.innerHTML = ""; // Limpiar contenido anterior para evitar duplicados.

  if (vacas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9">No hay vacas para mostrar.</td></tr>';
    return;
  }
  // Se construye todo el HTML de las filas en una sola cadena para una única manipulación del DOM, lo cual es muy eficiente.
  const filasHtml = vacas.map(v => {
  const fechaNacimiento = v.Fecha_Nacimiento ? v.Fecha_Nacimiento.split('T')[0] : 'N/A';
  const estadoBool = Number(v.Estado) === 1;
/*
  <td>${vaca.ID_Vaca || ''}</td>
      <td>${vaca.Nombre || ''}</td>
      <td>${vaca.Raza || ''}</td>
      <td>${vaca.Peso || ''}</td>
      <td>${vaca.Precio || ''}</td>
      <td>${vaca.ID_Vendedor || ''}</td>
      <td>${vaca.Estado_Salud || ''}</td>
*/
  return `
    <tr>
      <td class="align-middle">${v.ID_Vaca || ''}</td>
      <td class="align-middle">${v.Nombre || ''}</td>
      <td class="align-middle">${v.Raza || ''}</td>
      <td class="align-middle">${v.Peso || ''}</td>
      <td class="align-middle">${v.Precio || ''}</td>
      <td class="align-middle">${v.ID_Vendedor || ''}</td>
      <td class="align-middle">${v.Estado_Salud || ''}</td>
      <td class="text-center">
      <button class="btn btn-warning btn-sm me-1 btn-editar"
        data-id="${v.ID_Vaca}"
        data-nombre="${v.Nombre}"
        data-raza="${v.Raza}"
        data-peso="${v.Peso}"
        data-precio="${v.Precio}"
        data-id_vendedor="${v.ID_Vendedor}"
        data-estado_salud="${v.Estado_Salud}">
        <i class="fas fa-edit"></i>
      </button>
      <button class="btn  btn-danger btn-sm btn-eliminar"
        data-id="${v.ID_Vaca}" data-nombre="${v.Nombre}">
        <i class="fas fa-trash"></i>
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
  paginar(pagina, vacasGlobal, pageSize, renderTabla, renderPaginacion);
};

function conectarBotonesEditar() {
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => abrirEditarDesdeAtributos(btn));
  });
}

// Expone la función de recarga para poder ser llamada desde otros módulos si es necesario.
export async function recargarVacas() {
  await cargarVacas();
  mostrarPagina(1); // Siempre vuelve a la primera página tras una recarga.
}
window.recargarVacas = recargarVacas;

/**
 * Configura todos los listeners de eventos principales de la página en un solo lugar.
 */
function configurarEventListeners() {
    // Botones de la interfaz principal.
    document.getElementById("btnNuevaVaca")?.addEventListener("click", abrirModalAgregar);
    document.getElementById("btnBuscar")?.addEventListener("click", buscarVacaPorId);
    document.getElementById("btnVerTodos")?.addEventListener("click", recargarVacas);

    // Delegación de eventos para la tabla: un solo listener para todos los botones de editar.
    const tabla = document.getElementById("tabla-vacas");
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
  await cargarVacas();           // 2. Obtiene los datos de la API.
  mostrarPagina(1);                 // 3. Dibuja la tabla con los datos iniciales.
  await cargarModales(() => currentPage); // 4. Conecta la lógica JS a las ventanas modales ya cargadas.
  configurarEventListeners();       // 5. Conecta los eventos a los botones de la página principal.
});
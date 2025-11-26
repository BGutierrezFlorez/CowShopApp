// modales.js
// Carga los modales HTML y configura sus eventos para agregar, editar y eliminar usuarios

//  Importaciones de funciones específicas para cada modal
import { configurarEditar } from './editar.js';
import { configurarEliminar } from './eliminar.js';

/**
 *  Función principal que carga los modales y configura sus eventos.
 * @param {Function} getCurrentPage - Función que devuelve la página actual.
 */
export async function cargarModales(getCurrentPage) {
  const cont = document.getElementById("modales");

  //  Limpia el contenedor para evitar duplicados si se vuelve a llamar
  cont.innerHTML = "";

  //  Cargar el HTML del modal de agregar
  const htmlAgregar = await fetch("modal-agregar.html").then(r => r.text());
 
  cont.innerHTML += htmlAgregar;

  //  Esperar a que el formulario esté disponible en el DOM
  await esperarElemento("#formAgregarUsuario");
  configurarAgregar(); // Conecta el evento submit

  //  Cargar el HTML del modal de editar
  const htmlEditar = await fetch("modal-editar.html").then(r => r.text());
  
  cont.innerHTML += htmlEditar;

  //  Esperar a que el formulario de edición esté disponible
  await esperarElemento("#formEditarUsuario");
  configurarEditar(getCurrentPage); // Conecta el evento submit

  //  Configurar la lógica de eliminación
  configurarEliminar(getCurrentPage);
}

/**
 *  Espera hasta que un selector exista en el DOM.
 * @param {string} selector - Selector CSS del elemento a esperar.
 * @returns {Promise<void>}
 */
function esperarElemento(selector) {
  return new Promise(resolve => {
    const intervalo = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(intervalo);
        resolve();
      }
    }, 50);
  });
}

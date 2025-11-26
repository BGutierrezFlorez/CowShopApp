// cargar.js
// Carga la lista de roles desde el backend y la guarda en memoria

import { apiUrl } from './apiUrl.js';

// Lista global de roles (se actualiza con cada carga)
export let rolesGlobal = [];

/**
 * Carga los roles desde la API y los guarda en rolesGlobal.
 */
export async function cargarRoles() {
  try {
    const res = await fetch(`${apiUrl}/roles`);
    if (!res.ok) throw new Error(await res.text());

    rolesGlobal = await res.json();
    
    // ✅ Formatear datos para mejor visualización
    rolesGlobal = rolesGlobal.map(rol => ({
      ...rol,
      
      // ✅ Asegurar que ID_Rol sea numérico
      ID_Rol: rol.ID_Rol !== null && rol.ID_Rol !== undefined 
        ? parseInt(rol.ID_Rol) 
        : null,
      
      // ✅ Validar que el nombre del rol no sea una fecha
      Nombre_Rol: esFecha(rol.Nombre_Rol) ? `ROL-${rol.ID_Rol}` : rol.Nombre_Rol,
      
      // Asegurar que Estado sea booleano
      Estado: Boolean(rol.Estado),
      
      // Formatear FechaCreacion (si existe)
      FechaCreacion: rol.FechaCreacion 
        ? new Date(rol.FechaCreacion).toLocaleDateString('es-ES') 
        : 'N/A',
      
      // Formatear FechaModificacion (si existe)
      FechaModificacion: rol.FechaModificacion 
        ? new Date(rol.FechaModificacion).toLocaleDateString('es-ES') 
        : 'N/A'
    }));
    
    console.log('Roles cargados:', rolesGlobal); // Para debugging
    
  } catch (err) {
    console.error("Error al cargar roles:", err);
    alert("Error al cargar roles:\n" + err.message);
    rolesGlobal = []; // Limpia la lista en caso de error
  }
}

/**
 * Función auxiliar para verificar si un valor tiene formato de fecha
 */
function esFecha(valor) {
  if (typeof valor !== 'string') return false;
  
  // Patrones comunes de fecha
  const datePatterns = [
    /^\d{1,2}\/\d{1,2}\/\d{4}$/, // DD/MM/YYYY
    /^\d{1,2}-\d{1,2}-\d{4}$/,   // DD-MM-YYYY
    /^\d{4}-\d{1,2}-\d{1,2}$/,   // YYYY-MM-DD
    /^\d{1,2}\/\d{1,2}\/\d{2}$/  // DD/MM/YY
  ];
  
  return datePatterns.some(pattern => pattern.test(valor)) || !isNaN(Date.parse(valor));
}

/**
 * Obtiene un rol por su ID desde la lista global
 */
export function obtenerRolPorId(id) {
  return rolesGlobal.find(rol => rol.ID_Rol === parseInt(id));
}

/**
 * Filtra roles por estado (activos/inactivos)
 */
export function filtrarRolesPorEstado(estado = true) {
  return rolesGlobal.filter(rol => Boolean(rol.Estado) === estado);
}

/**
 * Obtiene roles por nombre (búsqueda parcial)
 */
export function buscarRolesPorNombre(nombre) {
  const searchTerm = nombre.toLowerCase();
  return rolesGlobal.filter(rol => 
    rol.Nombre_Rol.toLowerCase().includes(searchTerm)
  );
}

/**
 * Obtiene los permisos de un rol específico
 */
export function obtenerPermisosDeRol(idRol) {
  const rol = obtenerRolPorId(idRol);
  return rol && rol.Permisos ? rol.Permisos : [];
}

/**
 * Verifica si un rol tiene un permiso específico
 */
export function rolTienePermiso(idRol, permiso) {
  const permisos = obtenerPermisosDeRol(idRol);
  return permisos.includes(permiso);
}
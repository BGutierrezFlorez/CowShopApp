// cargar.js
import { apiUrl } from './apiUrl.js';

// Lista global de membresías
export let membresiasGlobal = [];

/**
 * Carga las membresías desde la API y las guarda en membresiasGlobal
 */
export async function cargarMembresias() {
  try {
    const res = await fetch(`${apiUrl}/membresia`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `HTTP ${res.status}`);
    }

    const data = await res.json();
    membresiasGlobal = Array.isArray(data) ? data : [];

  } catch (err) {
    console.error("Error al cargar membresías:", err);
    alert("Error al cargar membresías:\n" + err.message);
    membresiasGlobal = [];
  }
}
// apiUrl.js
// Define la URL base del backend para las operaciones CRUD

export const apiUrl = 'http://localhost:5000/api/usuario';

export function authHeaders() {
	const token = localStorage.getItem('cowshop_token');
	return token ? { 'Authorization': 'Bearer ' + token } : {};
}
// Asegúrate de que esta URL coincida con la de tu backend

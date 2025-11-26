// apiUrl.js
// URL base del backend
export const apiUrl = 'http://localhost:5000/api';

export function authHeaders() {
	const token = localStorage.getItem('cowshop_token');
	return token ? { 'Authorization': 'Bearer ' + token } : {};
}
//
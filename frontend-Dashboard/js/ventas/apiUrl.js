// apiUrl.js
export const ventasApiUrl = "http://localhost:5000/api/venta";
export const ventasPostUrl = "http://localhost:5000/api/venta/multiple";

export function authHeaders() {
	const token = localStorage.getItem('cowshop_token');
	return token ? { 'Authorization': 'Bearer ' + token } : {};
}

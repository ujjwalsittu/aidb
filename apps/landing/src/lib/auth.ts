export function getToken() {
  return localStorage.getItem("aidb_token");
}
export function setToken(token: string) {
  localStorage.setItem("aidb_token", token);
}
export function clearToken() {
  localStorage.removeItem("aidb_token");
}
export function logout() {
  clearToken();
  window.location.href = "/";
}

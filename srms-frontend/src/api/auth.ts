export function isAdmin(): boolean {
  return localStorage.getItem("role") === "admin";
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

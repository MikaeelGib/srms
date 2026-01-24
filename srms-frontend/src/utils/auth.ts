import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  role: "admin" | "student";
  exp: number;
}

/* ======================
   TOKEN HELPERS
====================== */

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const isAdmin = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role === "admin";
  } catch {
    return false;
  }
};

/* ======================
   NEW – GET USER
====================== */

export const getUser = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.exp * 1000 < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
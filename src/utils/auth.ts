// import { jwtDecode } from "jwt-decode";

// const TOKEN_KEY = "sweetshop_token";

// export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
// export const getToken = () => localStorage.getItem(TOKEN_KEY);
// export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// type JwtPayload = {
//   roles?: string;
//   [key: string]: unknown;
// };

// export const getUserRoles = (): string[] => {
//   const token = getToken();
//   if (!token) return [];
//   const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
//   return decoded.roles ? decoded.roles.split(",") : [];
// };

// export const isAdmin = () => getUserRoles().includes("ROLE_ADMIN");
// export const isLoggedIn = () => !!getToken();



import {jwtDecode} from "jwt-decode";

const TOKEN_KEY = "sweetshop_token";

// Browser-only helpers
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

type JwtPayload = {
  roles?: string;
  [key: string]: unknown;
};

export const getUserRoles = (): string[] => {
  const token = getToken();
  if (!token) return [];
  const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
  return decoded.roles ? decoded.roles.split(",") : [];
};

export const isAdmin = () => getUserRoles().includes("ROLE_ADMIN");
export const isLoggedIn = () => !!getToken();

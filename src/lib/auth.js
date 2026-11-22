import Cookies from "js-cookie";

const TOKEN_KEY = "msjwt";

export const getToken = () => Cookies.get(TOKEN_KEY);
export const setToken = (token) => Cookies.set(TOKEN_KEY, token, { expires: 1 });
export const clearToken = () => Cookies.remove(TOKEN_KEY);
export const isAuthenticated = () => Boolean(getToken());

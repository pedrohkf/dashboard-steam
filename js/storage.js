const KEY = "users";
const SESSION = "session";

export const getUsers = () => JSON.parse(localStorage.getItem(KEY) ?? "[]");
export const saveUsers = (user) => localStorage.setItem(KEY, JSON.stringify([...getUsers(), user]));

export const getSession = () => JSON.parse(sessionStorage.getItem(SESSION) ?? "null");
export const setSession = (user) => sessionStorage.setItem(SESSION, JSON.stringify(user));

export const clearSession = () => sessionStorage.removeItem(SESSION);
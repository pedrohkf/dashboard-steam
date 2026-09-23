const KEY = "users";
const SESSION = "session";

// Contas cadastradas: localStorage persiste entre sessões/abas, sobrevive fechar o navegador.
export const getUsers = () => JSON.parse(localStorage.getItem(KEY) ?? "[]");
export const saveUsers = (user) => localStorage.setItem(KEY, JSON.stringify([...getUsers(), user]));

// Usuário logado: sessionStorage some ao fechar a aba, simula logoff automático.
export const getSession = () => JSON.parse(sessionStorage.getItem(SESSION) ?? "null");
export const setSession = (user) => sessionStorage.setItem(SESSION, JSON.stringify(user));

export const clearSession = () => sessionStorage.removeItem(SESSION);
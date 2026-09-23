// Busca perfil + biblioteca de jogos de um usuário Steam via API (evita expor chave da Steam no front).
export async function getGames(steamId) {
    const response = await fetch(`https://steam-api-swart.vercel.app/api/games?steamid=${steamId}`);
    if (!response.ok) throw new Error("Steam ID não encontrado"); // steamid invalido ou API fora do ar
    return response.json();
}
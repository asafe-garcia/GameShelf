// GameShelf | integração com a CheapShark API (API pública, sem chave)
// Documentação: https://apidocs.cheapshark.com
const CHEAPSHARK_URL = "https://www.cheapshark.com/api/1.0";

// Pesquisa jogos pelo título
async function buscarJogosApi(termo) {
  const consulta = new URLSearchParams({ title: termo, limit: 6 });
  const resposta = await fetch(`${CHEAPSHARK_URL}/games?${consulta}`);

  if (!resposta.ok) {
    throw new Error(`A API respondeu com erro (código ${resposta.status}).`);
  }

  return resposta.json();
}

// Usa a capa da Steam quando o jogo tem steamAppID; senão, a miniatura da própria API
function obterCapaApi(jogo) {
  if (jogo.steamAppID) {
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.steamAppID}/header.jpg`;
  }
  return jogo.thumb || "";
}

// Transforma o resultado da API no formato usado pelo GameShelf
function converterJogoApi(jogo) {
  return {
    titulo: jogo.external,
    plataforma: "pc",
    genero: "",
    ano: "",
    desenvolvedora: "",
    descricao: `Menor preço atual encontrado na CheapShark: US$ ${jogo.cheapest}.`,
    capa: obterCapaApi(jogo)
  };
}
// GameShelf | página inicial (listagem, detalhes, pesquisa, filtros e ordenação)

// ===== Estado e elementos =====
let jogos = carregarJogos();

const corpoLista = document.getElementById("lista-jogos");
const contagem = document.getElementById("contagem");

// ===== Listagem =====
function formatarNota(nota) {
  return nota === null ? "—" : String(nota).replace(".", ",");
}

function criarLinha(jogo) {
  const linha = criar("tr");

  const celulaCapa = criar("td");
  celulaCapa.append(criarImagem(jogo.capa, "Capa de " + jogo.titulo, 60));

  const celulaAcoes = criar("td");
  celulaAcoes.append(
    criar("a", "Ver detalhes", { href: "#detalhes", "data-acao": "detalhes", "data-id": jogo.id }),
    criar("a", "Editar", { href: RAIZ + "pages/cadastro.html?id=" + jogo.id }),
    criar("button", "Excluir", { type: "button", "data-acao": "excluir", "data-id": jogo.id })
  );

  linha.append(
    celulaCapa,
    criar("th", jogo.titulo, { scope: "row" }),
    criar("td", nomeDe("plataforma", jogo.plataforma)),
    criar("td", nomeDe("genero", jogo.genero)),
    criar("td", jogo.ano),
    criar("td", nomeDe("status", jogo.status)),
    criar("td", formatarNota(jogo.nota)),
    celulaAcoes
  );

  return linha;
}

// Por enquanto mostra todos os jogos (o commit de filtros altera esta função)
function obterJogosVisiveis() {
  return jogos;
}

function renderizarLista() {
  const lista = obterJogosVisiveis();
  corpoLista.replaceChildren();

  if (lista.length === 0) {
    const linhaVazia = criar("tr");
    linhaVazia.append(criar("td", "Nenhum jogo encontrado.", { colspan: 8 }));
    corpoLista.append(linhaVazia);
  } else {
    for (const jogo of lista) {
      corpoLista.append(criarLinha(jogo));
    }
  }

  contagem.textContent = `Exibindo ${lista.length} de ${jogos.length} jogo(s).`;
}

// ===== Inicialização =====
renderizarLista();
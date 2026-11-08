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

// ===== Detalhes =====
const painelDetalhe = document.getElementById("detalhe-conteudo");
let jogoSelecionadoId = null;

function mostrarDetalheVazio() {
  jogoSelecionadoId = null;
  painelDetalhe.replaceChildren(
    criar("p", "Selecione um jogo na lista para ver os detalhes.", { class: "mensagem info" })
  );
}

function mostrarDetalhes(id) {
  const jogo = jogos.find(function (item) {
    return item.id === id;
  });

  if (!jogo) {
    mostrarDetalheVazio();
    return;
  }

  jogoSelecionadoId = id;

  const cabecalho = criar("header");
  cabecalho.append(
    criar("h3", jogo.titulo),
    criar("p", (jogo.desenvolvedora || "Desenvolvedora não informada") + " · " + jogo.ano)
  );

  const figura = criar("figure");
  figura.append(
    criarImagem(jogo.capa, "Capa de " + jogo.titulo, 200),
    criar("figcaption", "Capa do jogo")
  );

  const itens = [
    ["Plataforma", nomeDe("plataforma", jogo.plataforma)],
    ["Gênero", nomeDe("genero", jogo.genero)],
    ["Desenvolvedora", jogo.desenvolvedora || "Não informada"],
    ["Ano de lançamento", jogo.ano],
    ["Status", nomeDe("status", jogo.status)],
    ["Nota", jogo.nota === null ? "Sem nota" : formatarNota(jogo.nota) + " / 10"],
    ["Descrição", jogo.descricao || "Sem descrição."]
  ];

  const lista = criar("dl");
  for (const [rotulo, valor] of itens) {
    lista.append(criar("dt", rotulo), criar("dd", valor));
  }

  const rodape = criar("footer");
  rodape.append(
    criar("a", "Editar", { href: RAIZ + "pages/cadastro.html?id=" + jogo.id }),
    criar("button", "Excluir", { type: "button", "data-acao": "excluir", "data-id": jogo.id })
  );

  const artigo = criar("article");
  artigo.append(cabecalho, figura, lista, rodape);
  painelDetalhe.replaceChildren(artigo);
}

// Um só ouvinte para os botões da tabela e do painel de detalhes
function tratarCliqueAcoes(evento) {
  const alvo = evento.target.closest("[data-acao]");
  if (!alvo) {
    return;
  }

  const id = Number(alvo.dataset.id);

  if (alvo.dataset.acao === "detalhes") {
    mostrarDetalhes(id);
  }
}

corpoLista.addEventListener("click", tratarCliqueAcoes);
painelDetalhe.addEventListener("click", tratarCliqueAcoes);

// ===== Inicialização =====
renderizarLista();
mostrarDetalheVazio();
// GameShelf | página inicial (listagem, detalhes, pesquisa, filtros e ordenação)

// ===== Estado e elementos =====
let jogos = carregarJogos();

const corpoLista = document.getElementById("lista-jogos");
const contagem = document.getElementById("contagem");

// ===== Listagem =====
function formatarNota(nota) {
  return nota === null ? "—" : String(nota).replace(".", ",");
}

function criarCartao(jogo) {
  const cartao = criar("li", null, { class: "cartao", "data-status": jogo.status, "data-id": jogo.id });
  if (jogo.id === jogoSelecionadoId) {
    cartao.classList.add("selecionado");
  }

  const botaoCapa = criar("button", null, {
    type: "button", class: "cartao-capa", "data-acao": "detalhes", "data-id": jogo.id,
    "aria-label": "Ver detalhes de " + jogo.titulo
  });
  botaoCapa.append(criarImagem(jogo.capa, "", 300));
  if (jogo.nota !== null) {
    botaoCapa.append(criar("span", formatarNota(jogo.nota), { class: "nota", title: "Nota" }));
  }

  const meta = criar("p", null, { class: "meta" });
  meta.append(criar("span", nomeDe("plataforma", jogo.plataforma)), criar("span", jogo.ano));

  const info = criar("div", null, { class: "cartao-info" });
  info.append(
    criar("h3", jogo.titulo),
    meta,
    criar("p", nomeDe("status", jogo.status), { class: "status" })
  );

  const acoes = criar("div", null, { class: "cartao-acoes" });
  acoes.append(
    criar("a", "Editar", { href: RAIZ + "pages/cadastro.html?id=" + jogo.id }),
    criar("button", "Excluir", { type: "button", "data-acao": "excluir", "data-id": jogo.id })
  );

  cartao.append(botaoCapa, info, acoes);
  return cartao;
}

// Aplica pesquisa, filtros e ordenação sobre a lista de jogos
function obterJogosVisiveis() {
  const termo = normalizar(campoBusca.value);

  const lista = jogos.filter(function (jogo) {
    const bateBusca = normalizar(jogo.titulo).includes(termo);
    const batePlataforma = filtroPlataforma.value === "" || jogo.plataforma === filtroPlataforma.value;
    const bateGenero = filtroGenero.value === "" || jogo.genero === filtroGenero.value;
    const bateStatus = filtroStatus.value === "" || jogo.status === filtroStatus.value;
    return bateBusca && batePlataforma && bateGenero && bateStatus;
  });

  const [campo, direcao] = campoOrdenar.value.split("-");

  lista.sort(function (a, b) {
    let resultado = 0;

    if (campo === "titulo") {
      resultado = a.titulo.localeCompare(b.titulo, "pt-BR");
    } else if (campo === "ano") {
      resultado = a.ano - b.ano;
    } else if (campo === "nota") {
      const notaA = a.nota === null ? -1 : a.nota;
      const notaB = b.nota === null ? -1 : b.nota;
      resultado = notaA - notaB;
    }

    return direcao === "asc" ? resultado : -resultado;
  });

  return lista;
}
function renderizarLista() {
  const lista = obterJogosVisiveis();
  corpoLista.replaceChildren();

  if (lista.length === 0) {
      corpoLista.append(criar("li", "Nenhum jogo encontrado. Tente mudar os filtros ou cadastre um novo jogo.", { class: "vazio" }));
  } else {
    for (const jogo of lista) {
      corpoLista.append(criarCartao(jogo));
    }
  }
  
  contagem.textContent = `Exibindo ${lista.length} de ${jogos.length} jogo(s).`;
}

// ===== Detalhes =====
const painelDetalhe = document.getElementById("detalhe-conteudo");
let jogoSelecionadoId = null;

function marcarSelecionado() {
  for (const cartao of corpoLista.children) {
    cartao.classList.toggle("selecionado", Number(cartao.dataset.id) === jogoSelecionadoId);
  }
}

function mostrarDetalheVazio() {
  jogoSelecionadoId = null;
  marcarSelecionado();
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
  marcarSelecionado();

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

  // Em telas pequenas o painel fica abaixo da lista, então rola até ele
  if (window.matchMedia("(max-width: 960px)").matches) {
    painelDetalhe.scrollIntoView({ behavior: "smooth", block: "start" });
  }
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
  } else if (alvo.dataset.acao === "excluir") {
    excluirJogo(id);
  }
}

corpoLista.addEventListener("click", tratarCliqueAcoes);
painelDetalhe.addEventListener("click", tratarCliqueAcoes);

// ===== Exclusão e mensagens =====
const feedback = document.getElementById("feedback");
let temporizadorFeedback = null;

function mostrarFeedback(texto) {
  feedback.textContent = texto;
  feedback.hidden = false;

  clearTimeout(temporizadorFeedback);
  temporizadorFeedback = setTimeout(function () {
    feedback.hidden = true;
  }, 4000);
}

function excluirJogo(id) {
  const jogo = jogos.find(function (item) {
    return item.id === id;
  });

  if (!jogo || !confirm(`Excluir "${jogo.titulo}" da coleção?`)) {
    return;
  }

  jogos = jogos.filter(function (item) {
    return item.id !== id;
  });
  salvarJogos(jogos);

  if (jogoSelecionadoId === id) {
    mostrarDetalheVazio();
  }

  renderizarLista();
  mostrarFeedback(`"${jogo.titulo}" foi excluído da coleção.`);
}

// Depois de editar, a página de cadastro volta para cá com ?msg=editado
function mostrarMensagemDaUrl() {
  const parametros = new URLSearchParams(window.location.search);

  if (parametros.get("msg") === "editado") {
    mostrarFeedback("Jogo atualizado com sucesso!");
    history.replaceState(null, "", window.location.pathname);
  }
}

// ===== Pesquisa, filtros e ordenação =====
const formPesquisa = document.getElementById("form-pesquisa");
const campoBusca = document.getElementById("busca");
const filtroPlataforma = document.getElementById("filtro-plataforma");
const filtroGenero = document.getElementById("filtro-genero");
const filtroStatus = document.getElementById("filtro-status");
const campoOrdenar = document.getElementById("ordenar");

// Atualiza a lista enquanto o usuário digita ou muda um campo
formPesquisa.addEventListener("input", renderizarLista);

formPesquisa.addEventListener("submit", function (evento) {
  evento.preventDefault();
  renderizarLista();
});

// O reset limpa os campos depois do evento, por isso o setTimeout
formPesquisa.addEventListener("reset", function () {
  setTimeout(renderizarLista, 0);
});

// ===== Inicialização =====
renderizarLista();
mostrarDetalheVazio();
mostrarMensagemDaUrl();
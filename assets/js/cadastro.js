// GameShelf | página de cadastro, edição e busca na API

// ===== Estado e elementos =====
let jogos = carregarJogos();
let jogoEmEdicao = null;

const formulario = document.getElementById("form-jogo");
const caixaMensagem = document.getElementById("mensagem");

// ===== Mensagens =====
function mostrarMensagem(tipo, conteudo) {
  caixaMensagem.className = "mensagem " + tipo;
  caixaMensagem.textContent = Array.isArray(conteudo) ? "Corrija os seguintes campos:" : conteudo;

  if (Array.isArray(conteudo)) {
    const lista = criar("ul");
    for (const texto of conteudo) {
      lista.append(criar("li", texto));
    }
    caixaMensagem.append(lista);
  }

  caixaMensagem.hidden = false;
  caixaMensagem.scrollIntoView({ behavior: "smooth", block: "center" });
}

function limparErros() {
  caixaMensagem.hidden = true;
  for (const campo of formulario.querySelectorAll("[aria-invalid]")) {
    campo.removeAttribute("aria-invalid");
  }
}

// ===== Leitura e validação =====
function lerFormulario() {
  const dados = new FormData(formulario);
  const nota = String(dados.get("nota")).trim();

  return {
    titulo: String(dados.get("titulo")).trim(),
    plataforma: dados.get("plataforma"),
    genero: dados.get("genero"),
    ano: Number(dados.get("ano")),
    desenvolvedora: String(dados.get("desenvolvedora")).trim(),
    status: dados.get("status") || "",
    nota: nota === "" ? null : Number(nota),
    descricao: String(dados.get("descricao")).trim(),
    capa: String(dados.get("capa")).trim()
  };
}

function urlValida(texto) {
  try {
    const url = new URL(texto);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (erro) {
    return false;
  }
}

// Retorna uma lista de erros: cada um diz qual campo tem problema
function validarJogo(dados, idAtual) {
  const erros = [];
  const anoMaximo = new Date().getFullYear() + 3;

  if (dados.titulo.length < 2) {
    erros.push({ campo: "titulo", mensagem: "Informe o título (mínimo de 2 caracteres)." });
  }
  if (dados.plataforma === "") {
    erros.push({ campo: "plataforma", mensagem: "Selecione a plataforma." });
  }
  if (dados.genero === "") {
    erros.push({ campo: "genero", mensagem: "Selecione o gênero." });
  }
  if (!Number.isInteger(dados.ano) || dados.ano < 1970 || dados.ano > anoMaximo) {
    erros.push({ campo: "ano", mensagem: `Informe um ano de lançamento entre 1970 e ${anoMaximo}.` });
  }
  if (dados.status === "") {
    erros.push({ campo: "status-quero", mensagem: "Escolha o status do jogo." });
  }
  if (dados.nota !== null && (Number.isNaN(dados.nota) || dados.nota < 0 || dados.nota > 10)) {
    erros.push({ campo: "nota", mensagem: "A nota deve estar entre 0 e 10." });
  }
  // Capas dos jogos de exemplo são arquivos locais (assets/img/...)
  if (dados.capa !== "" && !dados.capa.startsWith("assets/img/") && !urlValida(dados.capa)) {
    erros.push({ campo: "capa", mensagem: "A URL da capa é inválida (use http:// ou https://)." });
  }

  const repetido = jogos.some(function (jogo) {
    return jogo.id !== idAtual
      && normalizar(jogo.titulo) === normalizar(dados.titulo)
      && jogo.plataforma === dados.plataforma;
  });
  if (repetido) {
    erros.push({ campo: "titulo", mensagem: "Este jogo já está cadastrado para essa plataforma." });
  }

  return erros;
}

function mostrarErros(erros) {
  for (const erro of erros) {
    document.getElementById(erro.campo).setAttribute("aria-invalid", "true");
  }
  mostrarMensagem("erro", erros.map(function (erro) {
    return erro.mensagem;
  }));
  document.getElementById(erros[0].campo).focus();
}

// ===== Cadastro =====
function cadastrarJogo(dados) {
  const novoJogo = { id: gerarId(), ...dados };
  jogos.push(novoJogo);
  salvarJogos(jogos);

  formulario.reset();
  mostrarMensagem("sucesso", `"${novoJogo.titulo}" foi adicionado à sua coleção!`);
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  limparErros();

  const dados = lerFormulario();
  const idAtual = jogoEmEdicao ? jogoEmEdicao.id : null;
  const erros = validarJogo(dados, idAtual);

  if (erros.length > 0) {
    mostrarErros(erros);
    return;
  }

  if (jogoEmEdicao) {
    atualizarJogo(dados);
  } else {
    cadastrarJogo(dados);
  }
});

formulario.addEventListener("reset", limparErros);

// ===== Edição =====
// Coloca os dados de um jogo nos campos do formulário
function preencherFormulario(jogo) {
  formulario.elements["titulo"].value = jogo.titulo || "";
  formulario.elements["plataforma"].value = jogo.plataforma || "";
  formulario.elements["genero"].value = jogo.genero || "";
  formulario.elements["ano"].value = jogo.ano || "";
  formulario.elements["desenvolvedora"].value = jogo.desenvolvedora || "";
  formulario.elements["nota"].value = jogo.nota === null || jogo.nota === undefined ? "" : jogo.nota;
  formulario.elements["descricao"].value = jogo.descricao || "";
  formulario.elements["capa"].value = jogo.capa || "";

  if (jogo.status) {
    formulario.elements["status"].value = jogo.status;
  }
}

function atualizarJogo(dados) {
  const posicao = jogos.findIndex(function (jogo) {
    return jogo.id === jogoEmEdicao.id;
  });

  jogos[posicao] = { ...jogoEmEdicao, ...dados };
  salvarJogos(jogos);

  window.location.href = "../index.html?msg=editado";
}

// Se a URL tiver ?id=123, o formulário entra em modo de edição
function iniciarModoEdicao() {
  const parametros = new URLSearchParams(window.location.search);
  if (!parametros.has("id")) {
    return;
  }

  const id = Number(parametros.get("id"));
  jogoEmEdicao = jogos.find(function (jogo) {
    return jogo.id === id;
  }) || null;

  if (jogoEmEdicao === null) {
    mostrarMensagem("erro", "Jogo não encontrado. Você pode cadastrá-lo como um novo jogo.");
    return;
  }

  document.title = "GameShelf | Editar jogo";
  document.getElementById("titulo-cadastro").textContent = "Editar jogo";
  formulario.querySelector('button[type="submit"]').textContent = "Salvar alterações";
  preencherFormulario(jogoEmEdicao);
}

iniciarModoEdicao();

// ===== Busca na API (CheapShark) =====
const formularioApi = document.getElementById("form-api");
const campoTermoApi = document.getElementById("busca-api-termo");
const statusApi = document.getElementById("status-api");
const listaResultados = document.getElementById("resultados-api");
let resultadosApi = [];

function mostrarStatusApi(tipo, texto) {
  statusApi.className = "mensagem " + tipo;
  statusApi.textContent = texto;
  statusApi.hidden = false;
}

function criarCartaoResultado(jogo) {
  const cartao = criar("li");
  cartao.append(
    criarImagem(obterCapaApi(jogo), "Capa de " + jogo.external, 220),
    criar("h3", jogo.external),
    criar("p", "Menor preço atual: US$ " + jogo.cheapest),
    criar("button", "Usar este jogo", { type: "button", "data-id": jogo.gameID })
  );
  return cartao;
}

function mostrarResultadosApi() {
  listaResultados.replaceChildren();

  if (resultadosApi.length === 0) {
    mostrarStatusApi("info", "Nenhum jogo encontrado para essa pesquisa.");
    return;
  }

  mostrarStatusApi("info", `${resultadosApi.length} resultado(s). Escolha um para preencher o formulário.`);
  for (const jogo of resultadosApi) {
    listaResultados.append(criarCartaoResultado(jogo));
  }
}

formularioApi.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  const termo = campoTermoApi.value.trim();

  if (termo.length < 2) {
    mostrarStatusApi("erro", "Digite pelo menos 2 caracteres para pesquisar.");
    return;
  }

  mostrarStatusApi("info", "Buscando...");
  listaResultados.replaceChildren();

  try {
    resultadosApi = await buscarJogosApi(termo);
    mostrarResultadosApi();
  } catch (erro) {
    if (erro instanceof TypeError) {
      mostrarStatusApi("erro", "Não foi possível conectar à API. Verifique sua internet.");
    } else {
      mostrarStatusApi("erro", erro.message);
    }
  }
});

// Ao escolher um resultado, preenche o formulário com os dados da API
listaResultados.addEventListener("click", function (evento) {
  const botao = evento.target.closest("button[data-id]");
  if (!botao) {
    return;
  }

  const jogo = resultadosApi.find(function (item) {
    return item.gameID === botao.dataset.id;
  });

  limparErros();
  preencherFormulario(converterJogoApi(jogo));
  mostrarStatusApi("sucesso", "Dados importados! Escolha o gênero, o ano e o status, confira os campos e salve.");
  formulario.scrollIntoView({ behavior: "smooth" });
});
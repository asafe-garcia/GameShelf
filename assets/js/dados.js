// GameShelf | dados, localStorage e funções auxiliares

// ===== Constantes =====
const CHAVE_STORAGE = "gameshelf:jogos";

// Em pages/cadastro.html o body tem data-raiz="../" para os caminhos funcionarem
const RAIZ = document.body.dataset.raiz || "";

const NOMES = {
  plataforma: {
    pc: "PC",
    ps5: "PlayStation 5",
    xbox: "Xbox Series X/S",
    switch: "Nintendo Switch"
  },
  genero: {
    acao: "Ação",
    aventura: "Aventura",
    rpg: "RPG",
    estrategia: "Estratégia",
    plataforma: "Plataforma",
    outro: "Outro"
  },
  status: {
    "quero-jogar": "Quero jogar",
    jogando: "Jogando",
    concluido: "Concluído",
    abandonado: "Abandonado"
  }
};

// Jogos que aparecem na primeira vez que o sistema é aberto
const JOGOS_INICIAIS = [
  {
    id: 1,
    titulo: "Hollow Knight",
    plataforma: "pc",
    genero: "aventura",
    ano: 2017,
    desenvolvedora: "Team Cherry",
    status: "concluido",
    nota: 9.5,
    descricao: "Aventura de ação em um vasto reino subterrâneo de insetos, com exploração e combate desafiador.",
    capa: "assets/img/hollow.jpg"
  },
  {
    id: 2,
    titulo: "The Witcher 3: Wild Hunt",
    plataforma: "ps5",
    genero: "rpg",
    ano: 2015,
    desenvolvedora: "CD Projekt RED",
    status: "jogando",
    nota: 10,
    descricao: "RPG de mundo aberto em que o bruxo Geralt de Rívia procura sua filha adotiva.",
    capa: "assets/img/TW3_Wild_Hunt.png"
  },
  {
    id: 3,
    titulo: "Celeste",
    plataforma: "switch",
    genero: "plataforma",
    ano: 2018,
    desenvolvedora: "Maddy Makes Games",
    status: "concluido",
    nota: 9,
    descricao: "Plataforma desafiador sobre a escalada de uma montanha e a superação de ansiedade.",
    capa: "assets/img/Celeste_box_art_cropped.png"
  },
  {
    id: 4,
    titulo: "Age of Empires IV",
    plataforma: "pc",
    genero: "estrategia",
    ano: 2021,
    desenvolvedora: "Relic Entertainment",
    status: "quero-jogar",
    nota: null,
    descricao: "Estratégia em tempo real com civilizações e batalhas inspiradas em eventos históricos.",
    capa: "assets/img/Capa_do_jogo_Age_of_Empires_IV.jpg"
  }
];

// ===== localStorage =====
function salvarJogos(jogos) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(jogos));
}

function carregarJogos() {
  const texto = localStorage.getItem(CHAVE_STORAGE);

  // Primeiro acesso: grava os jogos de exemplo
  if (texto === null) {
    salvarJogos(JOGOS_INICIAIS);
    return [...JOGOS_INICIAIS];
  }

  try {
    const jogos = JSON.parse(texto);
    return Array.isArray(jogos) ? jogos : [];
  } catch (erro) {
    return [];
  }
}

function gerarId() {
  return Date.now();
}

// ===== Funções auxiliares =====
function nomeDe(tipo, valor) {
  return NOMES[tipo][valor] || valor || "—";
}

// Remove acentos e maiúsculas para comparar textos
function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function criar(tag, texto, atributos) {
  const elemento = document.createElement(tag);
  if (texto !== undefined && texto !== null) {
    elemento.textContent = texto;
  }
  for (const nome in atributos) {
    elemento.setAttribute(nome, atributos[nome]);
  }
  return elemento;
}

function caminhoCapa(capa) {
  if (capa.startsWith("http")) {
    return capa;
  }
  return RAIZ + capa;
}

function criarImagem(capa, alt, largura) {
  const placeholder = RAIZ + "assets/img/capa-placeholder.svg";
  const imagem = criar("img", null, { alt: alt, width: largura });

  // Se a imagem não carregar, mostra a imagem padrão
  imagem.addEventListener("error", function () {
    imagem.src = placeholder;
  }, { once: true });

  imagem.src = capa ? caminhoCapa(capa) : placeholder;
  return imagem;
}
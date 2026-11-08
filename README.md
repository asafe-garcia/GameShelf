# GameShelf

Sistema web para organizar uma coleção de jogos: cadastrar, consultar, editar e organizar títulos que você possui ou deseja jogar.

## Funcionalidades
- Cadastro, edição e exclusão de jogos com validação e mensagens de feedback
- Listagem e detalhes gerados dinamicamente com JavaScript
- Pesquisa por título, filtros (plataforma, gênero e status) e ordenação
- Persistência dos dados com `localStorage`
- Busca de jogos na [CheapShark API](https://apidocs.cheapshark.com) (API pública, sem chave) para preencher o cadastro automaticamente

## Entidade principal
Jogo: título, plataforma, gênero, ano de lançamento, desenvolvedora, status, nota, descrição e capa.

## Etapas
- Etapa 1: HTML e estrutura da interface
- Etapa 2: CSS, layout e responsividade
- Etapa 3: JavaScript, dados e interatividade
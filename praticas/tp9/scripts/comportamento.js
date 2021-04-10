// Lucas Pinto, 56926, TP23
/* ------------------------------------------------------------------------- */
/* Introdução às Tecnologias Web - Departamento de Informática - FCUL.       */
/* Exercícios da aula teórico-prática sobre formulários.                     */
/* ------------------------------------------------------------------------- */

// Impede alguns erros fáceis de cometer.
"use strict";

/* ------------------------------------------------------------------------- */
/*                                                                CONSTANTES */
/* ------------------------------------------------------------------------- */

/** Identificador do formulário para fazer uma encomenda de piza. */
const FORMULARIO_ENCOMENDA = "frmEncomenda";

/** Identificador do botão para fazer uma encomenda. */
const BOTAO_FAZER_ENCOMENDA = "btnFazerEncomenda";

/** Identificador do botão para apagar o histórico de encomendas. */
// Exercício: Colocar aqui o código em falta.
const BOTAO_APAGAR_ENCOMENDAS = 'btnApagarEncomendas'

/** Identificador da tabela com o histórico de encomendas. */
const TABELA_ENCOMENDAS = "tblEncomendas";

/* ------------------------------------------------------------------------- */

/** Campo do formulário com a quantidade de pizas. */
// Exercício: Colocar aqui o código em falta.
const QUANTIDADE_PIZAS = 'quantidade'

/** Campo do formulário com o tamanho da piza. */
const TAMANHO_PIZA = "tamanho";

/** Campo do formulário com o tipo de massa da piza. */
const MASSA_PIZA = "massa";

/** Campo do formulário com um ingrediente da piza. */
const INGREDIENTE_PIZA = "ingrediente";

/* ------------------------------------------------------------------------- */

/** Campo do formulário com o nome do cliente. */
const NOME_CLIENTE = "nome";

/** Campo do formulário com a morada do cliente. */
// Exercício: Colocar aqui o código em falta.
const MORADA_CLIENTE = 'morada'

/** Campo do formulário com a data de nascimento do cliente. */
// Exercício: Colocar aqui o código em falta.
const NASCIMENTO_CLIENTE = 'dataNascimento'

/* ------------------------------------------------------------------------- */

/** Item de local storage que guarda o histório de encomendas. */
const ITEM_ENCOMENDAS = "encomendas";

/* ------------------------------------------------------------------------- */
/*                                                         VARIÁVEIS GLOBAIS */
/* ------------------------------------------------------------------------- */

/**
 * Elemento de topo do formulário para fazer encomendas, para simplificar o
 * acesso aos dados dos seus campos. Esta variável global só pode inicializada
 * quando o documento HTML tiver sido completamente carregado pelo browser.
*/
let formulario = null;

/* ------------------------------------------------------------------------- */

/**
 * Guarda o histórico de encomendas. Cada elemento do array deve ser um objeto
 * de tipo Encomenda.
 */
let encomendas = [];

/* ------------------------------------------------------------------------- */
/*                                                   CONSTRUTORES DE OBJETOS */
/* ------------------------------------------------------------------------- */

/**
 * Construtor de um objeto de tipo Piza. Cada piza tem um tamanho (ex. média
 * ou grande), um tipo de massa (ex. alta e fofa ou fina e crocante), e uma
 * série de ingredientes (ex. ananás, azeitonas, camarão, …).
 * 
 * @param {string} tamanho - Tamanho da piza.
 * @param {string} massa - Tipo de massa da piza.
 * @param {string[]} ingredientes - Ingredientes da piza.
 */
function Piza(tamanho, massa, ingredientes) {

  this.tamanho = tamanho;
  this.massa = massa;
  this.ingredientes = ingredientes;
}

/* ------------------------------------------------------------------------- */

/**
 * Construtor de um objeto de tipo Cliente. Cada cliente tem um nome.
 * 
 * @param {string} nome - Nome do cliente.
 * @param {string} morada - Morada do cliente.
 * @param {string} dataNascimento - Data de nascimento do cliente.
 */
function Cliente(nome, morada, dataNascimento) {

  this.nome = nome;

  // Exercício: Completar o código deste construtor (e sua documentação).
  this.morada = morada

  this.dataNascimento = dataNascimento
}

/* ------------------------------------------------------------------------- */

/**
 * Construtor de um objeto de tipo Encomenda. Cada encomenda tem os detalhes
 * de uma piza e um cliente.
 *
 * @param {Piza} piza - Objeto com os dados da piza.
 * @param {Cliente} cliente - Objeto com os dados do cliente.
 * @param {number} quantidade - Quantidade de pizzas.
 */
function Encomenda(piza, cliente, quantidade) {

  this.piza = piza;
  this.cliente = cliente;

  // Exercício: Completar o código deste construtor (e sua documentação).
  this.quantidade = quantidade
}

/* ------------------------------------------------------------------------- */
/*                                                INICIALIZAÇÃO DA APLICAÇÃO */
/* ------------------------------------------------------------------------- */

// A função principal() é automaticamente invocada quando o documento HTML
// tiver sido completamente carregado pelo browser, incluindo o ficheiro CSS.
// Uma vantagem de usar addEventListener() em vez de window.onload é serem
// permitidos vários event handlers (funções invocadas) para um mesmo evento.
window.addEventListener("load", principal);

/* ------------------------------------------------------------------------- */

/**
 * Primeira função a ser executada após o browser completar o carregamento
 * de toda a informação presente no documento HTML.
 */
function principal() {

  // Para simplificar o acesso aos elementos do formulário de encomendar piza.
  formulario = document.forms[FORMULARIO_ENCOMENDA];

  // Carrega o histórico de encomendas a partir do local storage do browser.
  carregaHistoricoEncomendas();
  mostraHistoricoEncomendas();

  // Associar comportamento a elementos na página HTML.
  defineEventHandlersParaElementosHTML();
}

/* ------------------------------------------------------------------------- */
/*                                            REAÇÃO A EVENTOS DO UTILIZADOR */
/* ------------------------------------------------------------------------- */

/**
 * Associa event handlers a elementos no documento HTML, em particular botões.
 * Com esta abordagem, evitam-se atributos onclick ou similares, e faz-se uma
 * melhor separação entre conteúdo, em HTML, e comportamento, em JavaScript.
 */
function defineEventHandlersParaElementosHTML() {

  document.getElementById(BOTAO_FAZER_ENCOMENDA).
    addEventListener("click", trataFazerEncomenda);

  // Exercício: Colocar aqui o código em falta.
  document.getElementById(BOTAO_APAGAR_ENCOMENDAS)
    .addEventListener('click', trataApagarHistoricoEncomendas)
}

/* ------------------------------------------------------------------------- */

/**
 * Trata os dados de uma encomenda de piza, provenientes do formulário HTML.
 */
function trataFazerEncomenda() {

  // Verifica se os valores nos campos do formulário satisfazem as restrições
  // especificadas em HTML, como o campo ter de estar preenchido (required),
  // ou o valor no campo ter de estar entre um mínimo e um máximo (min, max).
  // Se houver restrições não satisfeitas, o utilizador é informado, e a
  // encomenda não é processada.
  let encomendaValida = formulario.reportValidity();

  // Se o formulário estiver bem preenchido, guarda os dados da encomenda.
  let encomenda = null;

  if (encomendaValida) {
    // Exercício: Rever a instrução seguinte.
    encomenda = new Encomenda(obtemDadosPiza()
      , obtemDadosCliente()
      , obtemQuantidadePizas());

    // Grava a encomenda no histórico de encomendas e mostra-a.
    gravaEncomendaNoHistorico(encomenda);
    mostraHistoricoEncomendas();

    // Repõe os valores iniciais dos campos do formulário, para permitir uma
    // nova encomenda.
    formulario.reset();
  }
}

/* ------------------------------------------------------------------------- */

/**
 * Apaga o histórico de encomendas, incluindo no local storage do browser.
 */
function trataApagarHistoricoEncomendas() {

  // Exercício: Colocar aqui o código em falta.
  localStorage.removeItem(ITEM_ENCOMENDAS)
  encomendas = []

  // Confirmação visual do histórico ter sido apagado.
  mostraHistoricoEncomendas();
}

/* ------------------------------------------------------------------------- */
/*                                           OBTENÇÃO DE DADOS DO FORMULÁRIO */
/* ------------------------------------------------------------------------- */

/**
 * Obtém os dados do cliente que constam no formulário da encomenda.
 * 
 * @returns {Cliente} Objeto com os dados do cliente.
 */
function obtemDadosCliente() {

  // Os campos dos dados do cliente são todos de texto. Basta aceder à
  // propriedade value para obter o respetivo valor.
  // Exercício: Rever a instrução seguinte.
  return new Cliente(formulario.elements[NOME_CLIENTE].value
    , formulario.elements[MORADA_CLIENTE].value
    , formulario.elements[NASCIMENTO_CLIENTE].value);
}

/* ------------------------------------------------------------------------- */

/**
 * Obtém os dados da piza que constam no formulário da encomenda.
 * 
 * @returns {Piza} Objeto com os dados da piza.
 */
function obtemDadosPiza() {

  let tamanho = formulario.elements[TAMANHO_PIZA].value;
  let massa = formulario.elements[MASSA_PIZA].value;
  let ingredientes = [];

  // Considera os ingredientes selecionados.
  for (let ingrediente of formulario.elements[INGREDIENTE_PIZA]) {
    if (ingrediente.checked) {
      ingredientes.push(ingrediente.value);
    }
  }

  return new Piza(tamanho, massa, ingredientes);
}

/* ------------------------------------------------------------------------- */

/**
 * Obtém a quantidade de pizas que consta no formulário de encomenda.
 * 
 * @returns {number} Quantidade de pizas.
 */
function obtemQuantidadePizas() {

  // Exercício: Colocar aqui o código em falta.
  return parseInt(formulario.elements[QUANTIDADE_PIZAS].value) ?? 1
}

/* ------------------------------------------------------------------------- */
/*                                         GESTÃO DO HISTÓRICO DE ENCOMENDAS */
/* ------------------------------------------------------------------------- */

/**
 * Carrega o histórico de encomendas guardado no local storage do browser.
 */
function carregaHistoricoEncomendas() {

  // Converte o histórico de encomendas guardado em formato JSON (JavaScript
  // Object Notation) no local storage do browser, para um objeto em memória.
  encomendas = JSON.parse(localStorage.getItem(ITEM_ENCOMENDAS)) || [];

  // A parte "|| []" em cima serve para garantir que o histórico de encomendas
  // em memória existe (como array), pois pode dar-se o caso de JSON.parse()
  // devolver null se for a primeira vez que executamos a aplicação.
}

/* ------------------------------------------------------------------------- */

/**
 * Grava o histórico de encomendas no local storage do browser.
 */
function gravaHistoricoEncomendas() {

  // Converte o objeto que representa o histórico de encomendas para texto em
  // formato JSON (JavaScript Object Notation), e guardado-o em local storage
  // do browser.
  localStorage.setItem(ITEM_ENCOMENDAS, JSON.stringify(encomendas));
}

/* ------------------------------------------------------------------------- */

/** 
 * Grava a encomenda no histórico de encomendas.
 * 
 * @param {Encomenda} encomenda - Objeto com os dados da encomenda.
 */
function gravaEncomendaNoHistorico(encomenda) {

  // Coloca a encomenda no histórico e guarda-o no local storage do browser.
  encomendas.push(encomenda);
  gravaHistoricoEncomendas();
}

/* ------------------------------------------------------------------------- */

/**
 * Mostra uma tabela com o histórico de encomendas.
 */
function mostraHistoricoEncomendas() {

  let tabelaAntiga = document.getElementById(TABELA_ENCOMENDAS);

  // A nova tabela de histórico de encomendas tem o mesmo identificador da
  // antiga, pois irá substituí-la na íntegra.
  let tabelaNova = document.createElement("table");
  tabelaNova.setAttribute("id", TABELA_ENCOMENDAS);

  // Exercício: Rever o cabeçalho e linhas de dados da tabela.

  // Linha de cabeçalho da tabela.
  let linhaTabela = document.createElement("tr");
  linhaTabela.innerHTML = "<th>#</th>" +
                          "<th>Nome</th>" +
                          "<th>Morada</th>" +
                          "<th>Nascimento</th>" +
                          "<th>Quantidade</th>" +
                          "<th>Tamanho</th>" +
                          "<th>Massa</th>" +
                          "<th>Ingredientes</th>";
  tabelaNova.appendChild(linhaTabela);

  let numeroEncomenda = 1;
  for (let encomenda of encomendas) {

    // Uma linha de dados por cada encomenda no histórico.
    linhaTabela = document.createElement("tr");
    linhaTabela.innerHTML = "<td>" + numeroEncomenda + "</td>" +
                            "<td>" + encomenda.cliente.nome + "</td>" +
                            "<td>" + encomenda.cliente.morada + "</td>" +
                            "<td>" + encomenda.cliente.dataNascimento + "</td>" +
                            "<td>" + encomenda.quantidade + "</td>" +
                            "<td>" + encomenda.piza.tamanho + "</td>" +
                            "<td>" + encomenda.piza.massa + "</td>" +
                            "<td>" + encomenda.piza.ingredientes + "</td>";
    tabelaNova.appendChild(linhaTabela);
    numeroEncomenda++;
  }

  // Substitui a tabela antiga pela nova.
  tabelaAntiga.parentNode.replaceChild(tabelaNova, tabelaAntiga);
}

/* ------------------------------------------------------------------------- */

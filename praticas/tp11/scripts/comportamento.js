// Lucas Pinto, 56926, TP23
// require('@types/jquery')
/* ------------------------------------------------------------------------- */
/* Introdução às Tecnologias Web - Departamento de Informática - FCUL.       */
/* Exercício da aula teórico-prática sobre jQuery (parte 1).                   */
/* ------------------------------------------------------------------------- */

// Impede alguns erros fáceis de cometer.
"use strict";

/* ------------------------------------------------------------------------- */
/*                                                                CONSTANTES */
/* ------------------------------------------------------------------------- */

/** Identificador da secção HTML da música escolhida. */
const SECCAO_MUSICA_ESCOLHIDA = "secMusicaEscolhida";

/** Identificador da secção HTML dos tops semanais. */
const SECCAO_TOPS_SEMANAIS = "secTopsSemanais";

/** Identificador da secção HTML de todas as músicas. */
const SECCAO_TODAS_MUSICAS = "secTodasMusicas";

/** Identificador do parágrafo HTML da música escolhida. */
const PARAGRAFO_MUSICA_ESCOLHIDA = "pMusicaEscolhida";

const CAMPO_FILTRO_MUSICAS = 'inFiltroMusicas'

/* ------------------------------------------------------------------------- */

/** Classe HTML para indicar que a música escolhida não está a tocar. */
const CLASSE_PAUSA = "pausa";

/** Classe HTML para indicar que a música escolhida está a tocar. */
const CLASSE_TOCA = "toca";

/** Classe HTML para o título de uma música. */
const CLASSE_TITULO = "titulo";

/** Classe HTML para o artista de uma música. */
const CLASSE_ARTISTA = "artista";

/**
 * Classe HTML para um item completo de música, englobando o título e artista.
 * Facilita a seleção dos elementos HTML que representam músicas, nos quais se
 * pode fazer clique para escolher a música a tocar no leitor.
 */
const CLASSE_MUSICA = "musica";

/* ------------------------------------------------------------------------- */

/**
 * Dados de todas as músicas. Cada música deve ter um identificador unívoco,
 * compatível com os valores admissíveis no atributo id dos elementos HTML.
 * Por simplicidade, assume-se que cada identificador tem quatro letras.
 */
const MUSICAS = [
  //          id      titulo                    artista
  new Musica("abno", "The New Abnormal",       "The Strokes"),
  new Musica("anti", "Mais Antigo",            "Bispo"),
  new Musica("bolt", "Fetch The Bolt Cutters", "Fiona Apple"),
  new Musica("caja", "Cajarana",               "André Henriques"),
  new Musica("calm", "Calm",                   "5 Seconds Of Summer"),
  new Musica("giga", "Gigaton",                "Pearl Jam"),
  new Musica("hour", "After Hours",            "The Weeknd"),
  new Musica("huma", "Human II Nature",        "Nightwish"),
  new Musica("line", "Fine Lines",             "Harry Styles"),
  new Musica("memo", "Memorial",               "Moonspell"),
  new Musica("meto", "O Método",               "Rodrigo Leão"),
  new Musica("rush", "The Slow Rush",          "Tame Impala"),
  new Musica("soul", "Map Of Soul 7",          "BTS"),
  new Musica("yell", "Yellow",                 "Calema")
];

/* ------------------------------------------------------------------------- */

/**
 * Dados dos tops semanais. Cada top guarda as músicas mais populares durante
 * uma semana de um ano.
 */
const TOPS_SEMANAIS = [
  new TopSemanal(2020, 16, [obtemMusica("giga"),
                            obtemMusica("anti"),
                            obtemMusica("huma"),
                            obtemMusica("soul"),
                            obtemMusica("abno")]),
  new TopSemanal(2020, 17, [obtemMusica("giga"),
                            obtemMusica("abno"),
                            obtemMusica("soul"),
                            obtemMusica("memo"),
                            obtemMusica("anti")])
];

/* ------------------------------------------------------------------------- */
/*                                                         VARIÁVEIS GLOBAIS */
/* ------------------------------------------------------------------------- */

/** Variável global com o objeto Musica da música escolhida pelo utilizador. */
let musicaEscolhida = null;

/* ------------------------------------------------------------------------- */
/*                                                   CONSTRUTORES DE OBJETOS */
/* ------------------------------------------------------------------------- */

/**
 * Construtor de um objeto de tipo Musica. Cada música deve ter um
 * identificador unívoco (com quatro letras), um título, e um artista.
 * 
 * @param {string} id Identificador unívoco da música.
 * @param {string} titulo Título da música.
 * @param {string} artista Nome do intérprete ou banda musical.
 */
function Musica(id, titulo, artista) {

  this.id = id;
  this.titulo = titulo;
  this.artista = artista;
}

/* ------------------------------------------------------------------------- */

/**
 * Construtor de um objeto do tipo TopSemanal, contendo as músicas mais
 * populares numa dada semana de um ano.
 * 
 * @param {number} ano Ano do top.
 * @param {number} semana Semana do ano do top.
 * @param {Musica[]} musicas Músicas mais populares.
 */
function TopSemanal(ano, semana, musicas) {

  this.ano = ano;
  this.semana = semana;
  this.musicas = musicas;
}

/* ------------------------------------------------------------------------- */
/*                                                INICIALIZAÇÃO DA APLICAÇÃO */
/* ------------------------------------------------------------------------- */

// A função principal() deve ser automaticamente invocada quando o documento
// HTML tiver sido completamente carregado pelo browser.

// Exercício: Colocar aqui o código em falta usando jQuery.
$(document).ready(principal)

/* ------------------------------------------------------------------------- */

/**
 * Primeira função a ser executada após o browser completar o carregamento
 * de toda a informação presente no documento HTML.
 */
function principal() {

  // Mostra os tops semanais e todas as músicas existentes.
  desenhaInterfaceComUtilizador();

  // Qualquer música nas listas dos tops semanais ou na lista de todas as
  // músicas deve poder ser escolhida e começada a tocar no leitor fazendo
  // clique sobre o respetivo item da lista. O event handler deve ser a função
  // trataTocaMusica().

  // Exercício: Colocar aqui o código em falta usando jQuery.
  $('#secTopsSemanais li, #secTodasMusicas li').on('click', trataTocaMusica)

  // O leitor de música também deve reagir a cliques, alternando entre tocar
  // ou parar de tocar a música escolhida pelo utilizador.
  $("#" + PARAGRAFO_MUSICA_ESCOLHIDA).on("click", trataAlternaTocaMusica);

  $(`#${CAMPO_FILTRO_MUSICAS}`).on('keyup', trataFiltraMusicas)
}

/* ------------------------------------------------------------------------- */

/**
 * Obtém o objeto Musica da música com um dado identificador, caso exista. A
 * pesquisa pode ser feita num array específico de músicas ou nos dados de
 * todas as músicas.
 * 
 * @param {string} idMusica Identificador unívoco da música.
 * @param {Musica[]} [musicas] As músicas a pesquisar (opcional).
 * @returns {Musica} A música com o identificador indicado, ou undefined.
 */
function obtemMusica(idMusica, musicas = MUSICAS) {

  // Array.find() passa um elemento do array de cada vez à função indicada no
  // argumento. Se a função devolver true, a pesquisa para e é devolvido o 
  // respetivo elemento.
  return musicas.find( function(musica) { return musica.id == idMusica; } );
}

/* ------------------------------------------------------------------------- */
/*                                                INTERFACE COM O UTILIZADOR */
/* ------------------------------------------------------------------------- */

/**
 * Mostra a parte dinâmica da interface com o utilizador, nomeadamente a
 * música escolhida, os tops semanais, e a lista de todas as músicas.
 */
function desenhaInterfaceComUtilizador() {

  desenhaMusicaEscolhida();
  desenhaTopsSemanais();
  desenhaTodasMusicas();
}

/* ------------------------------------------------------------------------- */

/**
 * Mostra o título e artista da música escolhida pelo utilizador e atualiza
 * o estado do leitor de música (ex. a tocar).
 */
function desenhaMusicaEscolhida() {

  let $pMusicaEscolhida = $("#" + PARAGRAFO_MUSICA_ESCOLHIDA);

  if (!musicaEscolhida) {
    // Ainda nada para tocar.
    $pMusicaEscolhida.addClass(CLASSE_PAUSA)
                     .html("Nenhuma música escolhida");

  } else {
    // Atualiza os dados da música escolhida.
    $pMusicaEscolhida.html(musicaEmHTML(musicaEscolhida));
    
    // A música escolhida deve ficar a tocar.

    // Exercício: Colocar aqui o código em falta usando jQuery.
    $pMusicaEscolhida.addClass(CLASSE_TOCA)

  }
}

/* ------------------------------------------------------------------------- */

/**
 * Mostra os tops semanais ao utilizador, cada um com semana e ano, e a
 * respetiva lista de músicas.
 */
function desenhaTopsSemanais() {
  // Útil para mandar mostrar a lista de músicas de cada top semanal.
  let $elementoPai = $(`#${SECCAO_TOPS_SEMANAIS}`)

  // Usada dentro do ciclo for.
  let pTopSemanal = null
  for (let topSemanal of TOPS_SEMANAIS) {
    // Cada novo top semanal é mostrado num parágrafo.
    pTopSemanal = $('<p></p>')
    pTopSemanal.text(`Top da semana ${topSemanal.semana} do ano ${topSemanal.ano}`)

    $elementoPai.append(pTopSemanal)

    // Mostra a lista de músicas do top semanal atual.
    desenhaListaMusicas($elementoPai, topSemanal.musicas,
                        `semana${topSemanal.semana}de${topSemanal.ano}-`)
  }
}

/* ------------------------------------------------------------------------- */

/**
 * Mostra uma lista com todas as músicas ao utilizador.
 */
function desenhaTodasMusicas() {
  desenhaListaMusicas($(`#${SECCAO_TODAS_MUSICAS}`), MUSICAS)
}

/* ------------------------------------------------------------------------- */

/**
 * Adiciona uma lista de músicas no final do elemento pai (ex. uma <section>),
 * em que cada item da lista tem um atributo id cujo valor é derivado do
 * identificador da respetiva música, precedido do prefixo (opcional).
 * 
 * @param {JQuery<HTMLElement>} $elementoPai Elemento dentro do qual é mostrada a lista de
 *                              músicas.
 * @param {Musica[]} musicas Músicas a mostrar.
 * @param {string} [prefixo] Prefixo de cada identificador de item da lista
 *                           (opcional).
 */
function desenhaListaMusicas($elementoPai, musicas, prefixo = "") {
  // Elemento principal da lista.
  let olMusicas = $('<ol></ol>')

  // Usada dentro do ciclo for.
  let liMusica = null

  for (const musica of musicas) {
    // Cada item da lista guarda os dados de uma música.
    liMusica = $('<li></li>')
    liMusica.attr('id', prefixo + musica.id)
    liMusica.addClass(CLASSE_MUSICA)
    liMusica.html(`<p>${musicaEmHTML(musica)}</p>`)

    // A lista vai crescendo um item de cada vez.
    olMusicas.append(liMusica)
  }

  // Mostrar a lista ao utilizador.
  $elementoPai.append(olMusicas)
}

/* ------------------------------------------------------------------------- */

/**
 * @param {Musica} musica Uma música.
 * @returns {string} Representação HTML da música.
 */
function musicaEmHTML(musica) {

  let html = null;

  if (musica) {
    html = "<span class='" + CLASSE_TITULO + "'>" + musica.titulo + "</span>" +
           " " + "<span class='" + CLASSE_ARTISTA + "'>" + musica.artista +
           "</span>";
  } else {
    html = "Sem música";
  }

  return html;
}

/* ------------------------------------------------------------------------- */

/**
 * Põe a tocar a música onde o utilizador fez clique.
 */
function trataTocaMusica() {

  // Assume-se que o identificador da música corresponde às últimas quatro
  // letras do identificador do elemento li (em this) que contém os dados da
  // música onde o utilizador fez clique.
  let idMusicaEscolhida = this.id.substring(this.id.length - 4);

  musicaEscolhida = obtemMusica(idMusicaEscolhida);
  desenhaMusicaEscolhida();
}

/* ------------------------------------------------------------------------- */

/**
 * Se uma música previamente escolhida pelo utilizador estiver a tocar no
 * leitor, ativa a pausa, e vice-versa.
 */
function trataAlternaTocaMusica() {
  // Exercício: Colocar aqui o código em falta usando jQuery.
  if (!musicaEscolhida) return
  
  const $pMusicaEscolhida = $('#' + PARAGRAFO_MUSICA_ESCOLHIDA)
  $pMusicaEscolhida.toggleClass(CLASSE_TOCA)
}

/* ------------------------------------------------------------------------- */

function trataFiltraMusicas() {
  const filtro = $(`#${CAMPO_FILTRO_MUSICAS}`).val()
  const ps = $(`#${SECCAO_TODAS_MUSICAS} ol li p`)
  
  ps.each((_, p) => {
    let show = false
    for (const span of p.children) {
      if (span.innerText.toLowerCase().includes(filtro)) {
        show = true
        break;
      }
    }

    const e = $(p.parentElement)
    if (show) e.show(2000)
    else e.hide(2000)
  })
}
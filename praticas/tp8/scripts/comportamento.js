// Lucas Pinto, 56926, TP23

/* ------------------------------------------------------------------------- */
/* Introdução às Tecnologias Web - Departamento de Informática - FCUL.       */
/* Exercícios da aula teórico-prática sobre JavaScript (parte 2).            */
/* ------------------------------------------------------------------------- */

// Impede alguns erros fáceis de cometer.
"use strict";

/* ------------------------------------------------------------------------- */

/** Número de tentativas por omissão. */
const NUMERO_TENTATIVAS_OMISSAO = 10;

/** Valor aleatório mínimo por omissão. */
const MINIMO_ALEATORIO_OMISSAO = 1;

/** Valor aleatório máximo por omissão. */
const MAXIMO_ALEATORIO_OMISSAO = 100;

/** Duração máxima por omissão. */
const DURACAO_MAXIMA_OMISSAO = 60

/** Duração mínima. */
const DURACAO_MINIMA = 10

/* ------------------------------------------------------------------------- */

/** Célula que guarda o número de tentativas na tabela de configuração. */
const TD_NUMERO_TENTATIVAS = "tdNumeroTentativas";

/** Célula que guarda o valor aleatório mínimo na tabela de configuração. */
const TD_MINIMO_ALEATORIO = "tdMinimoAleatorio";

/** Célula que guarda o valor aleatório máximo na tabela de configuração. */
const TD_MAXIMO_ALEATORIO = "tdMaximoAleatorio";

/** Célula que guarda o valor da duração máxima na tabela de configuração. */
const TD_DURACAO_MAXIMA = 'tdDuracaoMaxima'

/* ------------------------------------------------------------------------- */

/** Identificador do botão para mudar o número de tentativas. */
const BOTAO_NUMERO_TENTATIVAS = "botaoPedeNumeroTentativas";

/** Identificador do botão para mudar o valor aleatório mínimo. */
const BOTAO_MINIMO_ALEATORIO = "botaoPedeMinimoAleatorio";

/** Identificador do botão para mudar o valor aleatório máximo. */
const BOTAO_MAXIMO_ALEATORIO = "botaoPedeMaximoAleatorio";

/** Identificador do botão para iniciar um jogo. */
const BOTAO_INICIA_JOGO = "botaoIniciaJogo";

/** Identificador do botão de fazer uma nova tentativa. */
const BOTAO_FAZ_TENTATIVA = "botaoFazTentativa";

/** Identificador do botão de cancelar um jogo. */
const BOTAO_CANCELA_JOGO = 'btnCancelaJogo'

/** Identificador span que mostra o tempo de jogo. */
const SPAN_TEMPO_RESTANTE = 'spanTempoRestante'

/** Identificador do botão de mudar o valor da duração máxima. */
const BOTAO_DURACAO_MAXIMA = 'btnPedeDuracaoMaxima'

/* ------------------------------------------------------------------------- */

/** Propósito de tentar adivinhar o número aleatório. */
const PROPOSITO_ADIVINHAR = "Para tentar adivinhar";

/** Propósito de configurar o número de tentativas do jogo. */
const PROPOSITO_NUMERO_TENTATIVAS = "Para configurar o número de tentativas";

/** Propósito de configurar o valor aleatório mínimo do jogo. */
const PROPOSITO_MINIMO_ALEATORIO = "Para configurar o valor aleatório mínimo";

/** Propósito de configurar o valor aleatório máximo do jogo. */
const PROPOSITO_MAXIMO_ALEATORIO = "Para configurar o valor aleatório máximo";

/** Propósito de configurar a duração máxima do jogo. */
const PROPOSITO_DURACAO_MAXIMA = 'Para configurar a duração máxima'

/* ------------------------------------------------------------------------- */

/** Acertou no número aleatório. */
const RESULTADO_ACERTOU = "Acertou!";

/** Valor da tentativa ficou abaixo do número aleatório. */
const RESULTADO_ABAIXO = "Demasiado baixo";

/** Valor da tentativa ficou acima do número aleatório. */
const RESULTADO_ACIMA = "Demasiado alto";

/** Cancelou o jogo */
const RESULTADO_CANCELOU = 'Jogo cancelado'

/** Tempo esgotado */
const RESULTADO_TEMPO_ESGOTADO = 'Tempo esgotado, jogo terminado.'

/* ------------------------------------------------------------------------- */

/** Configuração do jogo, que pode ser alterada pelo utilizador. */
let configuracao = {

  /** Número de tentativas para adivinhar o número aleatório. */
  numeroTentativas: NUMERO_TENTATIVAS_OMISSAO,

  /** Valor aleatório mínimo. */
  minimoAleatorio: MINIMO_ALEATORIO_OMISSAO,

  /** Valor aleatório máximo. */
  maximoAleatorio: MAXIMO_ALEATORIO_OMISSAO,

  /** Duração máxima. */
  duracaoMaxima: DURACAO_MAXIMA_OMISSAO  
}

/* ------------------------------------------------------------------------- */

/** Estado do jogo, que vai sendo preenchido no decorrer do jogo. */
let jogo = {

  /** Número aleatório gerado no início do jogo, baseado na configuração. */
  numeroAleatorio: null,

  /**
   * Array com todas as tentativas de adivinhar o número por parte do
   * utilizador. A última tentativa está no final do array.
   */
  tentativas: null,

  /**  Timestamp de início do jogo */
  inicio: null
};

/* ------------------------------------------------------------------------- */

/** Temporizador de tempo restante do jogo */
let temporizadorTempoRestante = null

/** Temporizador da duraçao máxima do jogo */
let temporizadorDuracaoMaxima = null

/* ------------------------------------------------------------------------- */

// A função principal() é automaticamente invocada quando o documento HTML
// tiver sido completamente carregado pelo browser.
window.onload = principal;

/* ------------------------------------------------------------------------- */

/**
 * Primeira função a ser executada após o browser completar o carregamento
 * de toda a informação presente no documento HTML. Ver window.onload na
 * última linha deste script.
 */
function principal() {

  // Mostra a configuração por omissão do jogo.
  mostraConfiguracaoJogo();

  // O jogo está pronto a usar.
  document.getElementById("mensagem").innerHTML =
    "Bem vindo ao jogo de adivinha o número!";
}

/* ------------------------------------------------------------------------- */

/**
 * Mostra a configuração atual do jogo no documento HTML, incluindo o número
 * de tentativas permitidas ao utilizador e o valor aleatório mínimo e máximo,
 * substituindo eventuais valores já existentes.
 */
function mostraConfiguracaoJogo() {

  document.getElementById(TD_NUMERO_TENTATIVAS).innerHTML =
    configuracao.numeroTentativas;
  document.getElementById(TD_MINIMO_ALEATORIO).innerHTML =
    configuracao.minimoAleatorio;
  // Exercício: Colocar aqui o código em falta.
  document.getElementById(TD_MAXIMO_ALEATORIO).innerHTML =
    configuracao.maximoAleatorio  
  document.getElementById(TD_DURACAO_MAXIMA).innerHTML =
    configuracao.duracaoMaxima
}

/* ------------------------------------------------------------------------- */

/**
 * Pede ao utilizador o número de tentativas para conseguir adivinhar o número
 * aleatório. O jogo termina se esse número de tentativas for atingido.
 */
function pedeNumeroTentativas() {

  configuracao.numeroTentativas =
    pedeNumeroInteiro(1, Infinity, PROPOSITO_NUMERO_TENTATIVAS);
  
  mostraConfiguracaoJogo();
}

/* ------------------------------------------------------------------------- */

/**
 * Pede ao utilizador o valor aleatório mínimo admissível no jogo, o qual tem
 * de ser inferior ou igual ao valor aleatório máximo em vigor.
 */
function pedeMinimoAleatorio() {
  // Exercício: Colocar aqui o código da função.
  configuracao.minimoAleatorio = pedeNumeroInteiro(Number.MIN_SAFE_INTEGER, configuracao.maximoAleatorio, PROPOSITO_MINIMO_ALEATORIO)
  mostraConfiguracaoJogo()  
}

/* ------------------------------------------------------------------------- */

/**
 * Pede ao utilizador o valor aleatório máximo admissível no jogo, o qual tem
 * de ser superior ou igual ao valor aleatório mínimo em vigor.
 */
function pedeMaximoAleatorio() {
  // Exercício: Colocar aqui o código da função.
  configuracao.maximoAleatorio = pedeNumeroInteiro(configuracao.minimoAleatorio, Number.MAX_SAFE_INTEGER, PROPOSITO_MAXIMO_ALEATORIO)
  mostraConfiguracaoJogo()    
}

/* ------------------------------------------------------------------------- */

/**
 * Pede ao utilizador a duração máxima do jogo, o qual tem de ser superior ou
 * igual ao DURACAO_MINIMA.
 */
function pedeDuracaoMaxima() {
  configuracao.duracaoMaxima = pedeNumeroInteiro(DURACAO_MINIMA, Number.MAX_SAFE_INTEGER, PROPOSITO_DURACAO_MAXIMA)
  mostraConfiguracaoJogo()
}

/* ------------------------------------------------------------------------- */

/**
 * Remove da tabela de tentativas do documento HTML as linhas com os dados de
 * tentativas anteriores, ficando apenas a linha de cabeçalho.
 */
function removeTentativasAnteriores() {

  // A função Document.querySelectorAll() retorna todos os elementos HTML que
  // satisfazem o seletor CSS indicado no argumento. Neste caso, são obtidos
  // todos os <tr>, exceto o primeiro (que é o da linha de cabeçalho da
  // tabela), dentro da secção de tentativas.
  let linhasTentativasAnteriores =
    document.querySelectorAll("section#tentativas tr + tr");

  // Para apagar as linhas das tentativas anteriores é necessário invocar
  // Node.removeChild() sobre o elemento pai dessas linhas, daí o recurso à
  // propriedade Node.parentNode.
  for (let linhaTentativaAnterior of linhasTentativasAnteriores) {
    linhaTentativaAnterior.parentNode.removeChild(linhaTentativaAnterior);
  }
}

/* ------------------------------------------------------------------------- */

/**
 * Acrescenta uma linha na tabela de tentativas do documento HTML, contendo o
 * número da tentativa que acabou de ser feita, o valor escolhido pelo
 * utilizador, e qual o resultado (igual, inferior, ou superior ao número
 * gerado aleatoriamente no início do jogo).
 * 
 * @param {num§ber} numeroTentativa O número da tentativa feita pelo utilizador.
 * @param {number} valorTentativa O valor escolhido pelo utilizador.
 * @param {string} resultadoTentativa O resultado da tentativa (ex. acertou).
 */
function mostraTentativaAtual(numeroTentativa, valorTentativa,
                              resultadoTentativa) {

  // Construção da nova linha a acrescentar à tabela de tentativas.
  let novaLinhaTentativa = document.createElement("tr");
  novaLinhaTentativa.innerHTML = "<td>" + numeroTentativa    + "</td>" +
                                 "<td>" + valorTentativa     + "</td>" +
                                 "<td>" + resultadoTentativa + "</td>";

  // A função Document.querySelector() retorna o primeiro elemento HTML que
  // satisfaz o seletor CSS no argumento. Neste caso, é selecionado o último
  // <tr> dentro da secção de tentativas, e a propriedade Node.parentNode
  // devolve o elemento pai desse <tr>. O elemento pai é necessário para se
  // poder invocar Node.appendChild(), que acrescenta a nova linha no final
  // da tabela de tentativas.
  document.querySelector("section#tentativas tr:last-of-type")
          .parentNode.appendChild(novaLinhaTentativa);
}

/* ------------------------------------------------------------------------- */

/** Mostra o tempo restante do jogo no span */
function mostraTempoRestante() {
  const diff = jogo.inicio + configuracao.duracaoMaxima - Math.floor(Date.now() / 1000)
  document.getElementById(SPAN_TEMPO_RESTANTE).innerText = diff
}

/* ------------------------------------------------------------------------- */

/**
 * Permite que o utilizador faça mais uma tentativa para adivinhar o número e,
 * se acertar ou tiver esgotado as tentativas, termina o jogo.
 */
function fazTentativa() {

  let valorTentativa = null;
  let resultadoTentativa = null;

  // Obtém e armazena o valor da próxima tentativa para adivinhar o número.
  valorTentativa = pedeNumeroInteiro(configuracao.minimoAleatorio,
                                     configuracao.maximoAleatorio,
                                     PROPOSITO_ADIVINHAR);

  jogo.tentativas.push(valorTentativa);

  // Constrói mensagem informativa para aparecer na tabela de tentativas.
  if (valorTentativa == jogo.numeroAleatorio) {
    resultadoTentativa = RESULTADO_ACERTOU;

  } else if (valorTentativa < jogo.numeroAleatorio) {
    resultadoTentativa = RESULTADO_ABAIXO;

  } else if (valorTentativa > jogo.numeroAleatorio) {
    resultadoTentativa = RESULTADO_ACIMA;
  }

  // Adiciona uma linha à tabela de tentativas do utilizador.
  mostraTentativaAtual(jogo.tentativas.length, valorTentativa,
                       resultadoTentativa);

  // Verifica se o jogo terminou.
  if (valorTentativa == jogo.numeroAleatorio ||
      jogo.tentativas.length >= configuracao.numeroTentativas) {
    terminaJogo(resultadoTentativa, valorTentativa);
  }
}

/* ------------------------------------------------------------------------- */

/**
 * Inicializa o estado de um novo jogo, e atualiza a interface com o
 * utilizador, impedindo alterações na configuração do jogo.
 */
function iniciaJogo() {

  // A configuração do jogo não pode ser alterada enquanto este não terminar.
  document.getElementById(BOTAO_INICIA_JOGO).disabled = true;
  
  document.getElementById(BOTAO_NUMERO_TENTATIVAS).disabled = true;
  document.getElementById(BOTAO_MINIMO_ALEATORIO).disabled = true;
  // Exercício: Colocar aqui o código em falta.
  document.getElementById(BOTAO_MAXIMO_ALEATORIO).disabled = true;
  document.getElementById(BOTAO_DURACAO_MAXIMA).disabled = true;

  // Inicialização do estado do jogo.
  jogo.numeroAleatorio =
    geraNumeroInteiroAleatorio(configuracao.minimoAleatorio,
                               configuracao.maximoAleatorio);
  jogo.tentativas = [];
  jogo.inicio = Math.floor(Date.now() / 1000)

  // Inicializar o temporizador de jogo
  temporizadorTempoRestante = setInterval(mostraTempoRestante, 1000)
  temporizadorDuracaoMaxima = setTimeout(() => terminaJogo(RESULTADO_TEMPO_ESGOTADO), configuracao.duracaoMaxima * 1000)

  // Podem estar a ser mostradas tentativas anteriores se este não for o
  // primeiro jogo, as quais devem ser removidas da tabela para se poder
  // começar o novo jogo.
  removeTentativasAnteriores();

  // Permite que o utilizador faça tentativas para adivinhar o número.
  document.getElementById(BOTAO_FAZ_TENTATIVA).disabled = false;
  document.getElementById(BOTAO_CANCELA_JOGO).disabled = false;
}

/* ------------------------------------------------------------------------- */

/**
 * Termina um jogo, mostrando uma mensagem com o resultado ao utilizador, e
 * atualiza a interface para permitir a configuração de um novo jogo.
 * 
 * @param {string} resultadoTentativaFinal Se acertou ou não no número.
 */
function terminaJogo(resultadoTentativaFinal) {

  // Para informar o utilizador.
  let valorTentativaFinal = jogo.tentativas[jogo.tentativas.length - 1];

  // Neste jogo não é possível fazer mais tentativas para adivinhar o número.
  document.getElementById(BOTAO_FAZ_TENTATIVA).disabled = true;
  document.getElementById(BOTAO_CANCELA_JOGO).disabled = true;

  // Parar o temporizador do jogo
  clearInterval(temporizadorTempoRestante)

  // Apresenta o resultado ao utilizador.
  if (resultadoTentativaFinal == RESULTADO_ACERTOU) {
    alert("Acertou! Era mesmo o número " + valorTentativaFinal + ".");
  } else {
    alert(resultadoTentativaFinal)
    // alert("Talvez tenha mais sorte no próximo jogo!");
  }

  // Permite a configuração e início de um novo jogo.
  document.getElementById(BOTAO_NUMERO_TENTATIVAS).disabled = false;
  document.getElementById(BOTAO_MINIMO_ALEATORIO).disabled = false;
  document.getElementById(BOTAO_MAXIMO_ALEATORIO).disabled = false;
  document.getElementById(BOTAO_INICIA_JOGO).disabled = false;
  document.getElementById(BOTAO_DURACAO_MAXIMA).disabled = false;
}

/* ------------------------------------------------------------------------- */

/** Cancela o jogo quando o botão de cancelar jogo é premido */
function cancelaJogo() {
  terminaJogo(RESULTADO_CANCELOU)
}

/* ------------------------------------------------------------------------- */

/**
 * Tendo em conta um determinado propósito, pede um número inteiro ao
 * utilizador, o qual tem de estar dentro do intervalo de validade definido
 * pelos argumentos atribuídos aos dois últimos parâmetros da função. O pedido
 * é feito as vezes necessárias até ser obtido um valor válido.
 * 
 * O texto do pedido deve ser na forma:
 * 
 *  - <Texto do propósito>, digite um número inteiro entre A e B.
 * 
 * Se o utilizador introduzir um valor inválido, o pedido seguinte deve ser
 * precedido de uma das seguintes mensagens:
 * 
 *  - O valor 'T' não é um número inteiro.
 *  - O valor N está fora do intervalo de validade.
 * 
 * Assume-se que os parâmetros que definem o intervalo de validade têm
 * argumentos corretos, isto é, que são números inteiros e que o valor mínimo
 * é menor que o máximo.
 * 
 * @param {number} minimo O menor número inteiro permitido.
 * @param {number} maximo O maior número inteiro permitido.
 * @param {string} proposito O propósito do pedido ao utilizador.
 * @returns {number} O número inteiro introduzido pelo utilizador.
 */
function pedeNumeroInteiro(minimo, maximo, proposito = PROPOSITO_ADIVINHAR) {
  // Exercício: Colocar aqui o código da função.
  while(true) {
    const res = prompt(`${proposito}, digite um número inteiro entre ${minimo} e ${maximo}.`)
      const parsed = parseInt(res)

    if (isNaN(parsed)) alert(`O valor ${res} não é um número inteiro.`)
    else if (parsed < minimo || parsed > maximo) alert(`O valor ${res} está fora do intervalo de validade.`)
    else return parsed
  }
}

/* ------------------------------------------------------------------------- */

/**
 * @param {number} minimo O menor número aleatório permitido.
 * @param {number} maximo O maior número aleatório permitido.
 * @returns {number} Um número inteiro aleatório dentro do intervalo permitido.
 */
function geraNumeroInteiroAleatorio(minimo = MINIMO_ALEATORIO_OMISSAO,
                                    maximo = MAXIMO_ALEATORIO_OMISSAO) {
  // Exercício: Colocar aqui o código da função.
  const num = Math.floor(Math.random() * (maximo - minimo + 1) + minimo) 
  
  return isNaN(num) ? configuracao.maximoAleatorio : num;
}

/**
 * ITW - Introdução às Tecnologias Web 2020/2021
 * Grupo n. 10
 *
 * Bernardo Rebelo  - 55856 - PL23
 * Daniel Barreto   - 34989 - PL23
 * Lucas Pinto      - 56926 - PL23
 */
// Break docs

'use strict';

const profile = Profile.loadOne(localStorage.getItem('currentUser'));

/**
 * @type {Game}
 */
let game;
let tick = 0;
let allowMovement = true;

function keyboardListener(e) {
  if (!allowMovement) return;

  let momentum = { x: 0, y: 0 };
  switch (e.key) {
    case 'w':
    case 'ArrowUp':
      momentum = { x: 0, y: -1 };
      break;
    case 'a':
    case 'ArrowLeft':
      momentum = { x: -1, y: 0 };
      break;
    case 's':
    case 'ArrowDown':
      momentum = { x: 0, y: 1 };
      break;
    case 'd':
    case 'ArrowRight':
      momentum = { x: 1, y: 0 };
      break;
    default:
      return;
  }

  // eslint-disable-next-line no-use-before-define
  move(momentum);
}

/**
 * Handles movement
 * @param {{x: number, y: number}} momentum Momentum to move the Player to
 */
async function move(momentum) {
  const currPlayer = game.players[tick % game.players.length];

  const newPos = game.movePlayer(currPlayer, momentum);
  if (newPos) {
    const idx = game.matrix.posToIdx(newPos);

    game.handleFinish(idx, () => { window.removeEventListener('keydown', keyboardListener); });

    const attackPokemon = game.matrix.spawnMonster(idx, currPlayer);
    if (attackPokemon) {
      allowMovement = false;
      await game.fight(attackPokemon, currPlayer);
      allowMovement = true;
    }
  }

  tick++;
  game.display(game.players[tick % game.players.length].pos);
}

const validMatrixes = Object.keys(matrixes);
/**
 * Queries for a Matrix
 * @returns {Promise<Matrix>} The selected Matrix
 */
function queryMatrix() {
  return new Promise((resolve) => {
    $('#mmatrixes').append(validMatrixes.map((mK, i) => $(`<input class="img" ${i === 0 ? 'checked' : ''} type="radio" name="mmatrix" value="${mK}" style="background-image:url('assets/images/matrix/maps/${mK}/built.png')"></input>`)));
    const $form = $('#fmatrix');

    $form.fadeIn();
    $form.on('submit', (d) => {
      const matrix = new Matrix(matrixes[$('input[name=mmatrix]:checked', '#fmatrix').val()]);

      d.preventDefault();
      $form.hide();

      resolve(matrix);
    });
  });
}

const validCharacters = Object.keys(characters);

const validPokemons = [pokemons.snorlax, pokemons.quilava, pokemons.ivysaur];

/**
 * Gets the Player base data
 * @returns {Promise<Player>} The Player object
 */
function getPlayerBase() {
  return new Promise((resolve) => {
    $('#fplayer').on('submit', (d) => {
      const $name = $('#pname');
      const $character = $('input[name=pcharacter]:checked', '#fplayer');
      const $pokemon = $('input[name=ppokemon]:checked', '#fplayer');

      const player = new Player({
        name: $name.val(),
        images: characters[$character.val()].images,
        inventory: [new Pokemon(pokemons[$pokemon.val()])],
      });

      d.preventDefault();

      resolve(player);
    });
  });
}

/**
 * Queries for Player's data
 * @param {Matrix} map The map chosen
 * @returns {Promise<Player[]>} The Player array
 */
async function queryPlayers(map) {
  $('#ppokemons').append(validPokemons.map((pokemon, i) => $(`<input class="img" ${i === 0 ? 'checked' : ''} type="radio" name="ppokemon" value="${pokemon.alias}" style="background-image:url('assets/images/pokemon/${pokemon.name.toLowerCase()}.png')"></input>`)));
  $('#pcharacters').append(validCharacters.map((cK, i) => $(`<input class="img" ${i === 0 ? 'checked' : ''} type="radio" name="pcharacter" value="${cK}" style="background-image:url('assets/images/character/${characters[cK].name}/down/f1.png')"></input>`)));

  const $form = $('#fplayer');
  $form.fadeIn();

  const $pList = $('#pplist');
  $pList.fadeIn();

  const players = [];
  do {
    $form.trigger('reset');

    const player = await getPlayerBase();
    player.pos = map.startPos;

    players.push(player);
    $pList.text(players.map((p) => p.name).join(', '));
  // eslint-disable-next-line no-alert
  } while (window.confirm('Would you like to add another player?\nPress Ok if yes, cancel otherwise.'));

  $pList.fadeOut();
  $form.fadeOut();
  return players;
}

/**
 * Game Entry Point
 */
async function main() {
  // eslint-disable-next-line no-console
  console.log('Hello');

  if (!profile) {
    window.location.href = window.location.href.replace('game.html', 'auth.html');
  }

  const matrix = await queryMatrix();
  const players = await queryPlayers(matrix);
  $('#startMenu').fadeOut();

  $('#theme').trigger('play');
  game = new Game({ players, matrix });

  // move({ x: 1, y: 0 });
  window.addEventListener('keydown', keyboardListener);
}

// Startup
$(document).ready(main);

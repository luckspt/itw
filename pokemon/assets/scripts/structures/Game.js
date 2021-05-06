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

/**
 * Represents a Game
 */
// eslint-disable-next-line no-unused-vars
class Game {
  /**
   * Creates a game
   * @param {{
   *  battles?: Battle[],
   *  matrix: Matrix,
   *  players: Player[]
   * }} data Game data
   */
  constructor({ battles, matrix, players }) {
    /**
     * Battles fought
     */
    this.battles = battles ?? [];

    /**
     * The Game Matrix
     */
    this.matrix = matrix;

    /**
     * The in-game Players
     */
    this.players = players;

    this.main();
  }

  /**
   * Game Start
   */
  main() {
    /**
     * The timestamp of the start of the game
     */
    this.startTimestamp = Date.now();

    this.hurtElement = $('#unwalkableSound');

    this.players.forEach((player) => player.display(this.matrix.subMatrix));
  }

  /**
   * Move the Player to a new position
   * @param {Player} player The Player to move
   * @param {{ x: number, y: number }} amount Amount to move the Player
   * @returns {{x: number, y: number }} If the player was moved
   */
  movePlayer(player, amount) {
    if (this.endTimestamp) return;

    const to = player.nextPos(amount);
    if (this.matrix.isWalkable(to)) {
      player.move(amount, this.matrix.subMatrix);

      // eslint-disable-next-line consistent-return
      return to;
    }

    this.startTimestamp -= 2000;
    this.hurtElement.trigger('play');
  }

  /**
   * Checks if game finishes and shows credits
   * @param {number} idx Index of the tile to check for finish
   * @param {Function} cbFinished If finished call the function
   */
  handleFinish(idx, cbFinished) {
    if (this.matrix.finish === idx) {
      cbFinished();

      this.matrix.element.fadeOut();
      this.endTimestamp = Date.now();

      $('#theme').trigger('pause');
      $('#credits').fadeIn().trigger('play');
      $('#champions').trigger('play');
      $('#notOutCredits').fadeIn();

      const profile = Profile.loadOne(localStorage.getItem('currentUser'));
      profile.games.push(this);
      profile.getMostScoredGame();
      profile.save(true);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleGameOver() {
    console.log('game over');
    $('#theme').trigger('pause');
    $('#gameover').trigger('play');
    $('#playAgain').fadeIn();

    $('#playAgain button').on('click', () => window.location.reload());
  }

  /**
   * Emited when a player is attacked
   * @param {Pokemon|Player} attack The attacking Pokemon or Player
   * @param {Player} defense The defending Player
   */
  async fight(attack, defense) {
    const battle = new Battle(attack, defense);
    await battle.main();

    const isAttackPlayer = attack instanceof Player;

    switch (battle.outcome) {
      case 2:
        // Defense captured
        defense.inventory.push(battle.pokemons.attack);
      case 1: {
        // Attack killed
        if (isAttackPlayer) {
          const idx = attack.inventory.findIndex((p) => p.name === battle.pokemons.attack.name);
          attack.inventory.splice(idx, 1);
        }
        break;
      }

      case -2:
        // Attack captured
        attack.inventory.push(battle.pokemons.defense);
      case -1: {
        // Defense Killed
        const idx = defense.inventory.findIndex((p) => p.name === battle.pokemons.defense.name);
        defense.inventory.splice(idx, 1);

        break;
      }

      default:
        break;
    }

    this.players = this.players.filter((p) => p.inventory.length !== 0);
    if (this.players.length === 0) this.handleGameOver();

    // Store battle for stats
    this.battles.push(battle);
  }

  /**
   * Displays a game Frame
   * @param {{x: number, y: number}} pos Position to display the Matrix
   */
  display(pos) {
    const prevSubMatrix = { ...this.matrix.subMatrix };
    this.matrix.updateSubMatrix(pos);

    if (this.matrix.subMatrix.x !== prevSubMatrix.x
      || this.matrix.subMatrix.y !== prevSubMatrix.y) {
      this.players.forEach((p) => {
        const isOut = p.pos.x < this.matrix.subMatrix.x
                    || p.pos.y < this.matrix.subMatrix.y
                    || p.pos.x > this.matrix.subMatrix.x + this.matrix.subMatrix.width
                    || p.pos.y > this.matrix.subMatrix.y + this.matrix.subMatrix.height;
        p.display(this.matrix.subMatrix, isOut);
      });
    }
  }
}

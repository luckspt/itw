/* eslint-disable no-unreachable */
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
 * Represents a Battle
 */
// eslint-disable-next-line no-unused-vars
class Battle {
  /**
   *
   * @param {Pokemon|Player} attack The attacking Pokemon | Player
   * @param {Player} defense The defending Player
   */
  constructor(attack, defense) {
    /**
     * The Players
     */
    this.players = { attack, defense };

    /**
     * The Battle Pokemons
     * @type {{attack: Pokemon, defense: Pokemon }}
     */
    this.pokemons = { attack: null, defense: null };
  }

  /**
   * Checks if both Pokemons are alive
   * @returns {boolean} If both Pokemons are alive
   */
  bothAlive() {
    return this.pokemons.defense.stats.currentHp > 0 && this.pokemons.attack.stats.currentHp > 0;
  }

  /**
   * Displays the initial elements
   */
  display() {
    this.elements.main.fadeIn();

    $('#attack .stadiumChar').prop('src', `assets/images/pokemon/${this.pokemons.attack.alias.toLowerCase()}.png`);
    $('#attack .stats .name').text(this.pokemons.attack.name);
    this.elements.defenseChar.prop('src', `assets/images/pokemon/${this.pokemons.defense.alias.toLowerCase()}.png`);
    $('#defense .stats .name').text(this.pokemons.defense.name);
    this.elements.attackProgress.prop({
      max: this.pokemons.attack.stats.hp,
      value: this.pokemons.attack.stats.currentHp,
    });
    this.elements.defenseProgress.prop({
      max: this.pokemons.defense.stats.hp,
      value: this.pokemons.defense.stats.currentHp,
    });

    this.displayStats();
  }

  /**
   * Displays the Pokemon Stats
   */
  displayStats() {
    this.elements.attackProgress.val(this.pokemons.attack.stats.currentHp);
    this.elements.defenseProgress.val(this.pokemons.defense.stats.currentHp);
  }

  /**
   * Displays a message
   * @param {string} message Message to display
   * @returns {Promise<undefined>}
   */
  displayMessage(message) {
    return new Promise((resolve) => {
      this.elements.message.fadeOut();
      setTimeout(() => {
        this.elements.message.text(message);
        this.elements.message.fadeIn();

        setTimeout(resolve, 2000);
      }, 500);
    });
  }

  /**
   * Calculates de damage dealt
   * @param {'attack' | 'defense'} source The Pokemon that is dealing the damage
   * @returns {number} Damage dealt
   */
  getDamageDealt(source) {
    const destiny = source === 'attack' ? 'defense' : 'attack';
    return (this.pokemons[source].stats.atk * 10 + this.pokemons[source].stats.currentHp)
      / (this.pokemons[destiny].stats.def);
  }

  /**
   * Handles the finish
   * 0 = one ran away;
   * 1 = attack killed, -1 = defense killed
   * 2 = defense captured, 2 = attack captured
   * @param {string} finish The outcome
   */
  handleFinish(finish) {
    const split = finish.split('-');

    let outcome = 0;
    if (split[0] === 'killed') {
      if (split[1] === 'defense') outcome = -1;
      else outcome = 1;
    } else if (split[0] === 'captured') {
      if (split[1] === 'defense') outcome = -2;
      else outcome = 2;
    }

    /**
     * The outcome of the Battle
     */
    this.outcome = outcome;

    this.elements.main.fadeOut();
  }

  /**
   * Battle Start
   */
  async main() {
    this.elements = {
      main: $('#battle'),
      attackProgress: $('#attack .stats progress'),
      defenseProgress: $('#defense .stats progress'),
      defenseChar: $('#defense .stadiumChar'),
      message: $('#battleMsg'),
    };
    const areBothPlayers = await this.getPokemons();

    this.display();

    // Lowest HP Pokemon starts
    let tick = this.pokemons.defense.stats.hp > this.pokemons.attack.stats.hp ? 0 : 1;
    let retData;

    for (; this.bothAlive(); tick++) {
      if (tick % 2 === 0) {
        // Player vs Player [Player1 turn]
        retData = await this.getMove('defense');
      } else if (areBothPlayers) {
        // Player vs Player [Player2 turn]
        retData = await this.getMove('attack');
      } else {
        // Player vs Computer [Computer turn]
        const damage = this.getDamageDealt('attack');
        this.pokemons.defense.stats.currentHp -= damage;

        if (this.pokemons.defense.stats.currentHp > 0) {
          retData = { message: `${this.pokemons.attack.name} dealt ${damage.toFixed(2)} damage!`, finish: 'continue' };
        } else {
          retData = { message: `${this.pokemons.attack.name} killed ${this.pokemons.attack.name}`, finish: 'killed-defense' };
        }
      }

      await this.displayMessage(retData.message);
      this.displayStats();
      if (retData.finish !== 'continue') break;
    }

    this.handleFinish(retData.finish);
  }

  /**
   * Ask the Player which move to do
   * @param {'attack' | 'defense'} source The Pokemon that should move
   * @returns {Promise<{
   *  message: string
   *  , finish: string}>} The outcome of the pokemon
   */
  getMove(source) {
    const destiny = source === 'attack' ? 'defense' : 'attack';
    const $el = $('#battleControls');
    $el.fadeIn();

    return new Promise((resolve) => {
      $el.one('click', (d) => {
        d.preventDefault();
        if (d.target.tagName !== 'BUTTON') return;

        const val = $(document.activeElement).val();
        let damage = 0;

        switch (val) {
          case 'rotate':
            this.elements.defenseChar.addClass('fa fa-spin');
            setTimeout(() => this.elements.defenseChar.removeClass('fa fa-spin'), 2000);

            damage = 5;
            break;

          case 'run': {
            const prob = Math.random() < 0.75;
            if (prob) {
              resolve({ message: `${this.pokemons[source].name} ran away!`, finish: 'ran' });
            } else resolve({ message: `${this.pokemons[source].name} tried to run away!`, finish: 'continue' });
            return;
          }

          case 'capture': {
            const prob = Math.random() < 0.85;
            if (prob
              && this.pokemons[source].stats.currentHp
                > this.pokemons[destiny].stats.currentHp * 1.5) {
              resolve({ message: `${this.pokemons[source].name} captured ${this.pokemons[destiny].name}`, finish: `captured-${destiny}` });
            } else resolve({ message: `${this.pokemons[source].name} tried to capture ${this.pokemons[destiny].name}`, finish: 'continue' });
            return;
          }

          case 'attack':
            damage = this.getDamageDealt(source);
            break;

          default:
            break;
        }

        this.pokemons[destiny].stats.currentHp -= damage;

        if (this.pokemons[destiny].stats.currentHp > 0) {
          resolve({ message: `${this.pokemons[source].name} dealt ${damage.toFixed(2)} damage!`, finish: 'continue' });
        } else {
          resolve({ message: `${this.pokemons[source].name} killed ${this.pokemons[destiny].name}`, finish: `killed-${destiny}` });
        }
      });
    }).then((res) => {
      $el.fadeOut();
      return res;
    });
  }

  /**
   * Queries for the Player's Pokemons
   * @returns {Promise<boolean>} If it's a battle between two users
   */
  async getPokemons() {
    let bothPlayers = false;
    if (this.attack instanceof Player) {
      await this.queryPlayerPokemon('attack');
      bothPlayers = true;
    } else this.pokemons.attack = this.players.attack;

    await this.queryPlayerPokemon('defense');
    return bothPlayers;
  }

  /**
   * Queries a Player for their chosen Pokemon
   * @param {'attack' | 'defense'} source The player to ask for a Pokemon
   * @returns {Promise<Pokemon>} The chosen Pokemon
   */
  queryPlayerPokemon(source) {
    return new Promise((resolve) => {
      $('#choosePokemonPlayerName').text(this.players[source].name);

      const els = [];
      for (let idx = 0; idx < this.players[source].inventory.length; idx++) {
        els.push($(`<div id="${idx}" class="card">
                  <h1>${this.players[source].inventory[idx].name}</h1>
                  <img src="assets/images/pokemon/${this.players[source].inventory[idx].name.toLowerCase()}.png"/>
                  </div>`));
      }

      $('#choosePokemonList').empty().append(els);
      $('#pokemonSelector').fadeIn();

      $('#choosePokemonList div').on('click', (e) => {
        let el = e.target;
        if (!el.id) el = el.parentElement;

        $('#pokemonSelector').fadeOut();

        this.pokemons[source] = this.players[source].inventory[parseInt(el.id)];
        resolve();
      });
    });
  }
}

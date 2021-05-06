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

// source: https://stackabuse.com/binary-search-in-javascript/
/**
 * Searches for a key in a sorted array
 * @param {Array<any>} sortedArray The sorted array to search for the key
 * @param {any} key Key to search for
 * @returns {int} Index of the key in the array (or -1 if not found)
 */
function binarySearch(sortedArray, key) {
  let start = 0;
  let end = sortedArray.length - 1;

  while (start <= end) {
    const middle = Math.floor((start + end) / 2);

    if (sortedArray[middle] === key) {
      // found the key
      return middle;
    } if (sortedArray[middle] < key) {
      // continue searching to the right
      start = middle + 1;
    } else {
      // search searching to the left
      end = middle - 1;
    }
  }
  // key wasn't found
  return -1;
}

/**
 * Represents a Matrix
 */
// eslint-disable-next-line no-unused-vars
class Matrix {
  /**
       * Creates a Matrix
       * @param {{
       *  unwalkable: number[],
       *  hostile: number[],
       *  finish: number,
       *  mapName: string,
       *  subMatrix?: { x: number, y: number, width: number, height: number },
       *  size?: { width: number, height: number }
       *  startPos?: { x: number, y: number }
       * }} data The Matrix data
       */
  constructor({
    mapName, unwalkable, hostile, finish, subMatrix, size, startPos,
  }) {
    /**
     * Matrix items that are unwalkable
     */
    this.unwalkable = unwalkable;

    /**
     * The Finish Matrix Item
     */
    this.finish = finish;

    /**
     * Hostile Matrix Items
     */
    this.hostile = hostile;

    /**
     * Map Name
     */
    this.mapName = mapName;

    /**
     * The real size of the matrix
     */
    this.size = size ?? { width: 5, height: 5 };

    /**
     * The sub-Matrix (displayed matrix)
     */
    this.subMatrix = subMatrix ?? {
      x: 0, y: 0, width: 5, height: 5,
    };

    /**
     * The Player start position
     */
    this.startPos = startPos;

    this._init();
  }

  /**
   * Initializes the Matrix
   * @private
   */
  _init() {
    this.element = $('#gameMatrix');
    this.element.css('grid-template-columns', `auto${' auto'.repeat(this.subMatrix.width - 1)}`);

    this.pokemonKeys = Object.keys(pokemons);

    this.createElements();
    this.display();
  }

  /**
   * Creates the Matrix Items where the sub-Matrix will be displayed
   * @private
   */
  createElements() {
    const els = [];
    for (let y = 0; y < this.subMatrix.height; y++) {
      for (let x = 0; x < this.subMatrix.width; x++) {
        els.push($(`<img id="i${x}-${y}" src="assets/images/matrix/transparent.png"></img>`));
      }
    }

    this.element.append(els);
  }

  /**
   * Converts a position from the 2D Matrix to the 1D Matrix
   * @param {{ x: number, y: number }} pos A position in the 2D Matrix
   * @returns {number} The index in the 1D Matrix
   */
  posToIdx({ x, y }) {
    return x + 1 + this.size.width * y;
  }

  /**
   * If the Matrix Item is walkable
   * @param {{ x: number, y: number }} pos Matrix Item position
   * @returns {boolean} If the Matrix Item is walkable
   */
  isWalkable({ x, y }) {
    if (x < 0 || y < 0 || x >= this.size.width || y >= this.size.height) { return false; }

    const i = this.posToIdx({ x, y });
    return binarySearch(this.unwalkable, i) === -1;
  }

  /**
   * Checks for the finish tile
   * @param {number} idx The index of the tile
   * @returns {boolean} If the index is the finish tile
   */
  isFinish(idx) {
    return this.finish === idx;
  }

  /**
   * Spawns a monster if the Player is in an hostile tile
   * @param {number} idx The index of the tile
   * @returns {Pokemon?} The monster that attacks the player or null
   */
  spawnMonster(idx) {
    if (binarySearch(this.hostile, idx) !== -1) {
      const isWorth = Math.random() < 0.25; // 25% probability
      if (isWorth) {
        const pokemon = new Pokemon(
          pokemons[this.pokemonKeys[Math.floor(Math.random() * this.pokemonKeys.length)]],
        );

        return pokemon;
      }
    }

    return null;
  }

  /**
   * Update the sub-Matrix if required
   * @param {{ x: number, y: number }} pos New player position
   */
  updateSubMatrix({ x, y }) {
    if (x < this.subMatrix.x
        || y < this.subMatrix.y
        || x >= this.subMatrix.x + this.subMatrix.width
        || y >= this.subMatrix.y + this.subMatrix.height) {
      this.subMatrix.x = Math.floor(x / this.subMatrix.width) * this.subMatrix.width;
      this.subMatrix.y = Math.floor(y / this.subMatrix.height) * this.subMatrix.height;

      this.display();
    }
  }

  /**
   * Display the sub-Matrix
   */
  display() {
    for (let y = 0; y < this.subMatrix.height; y++) {
      for (let x = 0; x < this.subMatrix.width; x++) {
        const element = $(`#i${x}-${y}`);
        element.css('background-image', `url("assets/images/matrix/maps/${this.mapName}/map_${(x + 1 + this.subMatrix.x) + this.size.width * (y + this.subMatrix.y)}.jpg")`);
      }
    }
  }
}

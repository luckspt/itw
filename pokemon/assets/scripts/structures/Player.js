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
 * Represents a Player
 */
// eslint-disable-next-line no-unused-vars
class Player {
  /**
   *
   * @param {{
   *  name: string,
   *  pos: { x: number, y: number },
   *  images: { up: string, down: string, left: string, right: string },
   *  inventory?: Pokemon[]
   * }} data The Player data
   */
  constructor({
    name, pos, images, inventory,
  }) {
    /**
     * The Player name
     */
    this.name = name;

    /**
     * The Player position on the Matrix
     */
    this.pos = pos;

    /**
     * The Player images
     */
    this.frames = { ...images, _tick: 0, _lastWay: 'down' };

    /**
     * The Player inventory
     */
    this.inventory = inventory ?? [];

    /**
     * Player ticks
     */
    this.ticks = 0;
  }

  /**
   * Returns the next position the Player will be
   * @param {{ x: number, y: number }} amount Next position incrementation
   * @returns
   */
  nextPos(amount) {
    return {
      x: this.pos.x + amount.x,
      y: this.pos.y + amount.y,
    };
  }

  /**
   * Move the Player to a new position and display it
   * @param {{ x: number, y: number }} amount Next position incrementation
   * @param {{ height: number, width: number }} subMatrixSize The size of the sub-Matrix
   */
  move({ x, y }, subMatrixSize) {
    this.display(subMatrixSize, true);
    this.pos = this.nextPos({ x, y });

    let way = 'up';
    if (x === 0 && y > 0) { way = 'down'; } else if (x < 0 && y === 0) { way = 'left'; } else if (x > 0 && y === 0) { way = 'right'; }

    this.frames._lastWay = way;
    this.display(subMatrixSize);
  }

  /**
   * Display the Player
   * @param {{height: number, width: number}} subMatrixSize The size of the sub-Matrix
   * @param {boolean = false} transparent If it should display a transparent player
   */
  display({ height, width }, transparent = false) {
    const el = $(`#i${this.pos.x % width}-${this.pos.y % height}`);
    if (transparent) el.prop('src', 'assets/images/matrix/transparent.png');
    else {
      const frames = this.frames[this.frames._lastWay];
      const frame = `assets/images/character/${frames[this.frames._tick % frames.length]}`;

      el.prop('src', frame);
      this.frames._tick++;
    }
  }
}

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
 * Represents a Pokemon
 */
// eslint-disable-next-line no-unused-vars
class Pokemon {
  /**
   * Creates a Pokemon
   * @param {{
   * name: string,
   * alias: string,
   * stats: { hp: number, atk: number, def: number }
   * }} data Init data
   */
  constructor({ name, alias, stats }) {
    /**
     * Pokemon name
     */
    this.name = name;

    /**
     * Pokemon alias
     */
    this.alias = alias;

    /**
     * Pokemon Base Stats
     */
    this.stats = { ...stats, currentHp: stats.hp };
  }
}

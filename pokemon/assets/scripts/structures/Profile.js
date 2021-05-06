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
 * Player Profile
 */
// eslint-disable-next-line no-unused-vars
class Profile {
  /**
   * Creates a profile
   * @param {{
   * name: string,
   * email: string,
   * password: string,
   * age: number,
   * gender: string,
   * games?: Game[],
   * starterPokemon: Pokemon,
   * }} data Init data
   */
  constructor({
    name, email, password, age, gender, games, starterPokemon,
  }) {
    /**
     * The player's name
     */
    this.name = name;

    /**
     * The player's email
     */
    this.email = email;

    /**
     * The player's hashed password
     */
    this.password = Profile.hashPwd(password);

    /**
     * The player's age
     */
    this.age = age;

    /**
     * The player's gender
     */
    this.gender = gender;

    /**
     * The player's games
     */
    this.games = games ?? [];

    /**
     * The starter Pokemon
     */
    this.starterPokemon = starterPokemon;
  }

  /**
   * Returns the most scored game
   * @returns {Game} The most scored game
   */
  getMostScoredGame() {
    const best = this.games.reduce(
      (prev, curr) => (
        (curr.endTimestamp - curr.startTimestamp < prev.endTimestamp - prev.startTimestamp
          ? curr : prev)),
    );

    return best;
  }

  /**
   * Saves the profile on localStorage
   * @param {boolean} force
   */
  save(force = false) {
    const profiles = Profile.loadAll();
    const idx = profiles.findIndex((p) => p.name === this.name);
    if (idx !== -1) {
      if (!force) throw new Error('Profile already exists');
      profiles[idx] = this;
    } else profiles.push(this);

    localStorage.setItem('profiles', JSON.stringify(profiles));
    localStorage.setItem('currentUser', this.name);
  }

  // Static Methods

  /**
   * This is in no way a password hash method.
   * For security porpuses, hashing should be done in the backend
   *  in order to not expose the database.
   * As there is no backend, it is mocked here.
   * @param {string} passwordText Password to be hashed
   * @returns {string} The hashed password
   */
  static hashPwd(passwordText) {
    return (passwordText === '') ? '' : Profile.hashPwd(passwordText.substr(1)) + passwordText.charAt(0);
  }

  /**
   * This is no way a auth method.
   * For security porpuses, authentication should be done in the backend
   *  in order to not expose the database.
   * As there is no backend, it is mocked here.
   * @param {{email?: string, name?: string, password: string}} credentials
   * @throws {Error} If there are invalid credentials
   * @returns {Profile} The user matching the credentials
   */
  static auth(credentials) {
    const profiles = Profile.loadAll();
    const pwd = Profile.hashPwd(credentials.password);

    const user = profiles.find(
      (p) => (p.email === credentials.email || p.name === credentials.email)
              && p.password === pwd,
    );

    if (!user) throw new Error('Invalid credentials!');
    else {
      localStorage.setItem('currentUser', user.name);
      return new Profile(user);
    }
  }

  /**
   * Loads a single profile
   * @param {string} name Name of the profile to load
   * @returns {Profile|null} The loaded profile or null
   */
  static loadOne(name) {
    const profile = Profile.loadAll().find((p) => p.name === name);
    return profile ? new Profile(profile) : null;
  }

  /**
   * Loads all profiles from localStorage
   * @returns {Profile[]} The loaded profiles
   */
  static loadAll() {
    return JSON.parse(localStorage.getItem('profiles') ?? '[]').map((p) => new Profile(p));
  }
}

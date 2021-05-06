/**
 * ITW - Introdução às Tecnologias Web 2020/2021
 * Grupo n. 10
 *
 * Bernardo Rebelo  - 55856 - PL23
 * Daniel Barreto   - 34989 - PL23
 * Lucas Pinto      - 56926 - PL23
 */

'use strict';

// Break Docs

/**
 * Mutates showcase.
 * @param {Object} data - Object with new showcase data
 * @param {string} data.background - Showcase background URL
 * @param {string} [data.title] - Showcase title
 * @param {string} [data.header] - Showcase description
 */
const mutateShowcase = (data) => {
  $('.showcase').css('background-image', `url(${data.background})`);

  if (data.header) { $('.showcase .pokedialog .header').text(data.header).fadeIn(); }

  if (data.description) {
    $('.showcase .pokedialog .description').text(data.description).fadeIn();
  }
};

/**
 * Starter pokemons
 * @type {{
 * showcaseIvysaur: {
 *  background: string
 * , header: string
 * , description: string }
 *, showcaseQuilava: {
 *  background: string
 * , header: string
 * , description: string}
 * , showcaseSnorlax: {
 *   background: string
 * , header: string
 * , description: string} }}
 */
const pokemons = {
  showcaseSnorlax: {
    header: 'Snorlax', description: 'Hi, I\'m Snowrla..... zzzzZZZZZzzzzzzz', background: 'assets/images/snorlaxBackground.png',
  },
  showcaseQuilava: {
    header: 'Quilava', description: 'aaaaaaaaa', background: 'assets/images/quilavaBackground.png',
  },
  showcaseIvysaur: {
    header: 'Ivysaur', description: 'ivyyy', background: 'assets/images/ivysaurBackground.png',
  },
};

$(() => {
  // Handle Showcase
  mutateShowcase(pokemons.showcaseSnorlax);
  $('#showcaseSnorlax, #showcaseQuilava, #showcaseIvysaur').mouseenter((e) => {
    mutateShowcase(pokemons[e.target.id]);
  });

  // Start Game
  $('#btnPlay').click(() => {
    const starterPokemon = $('.header.pixelfont');
    window.location.href = window.location.href.replace('index.html', `auth.html?starter=${starterPokemon.text()}`);
  });
});

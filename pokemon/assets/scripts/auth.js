/**
 * ITW - Introdução às Tecnologias Web 2020/2021
 * Grupo n. 10
 *
 * Bernardo Rebelo  - 55856 - PL23
 * Daniel Barreto   - 34989 - PL23
 * Lucas Pinto      - 56926 - PL23
 */

'use strict';

let profile = Profile.loadOne(localStorage.getItem('currentUser'));
if (profile) {
  // eslint-disable-next-line no-alert
  if (window.confirm('You\'re already logged in. Would you like to be redirected to game page?')) { window.location.href = window.location.href.replace('auth.html', 'game.html'); }
}

function main() {
  $('#login').on('submit', (d) => {
    const cred = $('#lcred').val();
    const pwd = $('#lpwd').val();

    try {
      profile = Profile.auth({ email: cred, name: cred, password: pwd });
      window.location.href = window.location.href.replace('auth.html', 'game.html');
    } catch {
      // eslint-disable-next-line no-alert
      alert('Invalid Credentials! Try again!');
    }

    d.preventDefault();
  });

  $('#register').on('submit', (d) => {
    const name = $('#runame').val();
    const email = $('#remail').val();
    const password = $('#rpwd').val();
    const cpwd = $('#rcpwd').val();
    const gender = $('#rgender').val();
    const age = $('#rage').val();

    try {
      if (password !== cpwd) throw new Error('Passwords do not match!');
      profile = new Profile({
        name, email, password, age, gender,
      });
      profile.save();

      window.location.href = window.location.href.replace('auth.html', 'game.html');
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }

    d.preventDefault();
  });
}

$(document).ready(main);

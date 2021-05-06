/**
 * ITW - Introdução às Tecnologias Web 2020/2021
 * Grupo n. 10
 *
 * Bernardo Rebelo  - 55856 - PL23
 * Daniel Barreto   - 34989 - PL23
 * Lucas Pinto      - 56926 - PL23
 */

'use strict';

const profile = Profile.loadOne(localStorage.getItem('currentUser'));
const leaderboard = Profile.loadAll();
const len = leaderboard.length;

/**
 * Transform millisseconds to seconds and minutes
 * @param {number} ms milliseconds
 * @returns {string} Time in seconds and minutes
 */
function toTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes ? `${minutes}m ` : ''}${seconds < 10 ? '0' : ''}${seconds}s`;
}

/**
 * Build the leaderboard
 * @param {string} mapName The name of the map
 */
function showLb(mapName, $lbData) {
  $lbData.empty();
  // Only show top 10
  const lb = [...leaderboard]
    .map((p) => (
      {
        ...p,
        games: p.games.filter((g) => g.matrix.mapName === mapName),
        bestGame: p.getMostScoredGame(),
      }))
    .sort((a, b) => (a.bestGame.endTimestamp - a.bestGame.startTimestamp)
      - (b.bestGame.endTimestamp - b.bestGame.startTimestamp))
    .filter((p) => p.games.length !== 0)
    .slice(0, 10);

  if (!lb.length) $lbData.append('<p>No players found.</p>');
  else {
    $lbData.append(`
        <div class="row justify-center">
            <table id="leaderboard">
                <tr>
                    <th>Position</th>
                    <th>Name</th>
                    <th>Time</th>
                    <th>Battle Count</th>
                    <th>Pokemon Count</th>
                    <th>Was multiplayer</th>
                </tr>
                <tr>
                    ${lb.map((p, i) => `<td>${i + 1}</td><td>${p.name}</td><td>${toTime(p.bestGame.endTimestamp - p.bestGame.startTimestamp)}</td><td>${p.bestGame.battles.length}</td><td>${p.bestGame.players[0].inventory.length}</td><td>${p.bestGame.players.length === 0 ? 'No' : 'Yes'}</td>`).join('</tr><tr>')}
                </tr>
            </table>
            <p>Top ${lb.length} players from ${len}
        </div>`);
  }
}

/**
 * Return the most commong element of an array
 * https://stackoverflow.com/a/20762713
 * @param {any[]} arr Any array
 * @returns {any} The most common element
 */
function mode(arr) {
  return arr.sort((a, b) => arr.filter((v) => v === a).length
        - arr.filter((v) => v === b).length).pop();
}

/**
 * Gets the favorite map from the profile
 * @returns {string} The most common map name
 */
function getFavoriteMap() {
  const mappedGames = profile.games.map((g) => g.matrix.mapName);
  return mode(mappedGames);
}

function getBestMapsTime() {
  const groupped = _.groupBy(profile.games, (g) => g.matrix.mapName);
  const mapped = _.map(groupped,
    (matrix) => matrix.reduce(
      (prev, curr) => (
        prev.endTimestamp - prev.startTimestamp < curr.endTimestamp - curr.startTimestamp
          ? prev : curr),
    ));

  return mapped.map((g) => `${g.matrix.mapName} (${toTime(g.endTimestamp - g.startTimestamp)})`).join(', ');
}

function main() {
  $('#userUsername').text(profile?.name ?? 'Newcomer');

  const $lbMap = $('#lbMap');
  const $lbData = $('#lbData');
  $lbMap.append(Object.keys(matrixes).map((mK) => $(`<option value="${mK}">${mK}</option>`)));
  showLb($lbMap.val(), $lbData);

  $lbMap.on('change', () => {
    showLb($lbMap.val(), $lbData);
  });

  const $udata = $('#userData');
  if (!profile?.games.length) $udata.append($('<p>Still new? Start a new game <a href="game.html">here</a>!</p>'));
  else {
    $udata.append(`<ul>
    <li><strong>Favorite map</strong>: ${getFavoriteMap()}</li>
    <li><strong>Best times</strong>: ${getBestMapsTime()}</li>
    <li><strong>Games Player</strong>: ${profile.games.length}</li>
    </ul>`);
  }
}

$(document).ready(main);

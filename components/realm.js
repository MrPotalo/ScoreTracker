import 'realm';

const ScoreSet = { name: 'ScoreSet', properties: { scores: 'int[]' }};
const Round = { name: 'Round', properties: { ts: 'date', scoresets: 'ScoreSet[]' }};
const Game = {name: "Game", properties: {name: 'string', players: 'string[]', rounds: 'Round[]'}};

/*
Example DB
{
  games: [
    {name: 'example', players: [
      'example1', 'example2'
    ],
    rounds: [
      ts: 'datetime',
      scoresets: [
        {scores: [50, 10]}, {scores: [75, 10]} // player1, player2
      ]
    ]}
  ]
}
*/

export default new Realm({
  schema: [ScoreSet, Round, Game],
  schemaVersion: 3,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      oldRealm.objects('Game').forEach((game, i) => {
        const newGame = newRealm.objects('Game')[i];
        delete newGame.scores;
        newGame.rounds = [{ ts: new Date(), scores: game.scores }];
      });
    }

    if (oldRealm.schemaVersion < 3) {
      newRealm.objects('Game').forEach((game) => {
        game.rounds.forEach((round) => {
          round.scoresets = round.scores.map((score) => {
            return {scores: [score]}
          });
        })
      })
    }
  }
});
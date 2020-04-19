import 'realm';

const Round = { name: 'Round', properties: { scores: 'int[]' }};

export default new Realm({
  schema: [Round, {name: "Game", properties: {name: 'string', players: 'string[]', rounds: 'Round[]'}}],
  schemaVersion: 2,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      oldRealm.objects('Game').forEach((game, i) => {
        const newGame = newRealm.objects('Game')[i];
        delete newGame.scores;
        newGame.rounds = [{ scores: game.scores }];
      });
    }
  }
});
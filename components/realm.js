import 'realm';

const Round = { name: 'Round', properties: { ts: 'date', scores: 'int[]' }};

export default new Realm({
  schema: [Round, {name: "Game", properties: {name: 'string', players: 'string[]', rounds: 'Round[]'}}],
  schemaVersion: 2,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      oldRealm.objects('Game').forEach((game, i) => {
        const newGame = newRealm.objects('Game')[i];
        delete newGame.scores;
        newGame.rounds = [{ ts: new Date(), scores: game.scores }];
      });
    }
  }
});
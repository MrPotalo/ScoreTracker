import 'realm';

export default new Realm({
  schema: [{name: "Game", properties: {name: 'string', players: 'string[]', scores: 'int[]'}}]
});
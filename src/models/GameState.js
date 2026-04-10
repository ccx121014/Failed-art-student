class GameState {
  constructor() {
    this.games = new Map();
  }

  createGame() {
    const gameId = Math.random().toString(36).substring(2, 15);
    this.games.set(gameId, {
      history: [],
      currentStep: 0,
      gameOver: false,
      timeline: 1907 // 初始时间线
    });
    return gameId;
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  updateGame(gameId, updates) {
    const game = this.getGame(gameId);
    if (game) {
      Object.assign(game, updates);
      this.games.set(gameId, game);
    }
  }

  deleteGame(gameId) {
    this.games.delete(gameId);
  }

  getGamesCount() {
    return this.games.size;
  }
}

export default GameState;
